import { useNavigate } from 'react-router-dom'

import { CollectionsBookmark, InfoOutlined } from '@mui/icons-material'
import { Box, ListItem, ListItemButton, Stack, Typography } from '@mui/material'

import { readNotification } from '@/apis/messages'
import { Notification } from '@/common/interfaces/response'
import Avatar from '@/components/Avatar'
import Link from '@/components/Link'
import { chineseTime } from '@/utils/dayjs'
import { pages } from '@/utils/routes'

import NotificationRenderer, {
  getNotificationTarget,
} from './NotificationRenderer'

const NotificationItem = ({
  item,
  summary,
  small,
}: {
  item: Notification
  summary?: boolean
  small?: boolean
}) => {
  const navigate = useNavigate()
  const avatar = item.author_id ? (
    <Avatar uid={item.author_id} sx={{ mr: 1 }} />
  ) : (
    <Stack
      width={40}
      height={40}
      justifyContent="center"
      alignItems="center"
      mr={1}
    >
      {item.kind == 'thread_collect' ? (
        <CollectionsBookmark
          htmlColor="#aaaaaa"
          sx={{ width: 28, height: 28 }}
        />
      ) : (
        <InfoOutlined htmlColor="#aaaaaa" sx={{ width: 28, height: 28 }} />
      )}
    </Stack>
  )
  const body = (
    <Stack direction="row">
      {summary ? (
        avatar
      ) : (
        <Link
          to={item.author_id ? pages.user({ uid: item.author_id }) : undefined}
        >
          {avatar}
        </Link>
      )}
      <Box sx={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
        {!summary && (
          <Typography>{chineseTime(item.dateline * 1000)}</Typography>
        )}
        <NotificationRenderer item={item} summary={summary} small={small} />
      </Box>
    </Stack>
  )

  const readAndOpenNotification = () => {
    readNotification(item.id, item.kind)
    const target = getNotificationTarget(item)
    if (target) {
      setTimeout(() => navigate(target), 300)
    }
  }

  return (
    <ListItem disablePadding={summary}>
      {summary ? (
        <ListItemButton
          sx={small ? { px: 1.25 } : undefined}
          onClick={readAndOpenNotification}
        >
          {body}
        </ListItemButton>
      ) : (
        body
      )}
    </ListItem>
  )
}

export default NotificationItem
