import { Box, Stack, Typography } from '@mui/material'

import { TopListThread } from '@/common/interfaces/response'
import { chineseTime } from '@/utils/dayjs'
import { pages } from '@/utils/routes'

import Avatar from '../Avatar'
import Link from '../Link'
import Summary from './Summary'

const ThreadItemGrid = ({ item }: { item: TopListThread }) => {
  return (
    <Box
      p={1}
      sx={{
        borderRadius: '9px',
        boxShadow: '0 0 16px rgba(0, 0, 0, 0.2)',
      }}
    >
      <Stack direction="row" alignItems="center">
        <Link
          to={item.author_id ? `/user/${item.author_id}` : undefined}
          mr={1}
        >
          <Avatar alt={item.author} uid={item.author_id} size={48} />
        </Link>
        <Stack>
          <Link to={item.author_id ? `/user/${item.author_id}` : undefined}>
            {item.author}
          </Link>
          <Typography color="grey">
            {chineseTime(item.dateline * 1000, { short: true })}
          </Typography>
        </Stack>
      </Stack>
      <Link
        to={pages.thread(item.thread_id)}
        color="inherit"
        underline="hover"
        className="line-clamp-2"
      >
        <Typography textAlign="justify" variant="threadItemSubject">
          {item.subject}
        </Typography>
      </Link>
      <Summary item={item} />
    </Box>
  )
}

export default ThreadItemGrid
