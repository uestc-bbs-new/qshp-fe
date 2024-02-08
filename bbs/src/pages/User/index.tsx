import { useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

import { Box, Stack, Tab, Tabs } from '@mui/material'

import { CommonUserQueryRpsoense } from '@/common/interfaces/user'
import Card from '@/components/Card'
import Link from '@/components/Link'
import { pages } from '@/utils/routes'

import Favorite from './Favorite'
import Friends from './Friends'
import Information from './Information'
import MessageBoard from './MessageBoard'
import Side from './Side'
import UserCard from './UserCard'
import UserThreads from './UserThreads'

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
  const [commonUserData, setCommonUserData] =
    useState<CommonUserQueryRpsoense>()
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
    getUserSummary: !commonUserData,
    getRecentVisitors: !commonUserData,
  }
  const activeTab = mapSubPageToTabId(params.subPage) || tabs[0].id
  const onLoad = (data: CommonUserQueryRpsoense) =>
    setCommonUserData({ ...commonUserData, ...data })

  return (
    <Box>
      <Stack direction="row">
        <Box mr={4} flexGrow={1} flexShrink={1} minWidth="1em">
          <UserCard userSummary={commonUserData?.user_summary} />
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
              {activeTab == 'threads' && (
                <UserThreads commonQuery={user} onLoad={onLoad} />
              )}
              {activeTab == 'friends' && <Friends />}
              {activeTab == 'favorites' && <Favorite />}
              {activeTab == 'comments' && <MessageBoard />}
            </>
          </Card>
        </Box>
        <Side
          visitors={commonUserData?.recent_visitors}
          visits={commonUserData?.user_summary?.views}
        />
      </Stack>
    </Box>
  )
}
export default User
