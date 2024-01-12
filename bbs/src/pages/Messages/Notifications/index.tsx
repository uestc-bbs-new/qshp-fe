import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'

import {
  Box,
  List,
  ListItem,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material'

import { getNotifications } from '@/apis/common'
import Avatar from '@/components/Avatar'
import Link from '@/components/Link'
import { chineseTime } from '@/utils/dayjs'
import { pages, useActiveRoute } from '@/utils/routes'

const kinds = {
  posts: [
    { id: 'reply', text: '回复' },
    { id: 'comment', text: '点评' },
    { id: 'at', text: '提到我的' },
    { id: 'rate', text: '评分' },
    { id: 'post_other', text: '其他' },
  ],
  system: [
    { id: 'friend', text: '好友' },
    { id: 'space', text: '个人空间' },
    { id: 'task', text: '任务' },
    { id: 'report', text: '举报' },
    { id: 'system', text: '系统提醒' },
    { id: 'admin', text: '公共消息' },
    { id: 'app', text: '应用提醒' },
  ],
}
const kDefaultGroup = 'posts'

const Notifications = () => {
  const route = useActiveRoute()
  const groupName = (route && (route.id as NotificationGroup)) || kDefaultGroup
  const kindName = useParams()['kind'] || kinds[groupName][0].id
  const { data } = useQuery(['messages', { kind: kindName }], {
    queryFn: () => getNotifications({}),
    refetchOnMount: true,
  })
  return (
    <Paper sx={{ flexGrow: 1 }}>
      <Tabs value={kindName}>
        {kinds[groupName].map((kind) => (
          <Tab
            component={Link}
            to={pages.notifications(groupName, kind.id)}
            label={kind.text}
            key={kind.id}
            value={kind.id}
          />
        ))}
      </Tabs>
      <List>
        {data?.rows.map((item, index) => (
          <ListItem key={index}>
            <Stack direction="row">
              <Avatar uid={item.author_id} variant="rounded" sx={{ mr: 1 }} />
              <Box>
                <Typography>{chineseTime(item.dateline * 1000)}</Typography>
                <div dangerouslySetInnerHTML={{ __html: item.note }} />
              </Box>
            </Stack>
          </ListItem>
        ))}
      </List>
    </Paper>
  )
}
export default Notifications
