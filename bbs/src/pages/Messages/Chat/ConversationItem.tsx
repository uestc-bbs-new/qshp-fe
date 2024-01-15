import { Groups } from '@mui/icons-material'
import {
  ListItem,
  ListItemButton,
  Avatar as MuiAvatar,
  Stack,
  Typography,
} from '@mui/material'

import { ChatConversation } from '@/common/interfaces/response'
import Avatar from '@/components/Avatar'
import Link from '@/components/Link'
import { useAppState } from '@/states'
import { chineseTime } from '@/utils/dayjs'
import { pages } from '@/utils/routes'

const ConversationItem = ({
  chat,
  selected,
  lite,
}: {
  chat: ChatConversation
  selected?: boolean
  lite?: boolean
}) => {
  const liteProps = lite
    ? {
        flexShrink: 1,
        minWidth: '1em',
      }
    : {}
  return (
    <ListItem key={chat.conversation_id} disableGutters disablePadding>
      <ListItemButton
        selected={selected}
        component={Link}
        to={pages.chat(chat.conversation_id)}
      >
        <Stack direction="row" {...liteProps}>
          <ChatAvatar chat={chat} />
          <Stack ml={2} flexShrink={1} minWidth="1em">
            <ChatUsers chat={chat} lite={lite} />
            <Summary chat={chat} lite={lite} />
            {!lite && (
              <Typography>{chineseTime(chat.last_dateline * 1000)}</Typography>
            )}
          </Stack>
        </Stack>
      </ListItemButton>
    </ListItem>
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

const ChatUsers = ({
  chat,
  lite,
}: {
  chat: ChatConversation
  lite?: boolean
}) => {
  if (lite) {
    return (
      <Typography>
        {chat.type == 'group' ? chat.subject : chat.to_username}
      </Typography>
    )
  }
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

const Summary = ({
  chat,
  lite,
}: {
  chat: ChatConversation
  lite?: boolean
}) => {
  const liteProps = lite
    ? {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }
    : {}
  if (chat.type == 'group') {
    return (
      <Typography {...liteProps}>
        {!lite && <>{chat.last_author}：</>}
        {chat.last_summary}
      </Typography>
    )
  }
  return <Typography {...liteProps}>{chat.last_summary}</Typography>
}

export default ConversationItem
