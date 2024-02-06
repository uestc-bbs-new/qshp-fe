import React, { useState } from 'react'

// import { useQuery } from 'react-query'
import {
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material'

import Avatar from '@/components/Avatar'
import Card from '@/components/Card'

import Favorite from './Favorite'
import Friends from './Friends'
import Information from './Information'
import MessageBoard from './MessageBoard'
import Side from './Side'
import UserThreads from './UserThreads'

type UserCardProps = {
  data?: null
}

const UserCard = ({ data }: UserCardProps) => {
  const basicIfo = [
    { id: 1, info: '积分' },
    { id: 2, info: '威望' },
    { id: 3, info: '水滴' },
    { id: 4, info: '好友' },
    { id: 5, info: '主题' },
    { id: 6, info: '回复' },
  ]
  return (
    <Paper>
      <Box
        sx={{
          backgroundImage:
            'linear-gradient(to bottom, rgb(210, 226, 253) 0%, rgb(210, 226, 253) 35%, rgb(255, 255, 255) 36%, rgb(255, 255, 255) 100%)',
        }}
      >
        <Stack direction="row">
          <Box sx={{ margin: 18 + 'px' }}>
            <Avatar
              alt="0"
              uid={0}
              sx={{ width: 218, height: 218 }}
              variant="rounded"
            />
          </Box>
          <Box>
            <Stack
              direction="row"
              className="mt-5"
              justifyContent="space-between"
            >
              <Box sx={{ height: 70, margin: '6px' }}>
                <Typography fontSize={24} fontWeight="bold">
                  用户名
                </Typography>
                <Stack
                  direction="row"
                  className="pr-2"
                  spacing={2}
                  alignItems="center"
                >
                  <Typography>等级</Typography>
                  <Typography>图标</Typography>
                </Stack>
              </Box>
              <Button
                style={{
                  color: 'black',
                  backgroundColor: 'rgb(255, 255, 255)',
                  height: 32,
                  marginTop: 8,
                  borderRadius: 8,
                }}
                variant="contained"
              >
                访问我的空间
              </Button>
            </Stack>
            <Box sx={{ width: 680, height: 62, margin: '5px' }}>
              <Stack direction="row" justifyContent="space-between">
                {basicIfo.map((item, index) => {
                  return (
                    <Stack alignItems="center" key={item.id}>
                      <Typography>{item.info}</Typography>
                      <Typography></Typography>
                    </Stack>
                  )
                })}
              </Stack>
            </Box>
            <Divider />
            <Box sx={{ width: 726, marginTop: 2 }}>
              <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
                <Button
                  style={{
                    color: 'black',
                    backgroundColor: 'rgb(255, 255, 255)',
                    height: 32,
                    borderRadius: 8,
                  }}
                  variant="contained"
                >
                  加为好友
                </Button>
                <Button variant="contained">开始私信</Button>
              </Stack>
            </Box>
          </Box>
        </Stack>
      </Box>
    </Paper>
  )
}

type SortProps = {
  sortType: number
  tapTypeChange: any
  children: React.ReactElement
}

const Sort = ({ sortType, tapTypeChange, children }: SortProps) => {
  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Tabs value={sortType} onChange={tapTypeChange}>
          <Tab label="个人资料" />
          <Tab label="帖子" />
          <Tab label="好友" />
          <Tab label="收藏" />
          <Tab label="留言板" />
        </Tabs>
      </Box>
      {children}
    </>
  )
}

interface TabPanelProps {
  children: React.ReactElement
  index: number
  sortType: number
}

function TabPanel(props: TabPanelProps) {
  const { children, sortType, index } = props
  return (
    <div role="tabpanel">{sortType === index && <Box>{children}</Box>}</div>
  )
}

function User() {
  const [sortType, setTypeValue] = useState(0)

  const tapTypeChange = (event: any, value: number) => {
    setTypeValue(value)
    console.log(value)
  }

  return (
    <Box>
      <Stack direction="row" justifyContent={'space-between'}>
        <Box sx={{ width: 1010 }}>
          <UserCard></UserCard>
          <Sort sortType={sortType} tapTypeChange={tapTypeChange}>
            <Card>
              <Box>
                <TabPanel sortType={sortType} index={0}>
                  <Information></Information>
                </TabPanel>
                <TabPanel sortType={sortType} index={1}>
                  <UserThreads></UserThreads>
                </TabPanel>
                <TabPanel sortType={sortType} index={2}>
                  <Friends></Friends>
                </TabPanel>
                <TabPanel sortType={sortType} index={3}>
                  <Favorite></Favorite>
                </TabPanel>
                <TabPanel sortType={sortType} index={4}>
                  <MessageBoard></MessageBoard>
                </TabPanel>
              </Box>
            </Card>
          </Sort>
        </Box>
        <Side></Side>
      </Stack>
    </Box>
  )
}
export default User
