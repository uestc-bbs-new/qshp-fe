import React, { Box, Typography, Avatar, Stack, Link } from '@mui/material'

import { chineseTime } from '@/utils/dayjs'

import {
  RemoveRedEyeOutlined,
  ModeCommentOutlined,
  ThumbUpAltOutlined,
} from '@mui/icons-material'

// import UserCard from '@/components/UserCard'
import Chip from '@/components/Chip'
import { Thread } from '@/common/interfaces/response'

type PostProps = {
  data: Thread
  small?: boolean
  className?: string
}

const Post = ({ data, small, className }: PostProps) => {
  return (
    <Box className={small ? className : `${className} p-6`}>
      <Stack direction="row">
        <Box sx={{ mr: 2 }}>
          <Avatar
            alt="Remy Sharp"
            src="https://mui.com/static/images/avatar/1.jpg"
            sx={small ? { width: 35, height: 35 } : { width: 54, height: 54 }}
            variant="rounded"
          />
        </Box>
        <Box className="flex-1">
          <Stack justifyContent="space-between">
            <Stack direction="row">
              <Link href={`/thread/${data.tid}`}>
                <Box>
                  <Chip small={small} text="等级" />
                  {data.subject}
                </Box>
              </Link>
            </Stack>
            <Stack direction="row">
              {/* <UserCard data={data} /> */}
              <Typography variant="subtitle2" className="pl-1">
                {`· ${chineseTime(data.dateline * 1000)}`}
              </Typography>
            </Stack>
            {small ? (
              <></>
            ) : (
              <Stack>
                <Typography variant="subtitle2">{data.subject}</Typography>
              </Stack>
            )}
          </Stack>
        </Box>
        {small ? (
          <></>
        ) : (
          <Box>
            <Stack direction="row">
              <Stack
                direction="row"
                className="w-1/3"
                alignItems="center"
                justifyContent="space-between"
              >
                <RemoveRedEyeOutlined />
                <Typography className="pl-2 text-right">
                  {data.views}
                </Typography>
              </Stack>
              <Stack
                direction="row"
                className="w-1/3 pl-6"
                alignItems="center"
                justifyContent="space-between"
              >
                <ModeCommentOutlined />
                <Typography className="pl-2">{data.replies}</Typography>
              </Stack>
              <Stack
                direction="row"
                className="w-1/3 pl-6"
                alignItems="center"
                justifyContent="space-between"
              >
                <ThumbUpAltOutlined />
                <Typography className="pl-2">{data.favtimes}</Typography>
              </Stack>
            </Stack>
            <Stack direction="row">
              <Box>
                <Typography className="pr-10">{`最新回复:`}</Typography>
              </Box>
              <Box>
                <Typography>{chineseTime(data.lastpost * 1000)}</Typography>
              </Box>
            </Stack>
          </Box>
        )}
      </Stack>
    </Box>
  )
}

export default Post
