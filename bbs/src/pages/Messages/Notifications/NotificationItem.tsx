import { Box, ListItem, Stack, Typography } from '@mui/material'

import { Notification } from '@/common/interfaces/response'
import Avatar from '@/components/Avatar'
import { chineseTime } from '@/utils/dayjs'

import NotificationRenderer from './NotificationRenderer'

const NotificationItem = ({ item }: { item: Notification }) => (
  <ListItem>
    <Stack direction="row">
      <Avatar uid={item.author_id} variant="rounded" sx={{ mr: 1 }} />
      <Box>
        <Typography>{chineseTime(item.dateline * 1000)}</Typography>
        <NotificationRenderer item={item} />
      </Box>
    </Stack>
  </ListItem>
)

export default NotificationItem
