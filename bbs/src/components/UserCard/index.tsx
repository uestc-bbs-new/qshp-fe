import React from 'react'

import {
  Box,
  Button,
  Divider,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'

import coverDark from '@/assets/cover-dark.jpg'
import coverLight from '@/assets/cover-light.jpg'
import { PostAuthorDetails, PostFloor } from '@/common/interfaces/response'
import Tooltip from '@/components/Tooltip'
import { useAppState } from '@/states'
import { chineseTime } from '@/utils/dayjs'

import Avatar from '../Avatar'

type ItemProps = {
  title: string
  text: number | string
}
const GridItem = ({ title, text }: ItemProps) => {
  const theme = useTheme()

  return (
    <Stack flexGrow={1}>
      <Box className="p-4 text-center">
        <Typography fontSize="inherit" color={theme.palette.text.secondary}>
          {title}
        </Typography>
        <Typography fontSize="inherit" color={theme.palette.text.primary}>
          {text}
        </Typography>
      </Box>
    </Stack>
  )
}

const Cover = ({
  item,
  authorDetails,
}: {
  item: PostFloor
  authorDetails: PostAuthorDetails
}) => {
  const { state } = useAppState()
  return (
    <Box className="text-sm text-white">
      <Box
        className="p-4 bg-cover bg-center"
        style={{
          backgroundImage: `url(${
            state.theme === 'light' ? coverLight : coverDark
          })`,
        }}
      >
        <Stack direction="row">
          <Avatar
            uid={item.author_id}
            alt="avatar"
            className="mr-4"
            sx={{ width: 100, height: 100 }}
            variant="rounded"
          />
          <Box className="flex-1">
            <Typography variant="userCardName" className="ml-4">
              {item.author}
            </Typography>
            <Box className="rounded-lg px-4 py-1.5 bg-opacity-40 bg-black">
              <Typography fontSize="inherit">
                注册时间：{chineseTime(authorDetails.register_time * 1000)}
              </Typography>
              <Typography fontSize="inherit" className="mt-2">
                最后访问: {chineseTime(authorDetails.last_visit * 1000)}
              </Typography>
              <Typography fontSize="inherit" className="mt-2">
                在线时间: {authorDetails.online_time} 小时
              </Typography>
            </Box>
          </Box>
        </Stack>
      </Box>
      <Divider variant="middle" />
      <Stack direction="row">
        <GridItem title="精华" text={authorDetails.digests} />
        <GridItem title="帖子" text={authorDetails.posts} />
        <GridItem title="积分" text={authorDetails.credits} />
        <GridItem
          title="威望"
          text={`${authorDetails.ext_credits['威望'] || 0} 点`}
        />
        <GridItem
          title="水滴"
          text={`${authorDetails.ext_credits['水滴'] || 0} 滴`}
        />
      </Stack>
      <Divider variant="middle" />
      <Box className="p-4">
        <Button variant="outlined">私信</Button>
      </Box>
    </Box>
  )
}

type CardProps = {
  item: PostFloor
  children: React.ReactElement
}

const UserCard = ({ item, children }: CardProps) => {
  return item.author_details ? (
    <Tooltip title={<Cover item={item} authorDetails={item.author_details} />}>
      {children}
    </Tooltip>
  ) : (
    <>{children}</>
  )
}

export default UserCard
