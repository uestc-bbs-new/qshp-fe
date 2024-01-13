import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useParams, useSearchParams } from 'react-router-dom'

import { Groups } from '@mui/icons-material'
import {
  List,
  ListItem,
  ListItemButton,
  Avatar as MuiAvatar,
  Pagination,
  Paper,
  Stack,
  Typography,
} from '@mui/material'

import { getChatList } from '@/apis/common'
import { ChatConversation } from '@/common/interfaces/response'
import Avatar from '@/components/Avatar'
import Link from '@/components/Link'
import { useAppState } from '@/states'
import { chineseTime } from '@/utils/dayjs'
import { pages } from '@/utils/routes'
import { searchParamsAssign } from '@/utils/tools'

const Pm = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const chatId = useParams()['plid']
  const initQuery = () => {
    return {
      page: parseInt(searchParams.get('page') || '1') || 1,
    }
  }
  const [query, setQuery] = useState(initQuery())
  const { data } = useQuery(['messages', query], {
    queryFn: () => getChatList(query),
    refetchOnMount: true,
  })

  useEffect(() => {
    setQuery(initQuery())
  }, [searchParams])

  return (
    <Paper sx={{ flexGrow: 1 }}>
      <List disablePadding>
        {data?.rows.map((chat) => (
          <ListItem key={chat.conversation_id} disableGutters disablePadding>
            <ListItemButton
              component={Link}
              to={pages.chat(chat.conversation_id)}
            >
              <Stack direction="row">
                <ChatAvatar chat={chat} />
                <Stack ml={2}>
                  <ChatUsers chat={chat} />
                  <Summary chat={chat} />
                  <Typography>
                    {chineseTime(chat.last_dateline * 1000)}
                  </Typography>
                </Stack>
              </Stack>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Stack alignItems="center" my={1.5}>
        <Pagination
          boundaryCount={3}
          siblingCount={1}
          count={Math.ceil((data?.total || 1) / (data?.page_size || 1))}
          page={query.page}
          onChange={(_, page) =>
            setSearchParams(searchParamsAssign(searchParams, { page }))
          }
        />
      </Stack>
    </Paper>
  )
}

const ChatAvatar = ({ chat }: { chat: ChatConversation }) => {
  if (chat.type == 'group') {
    return (
      <MuiAvatar variant="rounded">
        <Groups />
      </MuiAvatar>
    )
  }
  return <Avatar variant="rounded" uid={chat.to_uid} />
}

const ChatUsers = ({ chat }: { chat: ChatConversation }) => {
  if (chat.type == 'group') {
    return (
      <Typography>
        {chat.member_count} 人群聊：{chat.subject}
      </Typography>
    )
  }
  const { state } = useAppState()
  const Self = (
    <Link to={pages.user()} underline="hover">
      您
    </Link>
  )
  const Other = (
    <Link to={pages.user({ uid: chat.to_uid })} underline="hover">
      {chat.to_username}
    </Link>
  )
  if (chat.last_author_id == state.user.uid) {
    return (
      <Typography>
        {Self} 对 {Other} 说：
      </Typography>
    )
  }
  return (
    <Typography>
      {Other} 对 {Self} 说：
    </Typography>
  )
}

const Summary = ({ chat }: { chat: ChatConversation }) => {
  if (chat.type == 'group') {
    return (
      <Typography>
        {chat.last_author}：{chat.last_summary}
      </Typography>
    )
  }
  return <Typography>{chat.last_summary}</Typography>
}

export default Pm
