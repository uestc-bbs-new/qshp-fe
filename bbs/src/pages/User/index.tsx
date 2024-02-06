import React from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

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
import Link from '@/components/Link'
import { pages } from '@/utils/routes'

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

const tabs = [
  { id: 'profile', title: '个人资料' },
  { id: 'threads', title: '帖子' },
  { id: 'friends', title: '好友' },
  { id: 'favorites', title: '收藏' },
  { id: 'comments', title: '留言板' },
]

const mapSubPageToTabId = (subPage?: string) => {
  if (!subPage) {
    return tabs[0].id
  }
  if (['threads', 'replies', 'postcomments'].includes(subPage)) {
    return 'threads'
  }
  return subPage
}

function User() {
  const params = useParams()
  const [searchParams] = useSearchParams()
  const user = {
    ...(params.uid && parseInt(params.uid)
      ? { uid: parseInt(params.uid) }
      : undefined),
    ...(params.username && { username: params.username }),
    ...(searchParams.get('additional') == 'removevlog' && {
      removeVisitLog: true,
    }),
    ...(searchParams.get('a') && {
      admin: true,
    }),
  }
  const activeTab = mapSubPageToTabId(params.subPage) || tabs[0].id

  return (
    <Box>
      <Stack direction="row">
        <Box mr={4} flexGrow={1} flexShrink={1} minWidth="1em">
          <UserCard></UserCard>
          <Tabs value={activeTab}>
            {tabs.map((tab) => (
              <Tab
                to={pages.user({ ...user, subPage: tab.id })}
                component={Link}
                key={tab.id}
                label={tab.title}
                value={tab.id}
              />
            ))}
          </Tabs>
          <Card>
            <>
              {activeTab == 'profile' && <Information />}
              {activeTab == 'threads' && <UserThreads commonQuery={user} />}
              {activeTab == 'friends' && <Friends />}
              {activeTab == 'favorites' && <Favorite />}
              {activeTab == 'comments' && <MessageBoard />}
            </>
          </Card>
        </Box>
        <Side></Side>
      </Stack>
    </Box>
  )
}
export default User
