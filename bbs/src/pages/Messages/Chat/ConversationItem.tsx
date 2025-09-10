import { forwardRef } from 'react'

import { Groups } from '@mui/icons-material'
import {
  Badge,
  Checkbox,
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
import { isPreviewRelease } from '@/utils/releaseMode'
import { pages } from '@/utils/routes'
import siteRoot from '@/utils/siteRoot'

type ConversationItemProps = {
  chat: ChatConversation
  selected?: boolean
  lite?: boolean
  summary?: boolean
  showOptSelect: boolean
  checked: boolean
  onCheckboxChange: (isChecked: boolean, id: number) => void
  small?: boolean
}

const ConversationItem = forwardRef<
  HTMLLIElement | null,
  ConversationItemProps
>(function ConversationItem(
  {
    chat,
    selected,
    lite,
    summary,
    showOptSelect,
    checked,
    onCheckboxChange,
    small,
  }: ConversationItemProps,
  ref?
) {
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onCheckboxChange(event.target.checked, chat.conversation_id)
  }

  const liteProps = lite
    ? {
        flexShrink: 1,
        minWidth: '1em',
      }
    : {}

  return (
    <ListItem
      key={chat.conversation_id}
      secondaryAction={
        showOptSelect && (
          <Checkbox
            edge="start"
            checked={checked}
            onChange={handleCheckboxChange}
            style={!lite ? { marginRight: '20px' } : { marginRight: '0px' }}
          />
        )
      }
      disableGutters
      disablePadding
      ref={ref}
    >
      <ListItemButton
        selected={selected || chat.unread}
        component={Link}
        to={
          isPreviewRelease
            ? `${siteRoot}/home.php?mod=space&do=pm&subop=view&${
                chat.to_uid
                  ? `touid=${chat.to_uid}`
                  : `plid=${chat.conversation_id}&type=1`
              }`
            : pages.chat(chat.conversation_id)
        }
        external={isPreviewRelease}
        target={isPreviewRelease ? '_blank' : undefined}
        sx={small ? { px: 1.25 } : undefined}
      >
        <Stack direction="row" {...liteProps}>
          <ChatAvatar chat={chat} summary={summary} />
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
})

// 根据聊天类型显示相应的头像
const ChatAvatar = ({
  chat,
  summary,
}: {
  chat: ChatConversation
  summary?: boolean
}) => {
  const avatar =
    chat.type == 'group' ? (
      <MuiAvatar variant="rounded">
        <Groups />
      </MuiAvatar>
    ) : (
      <Avatar uid={chat.to_uid} />
    )
  // 如果不是摘要模式且有未读消息，则在头像上显示未读消息的标记
  return !summary && chat.unread ? (
    <Badge color="warning" variant="dot">
      {avatar}
    </Badge>
  ) : (
    avatar
  )
}

// 显示聊天用户或群组名称
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

// 显示聊天摘要信息
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
