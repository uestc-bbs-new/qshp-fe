import { Face5, Textsms } from '@mui/icons-material'
import { Box, Stack, Typography, useTheme } from '@mui/material'

import { TopListThread } from '@/common/interfaces/response'
import { globalCache } from '@/states'
import { chineseTime } from '@/utils/dayjs'
import { pages } from '@/utils/routes'

import Avatar from '../Avatar'
import Link from '../Link'
import ForumSmall from '../icons/ForumSmall'
import Summary from './Summary'

const ThreadItemGrid = ({ item }: { item: TopListThread }) => {
  const theme = useTheme()
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
        mt={1}
        mb={0.5}
      >
        <Typography textAlign="justify" variant="threadItemSubject">
          {item.subject}
        </Typography>
      </Link>
      <Summary item={item} />
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        my={1}
      >
        <Typography variant="threadItemStat">
          <Stack direction="row" alignItems="center">
            <Face5 sx={{ mr: 0.5 }} />
            {item.views}
            <Textsms sx={{ ml: 1.5, mr: 0.5 }} />
            {item.replies}
          </Stack>
        </Typography>
        <Link
          to={pages.forum(item.forum_id)}
          underline="hover"
          color=""
          variant="threadItemForum"
          sx={{
            '&:hover': {
              color: '#2175F3',
              'svg path.fill': {
                fill: '#2175F3',
              },
              'svg path.stroke': {
                stroke: '#2175F3',
              },
            },
          }}
        >
          <Stack direction="row" alignItems="center">
            <ForumSmall color={theme.typography.threadItemForum.color} />
            <Typography ml={0.5} mr={2}>
              {globalCache.fidNameMap[item.forum_id]}
            </Typography>
          </Stack>
        </Link>
      </Stack>
    </Box>
  )
}

export default ThreadItemGrid
