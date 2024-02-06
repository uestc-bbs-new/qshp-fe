import { useNavigate } from 'react-router-dom'

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
}: {
  item: Notification
  summary?: boolean
}) => {
  const navigate = useNavigate()
  const avatar = <Avatar uid={item.author_id} sx={{ mr: 1 }} />
  const body = (
    <Stack direction="row">
      {summary ? (
        avatar
      ) : (
        <Link to={pages.user({ uid: item.author_id })}>{avatar}</Link>
      )}
      <Box>
        {!summary && (
          <Typography>{chineseTime(item.dateline * 1000)}</Typography>
        )}
        <NotificationRenderer item={item} summary={summary} />
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
        <ListItemButton onClick={readAndOpenNotification}>
          {body}
        </ListItemButton>
      ) : (
        body
      )}
    </ListItem>
  )
}

export default NotificationItem
