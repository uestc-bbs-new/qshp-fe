import React, { useEffect, useRef, useState } from 'react'

import { Box, Divider, Grid, Stack, Typography, useTheme } from '@mui/material'

import coverDark from '@/assets/cover-dark.jpg'
import coverLight from '@/assets/cover-light.jpg'
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

const Cover = ({ uid }: { uid: number }) => {
  const { state } = useAppState()
  useEffect(() => {
    console.log(state.theme)
  }, [])
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
            uid={uid}
            alt="avatar"
            className="mr-4"
            sx={{ width: 100, height: 100 }}
            variant="rounded"
          />
          <Box className="flex-1">
            <Typography>{123123}</Typography>
            <Chip className="mb-2" text="test" />
            <Box className="rounded-lg p-4 bg-opacity-40 bg-black">
              <Typography fontSize="inherit">注册： 2020/01/20</Typography>
              <Typography fontSize="inherit" className="mt-2">
                在线时长： 20小时
              </Typography>
            </Box>
          </Box>
        </Stack>
      </Box>
      <Divider variant="middle" />
      <Grid container>
        <GridItem title="水滴" count={1} />
        <GridItem title="水滴" count={1} />
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
  uid: number
  children: React.ReactElement
}

const UserCard = ({ uid, children }: CardProps) => {
  return (
    <>
      <Tooltip title={<Cover uid={uid} />}>{children}</Tooltip>
    </>
  )
}

export default UserCard
