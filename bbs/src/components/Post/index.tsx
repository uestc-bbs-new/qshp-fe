import {
  ModeCommentOutlined,
  RemoveRedEyeOutlined,
  ThumbUpAltOutlined,
} from '@mui/icons-material'
import React, { Box, Stack, Typography, Divider  } from '@mui/material'

import { Thread2 } from '@/common/interfaces/response'
import Chip from '@/components/Chip'
import UserCard from '@/components/UserCard'
import { chineseTime } from '@/utils/dayjs'

import Avatar from '../Avatar'
import Link from '../Link'

type PostProps = {
  data: Thread2
  small?: boolean
  className?: string
}

const formatNumber = (num:any) => {
  if (num >= 1000 && num < 1000000) {
    const formattedNum = (num / 1000).toFixed(1) + 'K';
    return formattedNum;
  }else if(num >= 1000000){
    const formattedNum = (num / 1000000).toFixed(1) + 'M';
    return formattedNum;
  }
  return num.toString();
}

const Post = ({ data, small, className }: PostProps) => {
  return (
    <Box className={small ? className : `${className} p-6`}>
      <Stack direction="row">
        {/* 帖子作者头像 */}
        <Box sx={{ mr: 2 }}>
          <Avatar
            alt={data.author}
            uid={data.author_id}
            sx={small ? { width: 35, height: 35 } : { width: 54, height: 54 }}
            variant="rounded"
          />
        </Box>
        <Box className="flex-1">
          <Stack justifyContent="space-between"  direction="column" sx={{ minWidth: 350 }}>
            <Stack direction="row">
              <Link
                to={`/thread/${data.thread_id}`}
                color="inherit"
                underline="hover"
                className={small ? 'line-clamp-3' : 'line-clamp-2'}
              >
                {/* 设置等级 */}
                <Box>
                  {/* 等级标签 */}
                  <Chip small={small} text="等级" />
                  {data.subject} {/* 帖子标题 */}
                </Box>
              </Link>
            </Stack>
            <Stack direction="row" alignItems="center" className="text-sm">
              <UserCard uid={data.author_id}>
                {/* 帖子作者名称 */}
                <Link color="inherit">{data.author}</Link>
              </UserCard>
              <Typography fontSize="inherit" className="pl-1">
                {`· ${chineseTime(data.dateline * 1000)}`} {/* 发布时间 */}
              </Typography>
            </Stack>
            {small ? (
              <></>
            ) : (
              <Stack>
                {/* <Typography variant="subtitle2">{data.subject}</Typography> 帖子标题 */}
              </Stack>
            )}
          </Stack>
        </Box>
        {small ? (
          <></>
        ) : (
          <Box>
            <Stack direction="row" justifyContent="flex-start" sx={{ width: 300, height:35}}>
              {/* 浏览次数 */}
              <Stack
                direction="row"
                className="w-1/3"
                alignItems="center"
                justifyContent="flex-end"
              >
                <RemoveRedEyeOutlined /> {/* 浏览次数图标 */}
                <Typography noWrap className="pl-2 text-right">
                  {formatNumber(data.views)} {/* 浏览次数 */}
                </Typography>
              </Stack>
              {/* 回复数 */}
              <Stack
                direction="row"
                className="w-1/3 pl-6"
                alignItems="center"
                justifyContent="flex-end"
              >
                <ModeCommentOutlined /> {/* 回复数图标 */}
                <Typography noWrap className="pl-2">
                  {formatNumber(data.replies)}
                </Typography> {/* 回复数 */}
              </Stack>
              {/* 点赞数 */}
              <Stack
                direction="row"
                className="w-1/3 pl-6"
                alignItems="center"
                justifyContent="flex-end"
              >
                <ThumbUpAltOutlined /> {/* 点赞数图标 */}
                <Typography noWrap className="pl-2">
                  {formatNumber(data.favorite_times)}
                  </Typography> {/* 点赞数 */}
              </Stack>
            </Stack>
            {/* 最新回复 */}
            <Stack direction="row" justifyContent="space-between">
              <Box>
                <Typography className="pl-6">{`最新回复: `}{data.last_poster}</Typography>
              </Box>
              <Box>
                <Typography>{chineseTime(data.last_post * 1000)}</Typography> {/* 最新回复时间 */}
              </Box>
            </Stack>
          </Box>
        )}
      </Stack>
    </Box>
  )
}

export default Post