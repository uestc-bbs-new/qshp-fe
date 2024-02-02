import { useQuery } from '@tanstack/react-query'

import { createRef, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useInView } from 'react-cool-inview'

import { Send } from '@mui/icons-material'
import {
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

import {
  ChatMessagesRequest,
  getChatMessages,
  sendChatMessage,
} from '@/apis/messages'
import { ChatConversation, ChatMessage } from '@/common/interfaces/response'
import Avatar from '@/components/Avatar'
import { useAppState } from '@/states'
import { chineseTime } from '@/utils/dayjs'
import { handleCtrlEnter } from '@/utils/tools'

import ConversationList from './ConversationList'

const kStartPollDelay = 30000
const kPollInterval = 20000

const Conversation = ({
  chatId,
  uid,
  initialList,
}: {
  chatId?: number
  uid?: number
  initialList?: ChatConversation[]
}) => {
  const { state } = useAppState()
  const [chatList, setChatList] = useState(initialList)
  const [isEnded, setEnded] = useState(false)
  const fetchMode = useRef('older')
  const [data, setData] = useState<ChatMessage[]>([])
  const initQuery = () => ({
    chatId,
    uid,
    chatList: !chatList?.length,
  })
  const [query, setQuery] = useState<ChatMessagesRequest>(initQuery())
  const {
    data: currentData,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['chat', query],
    queryFn: () => getChatMessages(query),
    gcTime: 0,
  })
  useEffect(() => {
    let timeoutId: number

    if (currentData) {
      if (currentData.chat_list) {
        setChatList(currentData.chat_list)
      }
      if (currentData.rows.length > 0) {
        if (data.length == 0) {
          timeoutId = setTimeout(() => setRefreshEnabled(true), kStartPollDelay)
        }
        fetchMode.current = 'older'
        setData(currentData.rows.reverse().concat(data))
      }
      if (currentData.total <= currentData.page_size) {
        setEnded(true)
      }
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [currentData])
  const [refreshEnabled, setRefreshEnabled] = useState(false)
  const { data: latestMessages, refetch: refreshNewMessages } = useQuery({
    queryKey: ['chatRefresh'],
    queryFn: () =>
      getChatMessages({
        chatId,
        uid,
        newer: true,
        dateline: data[data.length - 1].dateline,
        messageId: data[data.length - 1].message_id,
      }),
    enabled: !!data.length && refreshEnabled,
    refetchInterval: kPollInterval,
    gcTime: 0,
  })
  useEffect(() => {
    if (latestMessages && latestMessages.rows.length) {
      if (fetchMode.current != 'sent') {
        fetchMode.current = 'newer'
      }
      setData(data.concat(latestMessages.rows.reverse()))
    }
  }, [latestMessages])
  const { observe } = useInView({
    rootMargin: '50px 0px',
    onEnter: ({ unobserve }) => {
      unobserve()
      if (data.length) {
        setQuery({
          ...query,
          newer: false,
          dateline: data[0].dateline,
          messageId: data[0].message_id,
        })
      }
    },
  })
  const scrollContainer = createRef<HTMLUListElement>()
  const lastScrollHeight = useRef<number>()
  useLayoutEffect(() => {
    if (!scrollContainer.current) {
      return
    }
    if (fetchMode.current == 'older') {
      scrollContainer.current.scrollTop += Math.max(
        0,
        scrollContainer.current.scrollHeight - (lastScrollHeight.current || 0)
      )
    } else if (fetchMode.current == 'sent') {
      scrollContainer.current.scrollTo({
        top: scrollContainer.current.scrollHeight,
        behavior: 'smooth',
      })
      fetchMode.current = 'newer'
    }
    lastScrollHeight.current = scrollContainer.current.scrollHeight
  }, [data])
  useEffect(() => {
    setData([])
    lastScrollHeight.current = 0
    setEnded(false)
    setRefreshEnabled(false)
    setQuery(initQuery())
  }, [chatId, uid])

  const messageRef = useRef<HTMLTextAreaElement>()
  const [sendPending, setSendPending] = useState(false)
  const sendMessage = async () => {
    if (!messageRef.current?.value) {
      return
    }
    setSendPending(true)
    try {
      await sendChatMessage({
        conversation_id: chatId,
        message: messageRef.current.value,
      })
    } catch (_) {
      return
    } finally {
      setSendPending(false)
    }
    messageRef.current.value = ''
    fetchMode.current = 'sent'
    refreshNewMessages()
  }
  return (
    <Stack direction="row" maxHeight="calc(100vh - 200px)">
      <Box sx={{ width: 200 }} flexShrink={0} overflow="auto">
        <ConversationList
          list={chatList || []}
          lite={true}
          activeConversation={chatList?.find(
            (item) => item.conversation_id == chatId || item.to_uid == uid
          )}
        />
      </Box>
      <Stack flexGrow={1}>
        <List
          sx={{
            p: 1,
            overflow: 'auto',
            width: '100%',
            flexGrow: 1,
            flexShrink: 1,
          }}
          ref={scrollContainer}
        >
          {!isEnded && !(isFetching && query.page == 1) && (
            <ListItem
              key={`loading-older-${chatId}-${query.page}`}
              ref={isFetching ? undefined : observe}
              sx={{ justifyContent: 'center' }}
            >
              {isError ? (
                <Typography>加载失败</Typography>
              ) : (
                <Skeleton width="100%" height={40} />
              )}
            </ListItem>
          )}
          {data.map((item, index) => (
            <ListItem
              key={`${index}`}
              sx={{
                justifyContent:
                  item.author_id == state.user.uid ? 'flex-end' : 'flex-start',
                alignItems: 'flex-start',
              }}
            >
              {item.author_id != state.user.uid && (
                <Avatar uid={item.author_id} />
              )}
              <Stack mx={1} maxWidth="70%">
                <Typography
                  textAlign={
                    item.author_id == state.user.uid ? 'right' : 'left'
                  }
                  mb={0.5}
                >
                  {item.author}
                </Typography>
                <Paper elevation={3} sx={{ p: 1 }}>
                  <Typography sx={{ lineBreak: 'anywhere' }}>
                    {item.message}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    textAlign="right"
                    sx={{ color: '#999' }}
                  >
                    {chineseTime(item.dateline * 1000)}
                  </Typography>
                </Paper>
              </Stack>
              {item.author_id == state.user.uid && (
                <Avatar uid={item.author_id} />
              )}
            </ListItem>
          ))}
        </List>
        <Divider />
        <Stack
          direction="row"
          flexGrow={0}
          flexShrink={0}
          p={1.5}
          alignItems="flex-end"
        >
          <TextField
            multiline
            autoFocus
            rows={4}
            sx={{ flexGrow: 1, flexShrink: 1 }}
            onKeyDown={handleCtrlEnter(sendMessage)}
            inputRef={messageRef}
          />
          <IconButton
            sx={{ flexGrow: 0, flexShrink: 0, ml: 1, mb: 1 }}
            onClick={sendMessage}
            disabled={sendPending}
          >
            <Send />
          </IconButton>
        </Stack>
      </Stack>
    </Stack>
  )
}

export default Conversation
