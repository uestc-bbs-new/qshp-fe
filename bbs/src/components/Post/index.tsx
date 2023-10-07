import {
  ModeCommentOutlined,
  RemoveRedEyeOutlined,
  ThumbUpAltOutlined,
} from '@mui/icons-material'
import React, { Box, Stack, Typography, useTheme } from '@mui/material'

import { Thread } from '@/common/interfaces/response'
import Chip from '@/components/Chip'
import { chineseTime } from '@/utils/dayjs'

import Avatar from '../Avatar'
import Link from '../Link'

type PostProps = {
  data: Thread
  small?: boolean
  className?: string
}

const formatNumber = (num: any) => {
  if (num >= 1000 && num < 1000000) {
    const formattedNum = (num / 1000).toFixed(1) + 'K'
    return formattedNum
  } else if (num >= 1000000) {
    const formattedNum = (num / 1000000).toFixed(1) + 'M'
    return formattedNum
  }
  return num.toString()
}

const Post = ({ data, small, className }: PostProps) => {
  const theme = useTheme()
  return (
    <Box className={small ? className : `${className} p-0.5`}>
      <Box
        className={`rounded-lg ${
          small ? 'p-1' : 'shadow-lg p-4'
        } ${className} `}
        style={{
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Stack direction="row">
          <Box sx={small ? { mr: 0.7 } : { mr: 2 }}>
            <Avatar
              alt={data.author}
              uid={data.author_id}
              sx={small ? { width: 30, height: 30 } : { width: 54, height: 54 }}
              variant="rounded"
            />
          </Box>
          <Box className="flex-1">
            <Stack
              justifyContent="space-between"
              sx={small ? { minWidth: 0 } : { minWidth: 350 }}
            >
              <Stack direction="row">
                <Link
                  to={`/thread/${data.thread_id}`}
                  color="inherit"
                  underline="hover"
                  className={small ? 'line-clamp-3' : 'line-clamp-2'}
                >
                  <Box>
                    <Chip small={small} text={data.name} />
                    {data.subject}
                  </Box>
                </Link>
              </Stack>
              <Stack direction="row" alignItems="center" className="text-sm">
                <Link color="inherit">{data.author}</Link>
                {/* <UserCard uid={data.author_id}>
                  <Link color="inherit">{data.author}</Link>
                </UserCard> */}
                <Typography fontSize="inherit" className="pl-1">
                  {`· ${chineseTime(data.dateline * 1000)}`}
                </Typography>
              </Stack>
              {small ? (
                <></>
              ) : (
                <Stack>
                  {/* <Typography variant="subtitle2">{data.subject}</Typography> */}
                </Stack>
              )}
            </Stack>
          </Box>
          {small ? (
            <></>
          ) : (
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
          )}
        </Stack>
      </Box>
    </Box>
  )
}

export default Post
