import React, { useEffect, useState } from 'react'

import { Box, Divider, Grid, Stack, Typography, useTheme } from '@mui/material'

import coverDark from '@/assets/cover-dark.jpg'
import coverLight from '@/assets/cover-light.jpg'
import { PostFloor } from '@/common/interfaces/response'
import Tooltip from '@/components/Tooltip'
import { useAppState } from '@/states'

import Avatar from '../Avatar'
import Chip from '../Chip'

type ItemProps = {
  title: string
  count: number
}
const GridItem = ({ title, count }: ItemProps) => {
  const theme = useTheme()

  return (
    <Grid item xs={3}>
      <Box className="p-4 text-center">
        <Typography fontSize="inherit" color={theme.palette.text.secondary}>
          {title}
        </Typography>
        <Typography fontSize="inherit" color={theme.palette.text.primary}>
          {count}
        </Typography>
      </Box>
    </Grid>
  )
}

const Cover = ({ item }: { item: PostFloor }) => {
  const { state } = useAppState()
  const [data, set_data] = useState({})
  useEffect(() => {
    console.log(state.theme)
    console.log(item)
  }, [])
  // const { data: info, isLoading: infoLoading } = useQuery([], () => {
  //   console.log('请求个人信息详情')
  //   return getUserInfo(uid)
  // })
  return (
    <Box style={{ width: '400px' }} className="text-sm text-white">
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
            <Typography>{item.author}</Typography>
            <Chip className="mb-2" text="test" />
            <Box className="rounded-lg p-4 bg-opacity-40 bg-black">
              <Typography fontSize="inherit">
                注册： {item.registered_at}
              </Typography>
              <Typography fontSize="inherit" className="mt-2">
                在线时长： {item.online_time}
              </Typography>
            </Box>
          </Box>
        </Stack>
      </Box>
      <Divider variant="middle" />
      <Grid container>
        <GridItem title="水滴" count={item.droplets} />
        <GridItem title="用户组" count={item.user_group} />
        <GridItem title="水滴" count={1} />
        <GridItem title="水滴" count={1} />
        <GridItem title="水滴" count={1} />
      </Grid>
      <Divider variant="middle" />
      {/* <Box className="p-4">
        <Button variant="outlined">私信</Button>
      </Box> */}
    </Box>
  )
}

type CardProps = {
  item: PostFloor
  children: React.ReactElement
}

const UserCard = ({ item, children }: CardProps) => {
  return (
    <>
      <Tooltip title={<Cover item={item} />}>{children}</Tooltip>
    </>
  )
}

export default UserCard
