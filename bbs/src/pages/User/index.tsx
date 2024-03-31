import { useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

import { Box, Stack, Tab, Tabs } from '@mui/material'

import { CommonUserQueryRpsoense } from '@/common/interfaces/user'
import Card from '@/components/Card'
import Link from '@/components/Link'
import { useAppState } from '@/states'
import { pages } from '@/utils/routes'

import Favorites from './Favorites'
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
  const { state } = useAppState()
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
  }
  const self =
    user.uid == state.user.uid ||
    user.username == state.user.username ||
    (!user.uid && !user.username)
  const userChanged =
    (user.username &&
      user.username != commonUserData?.user_summary?.username) ||
    (user.uid && user.uid != commonUserData?.user_summary?.uid) ||
    (self && state.user.uid != commonUserData?.user_summary?.uid)
  const queryOptions = {
    getUserSummary: !commonUserData?.user_summary || userChanged,
    getRecentVisitors: !commonUserData?.recent_visitors || userChanged,
  }
  const activeTab = mapSubPageToTabId(params.subPage) || tabs[0].id
  const onLoad = (data: CommonUserQueryRpsoense) => {
    ;(data.user_summary || data.user_summary) &&
      setCommonUserData({
        ...commonUserData,
        ...data,
        recent_visitors: data.recent_visitors ?? [],
      })
  }

  return (
    <Box>
      <Stack direction="row">
        <Box mr={4} flexGrow={1} flexShrink={1} minWidth="1em">
          <UserCard
            userSummary={commonUserData?.user_summary}
            key={commonUserData?.user_summary?.uid}
          />
          <Tabs value={activeTab} sx={{ my: 1.5 }}>
            {tabs
              .filter(
                (tab) =>
                  !(
                    commonUserData?.user_summary?.friends_hidden &&
                    tab.id == 'friends'
                  ) &&
                  !(
                    commonUserData?.user_summary?.comments_hidden &&
                    tab.id == 'comments'
                  ) &&
                  !(
                    commonUserData?.user_summary?.favorites_unavailable &&
                    tab.id == 'favorites'
                  )
              )
              .map((tab) => (
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
              {activeTab == 'profile' && (
                <Information
                  userQuery={user}
                  queryOptions={queryOptions}
                  onLoad={onLoad}
                  userSummary={commonUserData?.user_summary}
                  self={self}
                />
              )}
              {activeTab == 'threads' && (
                <UserThreads
                  userQuery={user}
                  queryOptions={queryOptions}
                  onLoad={onLoad}
                />
              )}
              {activeTab == 'friends' && (
                <Friends
                  userQuery={user}
                  queryOptions={queryOptions}
                  onLoad={onLoad}
                  self={self}
                  userSummary={commonUserData?.user_summary}
                />
              )}
              {activeTab == 'favorites' && (
                <Favorites
                  userQuery={user}
                  queryOptions={queryOptions}
                  onLoad={onLoad}
                  self={self}
                />
              )}
              {activeTab == 'comments' && (
                <MessageBoard
                  userQuery={user}
                  queryOptions={queryOptions}
                  onLoad={onLoad}
                  self={self}
                  userSummary={commonUserData?.user_summary}
                />
              )}
            </>
          </Card>
        </Box>
        <Side
          key={commonUserData?.user_summary?.uid}
          visitors={commonUserData?.recent_visitors}
          visits={commonUserData?.user_summary?.views}
        />
      </Stack>
    </Box>
  )
}
export default User
