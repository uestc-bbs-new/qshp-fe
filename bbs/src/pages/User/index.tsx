import { useEffect, useRef, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

import { Box, Stack, Tab, Tabs, useMediaQuery } from '@mui/material'

import { ApiError } from '@/common/interfaces/error'
import { CommonUserQueryRpsoense } from '@/common/interfaces/user'
import Card from '@/components/Card'
import EmptyList from '@/components/EmptyList'
import Error from '@/components/Error'
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
import Visitors from './Visitors'

const tabs = [
  { id: 'profile', title: '个人资料' },
  { id: 'threads', title: '帖子' },
  { id: 'friends', title: '好友' },
  { id: 'visitors', title: '最近访客' },
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
  const { state, dispatch } = useAppState()
  const [commonUserData, setCommonUserData] =
    useState<CommonUserQueryRpsoense>()
  const removeVisitLog = searchParams.get('additional') == 'removevlog'
  const removeVisitLogRef = useRef(removeVisitLog)
  const user = {
    ...(params.uid && parseInt(params.uid)
      ? { uid: parseInt(params.uid) }
      : undefined),
    ...(params.username && { username: params.username }),
    ...(removeVisitLog && {
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
    getRecentVisitors:
      !commonUserData?.recent_visitors ||
      userChanged ||
      removeVisitLog != removeVisitLogRef.current,
  }
  const activeTab = mapSubPageToTabId(params.subPage) || tabs[0].id
  const [error, setError] = useState<any>()
  const onLoad = (data: CommonUserQueryRpsoense) => {
    removeVisitLogRef.current = removeVisitLog
    ;(data.user_summary || data.recent_visitors) &&
      setCommonUserData({
        ...commonUserData,
        ...data,
        recent_visitors: data.recent_visitors ?? [],
      })
    setError(null)
  }
  useEffect(() => {
    dispatch({
      type: 'set breadcumbs/user',
      ...(!userChanged && {
        payload: {
          self,
          subPage: activeTab,
          subPageTitle: tabs.find((tab) => tab.id == activeTab)?.title,
          uid: commonUserData?.user_summary?.uid,
          username: commonUserData?.user_summary?.username,
        },
      }),
    })
    return () => {
      dispatch({ type: 'set breadcumbs/user' })
    }
  }, [self, commonUserData?.user_summary?.username, activeTab])

  const hideSidebar = useMediaQuery('(max-width: 1080px)')

  if (error) {
    const err = error as ApiError
    if (err.type == 'http' && err.status == 404) {
      return (
        <Card mt={2}>
          <EmptyList text="该用户不存在。" />
        </Card>
      )
    }
    return <Error error={error} />
  }
  return (
    <Stack direction="row" mt={1}>
      <Box
        mr={hideSidebar ? undefined : 2}
        flexGrow={1}
        flexShrink={1}
        minWidth="1em"
      >
        <UserCard
          userSummary={commonUserData?.user_summary}
          key={commonUserData?.user_summary?.uid}
        />
        <Tabs variant="scrollable" value={activeTab} sx={{ my: 1.5 }}>
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
                ) &&
                !(tab.id == 'visitors' && !hideSidebar)
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
                onError={setError}
                userSummary={commonUserData?.user_summary}
                self={self}
              />
            )}
            {activeTab == 'threads' && (
              <UserThreads
                userQuery={user}
                queryOptions={queryOptions}
                onLoad={onLoad}
                onError={setError}
              />
            )}
            {activeTab == 'friends' && (
              <Friends
                userQuery={user}
                queryOptions={queryOptions}
                onLoad={onLoad}
                onError={setError}
                self={self}
                userSummary={commonUserData?.user_summary}
              />
            )}
            {activeTab == 'visitors' && (
              <Visitors
                userQuery={user}
                queryOptions={queryOptions}
                onLoad={onLoad}
                onError={setError}
                visitors={commonUserData?.recent_visitors}
                visits={commonUserData?.user_summary?.views}
              />
            )}
            {activeTab == 'favorites' && (
              <Favorites
                userQuery={user}
                queryOptions={queryOptions}
                onLoad={onLoad}
                onError={setError}
                self={self}
              />
            )}
            {activeTab == 'comments' && (
              <MessageBoard
                userQuery={user}
                queryOptions={queryOptions}
                onLoad={onLoad}
                onError={setError}
                self={self}
                userSummary={commonUserData?.user_summary}
              />
            )}
          </>
        </Card>
      </Box>
      {!hideSidebar && (
        <Side
          key={commonUserData?.user_summary?.uid}
          visitors={commonUserData?.recent_visitors}
          visits={commonUserData?.user_summary?.views}
        />
      )}
    </Stack>
  )
}
export default User
