import { useInfiniteQuery } from '@tanstack/react-query'

import { useState } from 'react'
import { useInView } from 'react-cool-inview'

import { Box, List, ListItem, Paper, Stack, Typography } from '@mui/material'

import { getChatMessages } from '@/apis/common'
import {
  ChatConversation,
  PaginationParams,
} from '@/common/interfaces/response'
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
          },
        ],
      }
    }
    const active = list[index]
    return {
      list: [active, ...list.slice(0, index), ...list.slice(index + 1)],
      active,
    }
  }
  const init = initChatList(initialList || [])
  const [activeConversation, setActiveConversation] = useState(init.active)
  const [chatList, setChatList] = useState(init.list)
  const [query, setQuery] = useState({ chatId, uid })
  const [pagination, setPagination] = useState<PaginationParams>()
  const { data, fetchNextPage } = useInfiniteQuery({
    queryKey: ['chat', query],
    queryFn: async ({ pageParam }) => {
      const result = await getChatMessages({
        ...query,
        page: pageParam,
        chatList: pageParam == 1,
      })
      setPagination({
        total: result.total,
        page_size: result.page_size,
        page: result.page,
      })
      return result.rows.reverse()
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) =>
      lastPageParam + 1,
  })
  const { observe } = useInView({
    rootMargin: '50px 0px',
    onEnter: ({ unobserve }) => {
      unobserve()
      fetchNextPage()
    },
  })
  return (
    <Stack direction="row">
      <Box sx={{ width: 200 }}>
        <ConversationList
          list={chatList}
          lite={true}
          activeConversation={activeConversation}
        />
      </Box>
      <List sx={{ p: 1 }}>
        {data?.pages
          .slice()
          .reverse()
          .map((page, i) =>
            page.reverse().map((item, j) => (
              <ListItem
                key={`${i}-${j}`}
                ref={i == 0 && j == 0 ? observe : null}
                sx={{
                  justifyContent:
                    item.author_id == state.user.uid
                      ? 'flex-end'
                      : 'flex-start',
                  alignItems: 'flex-start',
                }}
              >
                {item.author_id != state.user.uid && (
                  <Avatar variant="rounded" uid={item.author_id} />
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
                    <Typography>{item.message}</Typography>
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
            ))
          )}
      </List>
    </Stack>
  )
}

export default Conversation
