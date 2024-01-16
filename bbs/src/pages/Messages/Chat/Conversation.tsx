import { useQuery } from '@tanstack/react-query'

import { createRef, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useInView } from 'react-cool-inview'

import {
  Box,
  List,
  ListItem,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material'

import { getChatMessages } from '@/apis/common'
import { ChatConversation, ChatMessage } from '@/common/interfaces/response'
import Avatar from '@/components/Avatar'
import { useAppState } from '@/states'
import { chineseTime } from '@/utils/dayjs'

import ConversationList from './ConversationList'

type ChatListItem = Partial<ChatConversation> & {
  xxx?: number
}

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
  const initChatList = (list: ChatConversation[]) => {
    const index = list.findIndex(
      (item) => item.conversation_id == chatId || item.to_uid == uid
    )
    if (index == -1) {
      return {
        list: [
          {
            conversation_id: -1,
            unread: false,
            to_uid: uid || 0,
            to_username: '',
          } as ChatConversation, // TODO(fangjue): Fix it later.
        ],
      }
    }
    return {
      list,
      active: list[index],
    }
  }
  const init = initChatList(initialList || [])
  const [activeConversation, setActiveConversation] = useState(init.active)
  const [chatList, setChatList] = useState(init.list)
  const [isEnded, setEnded] = useState(false)
  const initQuery = () => ({
    chatId,
    uid,
    page: 1,
  })
  const [query, setQuery] = useState(initQuery())
  const {
    data: currentData,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['chat', query],
    queryFn: () =>
      getChatMessages({
        ...query,
        chatList: query.page == 1,
      }),
    gcTime: 0,
  })
  useEffect(() => {
    if (currentData) {
      console.log(currentData)
      if (currentData.rows.length > 0) {
        setData(currentData.rows.reverse().concat(data))
      }
      if (
        (currentData.page - 1) * currentData.page_size +
          currentData.rows.length >=
        currentData.total
      ) {
        setEnded(true)
      }
    }
  }, [currentData])
  const [data, setData] = useState<ChatMessage[]>([])
  const scheduleNextPage = useRef(false)
  const { observe } = useInView({
    rootMargin: '50px 0px',
    onEnter: ({ unobserve }) => {
      unobserve()
      setQuery({ ...query, page: query.page + 1 })
    },
  })
  const scrollContainer = createRef<HTMLUListElement>()
  const lastScrollHeight = useRef<number>()
  useLayoutEffect(() => {
    if (!scrollContainer.current) {
      return
    }
    if (query.page == 1) {
      scrollContainer.current.scrollTop = scrollContainer.current.scrollHeight
    } else {
      scrollContainer.current.scrollTop += Math.max(
        0,
        scrollContainer.current.scrollHeight - (lastScrollHeight.current || 0)
      )
    }
    lastScrollHeight.current = scrollContainer.current.scrollHeight
  }, [data])
  useEffect(() => {
    setData([])
    lastScrollHeight.current = 0
    scheduleNextPage.current = false
    setEnded(false)
    setActiveConversation(
      chatList.find(
        (item) => item.conversation_id == chatId || item.to_uid == uid
      )
    )
    setQuery(initQuery())
  }, [chatId, uid])
  return (
    <Stack direction="row" maxHeight="calc(100vh - 200px)">
      <Box sx={{ width: 200 }} flexShrink={0} overflow="auto">
        <ConversationList
          list={chatList}
          lite={true}
          activeConversation={activeConversation}
        />
      </Box>
      <List
        sx={{ p: 1, overflow: 'auto', width: '100%' }}
        ref={scrollContainer}
      >
        {!isEnded && !(isFetching && query.page == 1) && (
          <ListItem
            key={`loading-older-${chatId}-${query.page}`}
            ref={observe}
            sx={{ justifyContent: 'center' }}
          >
            <Skeleton width="100%" height={40} />
            {isError && <Typography>加载失败</Typography>}
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
              <Avatar variant="rounded" uid={item.author_id} />
            )}
            <Stack mx={1} maxWidth="70%">
              <Typography
                textAlign={item.author_id == state.user.uid ? 'right' : 'left'}
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
              <Avatar variant="rounded" uid={item.author_id} />
            )}
          </ListItem>
        ))}
      </List>
    </Stack>
  )
}

export default Conversation
