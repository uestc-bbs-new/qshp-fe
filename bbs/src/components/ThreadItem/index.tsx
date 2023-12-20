import {
  ModeCommentOutlined,
  RemoveRedEyeOutlined,
  ThumbUpAltOutlined,
} from '@mui/icons-material'
import { Box, Divider, Stack, Typography, useTheme } from '@mui/material'

import { ForumDetails, Thread } from '@/common/interfaces/response'
import Chip from '@/components/Chip'
import { chineseTime } from '@/utils/dayjs'
import { pages } from '@/utils/routes'

import Avatar from '../Avatar'
import Link from '../Link'

type PostProps = {
  data: Thread
  className?: string
  forumDetails?: ForumDetails
}

const formatNumber = (num: number) => {
  if (num >= 1000 && num < 1000000) {
    const formattedNum = (num / 1000).toFixed(1) + 'K'
    return formattedNum
  } else if (num >= 1000000) {
    const formattedNum = (num / 1000000).toFixed(1) + 'M'
    return formattedNum
  }
  return num
}

const ThreadItem = ({ data, className, forumDetails }: PostProps) => {
  const theme = useTheme()

  return (
    <Box className={`${className} p-0.5`}>
      <Box
        className={`rounded-lg p-4 ${className} `}
        style={{
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Stack direction="row">
          <Box sx={{ mr: 2 }}>
            <Avatar
              alt={data.author}
              uid={data.author_id}
              sx={{ width: 54, height: 54 }}
              variant="rounded"
            />
          </Box>
          <Box className="flex-1">
            <Stack
              justifyContent="space-between"
              direction="column"
              sx={{ minWidth: 350 }}
            >
              <Stack direction="row">
                {!!data.type_id &&
                  forumDetails?.thread_types_map &&
                  forumDetails?.thread_types_map[data.type_id] && (
                    <Chip
                      text={forumDetails?.thread_types_map[data.type_id].name}
                    />
                  )}
                <Link
                  to={pages.thread(data.thread_id)}
                  color="inherit"
                  underline="hover"
                  className="line-clamp-2"
                >
                  <Box>
                    <Typography textAlign="justify">{data.subject}</Typography>
                  </Box>
                </Link>
              </Stack>
              <Stack direction="row" alignItems="center" className="text-sm">
                <Link color="#3A71F2">{data.author}</Link>
                {/* <UserCard uid={data.author_id}>
                  <Link color="inherit">{data.author}</Link>
                </UserCard> */}
                <Typography fontSize="inherit" className="pl-1" color="grey">
                  {`· ${chineseTime(data.dateline * 1000)}`}
                </Typography>
              </Stack>
              <Stack>
                {/* <Typography variant="subtitle2">{data.subject}</Typography> */}
              </Stack>
            </Stack>
          </Box>
          <Box>
            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{ width: 265, height: 35 }}
            >
              <Stack
                direction="row"
                className="w-1/3 pr-2"
                alignItems="center"
                justifyContent="space-between"
              >
                <RemoveRedEyeOutlined />
                <Typography>{formatNumber(data.views)}</Typography>
              </Stack>
              <Stack
                direction="row"
                className="w-1/3 pl-3"
                alignItems="center"
                justifyContent="space-between"
              >
                <ModeCommentOutlined />
                <Typography>{formatNumber(data.replies)}</Typography>
              </Stack>
              <Stack
                direction="row"
                className="w-1/3 pl-5"
                alignItems="center"
                justifyContent="space-between"
              >
                <ThumbUpAltOutlined />
                <Typography>{formatNumber(data.favorite_times)}</Typography>
              </Stack>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Box>
                <Typography className="pr-10">
                  {`最新回复:`}
                  {data.last_poster}
                </Typography>
              </Box>
              <Typography>{chineseTime(data.last_post * 1000)}</Typography>
            </Stack>
          </Box>
        </Stack>
      </Box>
      <Divider variant="middle" style={{ backgroundColor: 'grey' }} />
    </Box>
  )
}

export const ThreadItemLite = ({
  item,
  className,
}: {
  item: Thread
  className?: string
}) => {
  const theme = useTheme()

  return (
    <Box className={className}>
      <Box
        className={`rounded-lg p-1 ${className}`}
        style={{
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Stack direction="row" alignItems="center">
          <Avatar
            alt={item.author}
            uid={item.author_id}
            sx={{ width: 30, height: 30 }}
            variant="rounded"
          />
          <Link
            to={pages.thread(item.thread_id)}
            color="inherit"
            underline="hover"
            className="line-clamp-3"
            ml={1.2}
          >
            <Typography textAlign="justify">{item.subject}</Typography>
          </Link>
        </Stack>
        <Stack
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          className="text-sm"
        >
          <Link color="#3A71F2">{item.author}</Link>
          <Typography fontSize="inherit" className="pl-1" color="grey">
            {`· ${chineseTime(item.dateline * 1000, true)}`}
          </Typography>
        </Stack>
      </Box>
    </Box>
  )
}

export default ThreadItem
