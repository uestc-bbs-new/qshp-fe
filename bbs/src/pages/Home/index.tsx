import { useQuery } from '@tanstack/react-query'
import { useUnmount } from 'usehooks-ts'

import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

import {
  Box,
  Button,
  List,
  Skeleton,
  Stack,
  useMediaQuery,
} from '@mui/material'

import { getIndexData } from '@/apis/common'
import headerImg from '@/assets/header.jpg'
import Aside from '@/components/Aside'
import Banner from '@/components/Banner'
import CampusService from '@/components/Header/CampusService'
import HeaderCards from '@/components/Header/HeaderCards'
import OverviewInfo from '@/components/Header/OverviewInfo'
import { globalCache, setForumListCache, useAppState } from '@/states'

import { ForumGroup } from './ForumCover'

const Home = () => {
  const tabbedTopView = useMediaQuery('(max-width: 1080px)')
  const mobileView = useMediaQuery('(max-width: 800px)')
  const { state, dispatch } = useAppState()
  const location = useLocation()
  useUnmount(() => {
    if (!state.toplistView?.sidebar) {
      dispatch({ type: 'close toplist', payload: { noTransition: true } })
    }
  })

  const {
    data: indexData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['index'],
    queryFn: async () => {
      console.log('fetch index')
      const result = await getIndexData({
        globalStat: true,
        announcement: true,
        forumList: true,
        topList: ['newreply', 'newthread', 'digest', 'life', 'hotlist'],
      })
      globalCache.topList = result.top_list
      return result
    },
  })
  useEffect(() => {
    if (indexData) {
      dispatch({
        type: 'set announcement',
        payload: indexData.announcement || [],
      })
    }
    if (indexData?.forum_list) {
      setForumListCache(indexData.forum_list)
    }
    if (indexData?.top_list) {
      globalCache.topList = indexData.top_list
    }
    if (
      ((mobileView && indexData) || state.toplistView?.manuallyOpened) &&
      !state.toplistView?.sidebar
    ) {
      dispatch({
        type: 'open toplist',
        payload: {
          alwaysOpen: mobileView,
          noTransition: true,
          ...(state.toplistView?.manuallyOpened && {
            manuallyOpened: true,
          }),
        },
      })
    }
  }, [indexData, mobileView])

  const previousLocationKey = useRef(location.key)
  const previousUid = useRef(state.user.uid)
  const previousUninitialized = useRef(state.user.uninitialized)
  useEffect(() => {
    console.log(
      state.user.uid,
      location.key,
      previousLocationKey.current,
      previousUid.current
    )
    if (
      !previousUninitialized.current &&
      (previousUid.current != state.user.uid ||
        previousLocationKey.current != location.key)
    ) {
      previousLocationKey.current = location.key
      previousUid.current = state.user.uid
      refetch()
    }
    previousUninitialized.current = state.user.uninitialized
  }, [state.user.uid, state.user.uninitialized, location.key])

  if (mobileView) {
    return [...Array(10)].map((_, index) => (
      <Skeleton key={index} height={70} />
    ))
  }
  return (
    <>
      <Banner src={headerImg} />
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        my={1}
      >
        <OverviewInfo data={indexData?.global_stat} />
        <Button
          style={!state.user.uid ? { visibility: 'hidden' } : undefined}
          onClick={() => {
            dispatch({
              type: 'open toplist',
              payload: {
                manuallyOpened: true,
                ...(state.toplistView?.sidebar && { sidebar: true }),
              },
            })
          }}
        >
          更多
        </Button>
      </Stack>
      <HeaderCards topLists={indexData?.top_list} loading={isLoading} />
      {!tabbedTopView && <CampusService />}

      <Stack direction="row">
        <Box className="flex-1">
          {!indexData?.forum_list?.length ? (
            <>
              <Skeleton variant="rounded" height={40} sx={{ my: 2 }} />
              {Array.from(new Array(2)).map((_, index) => (
                <Box key={index} className="flex-1" display="flex">
                  {Array.from(new Array(2)).map((_, index) => (
                    <Box
                      key={index}
                      sx={{ flexGrow: 1, marginRight: 1.1, my: 2 }}
                    >
                      <Skeleton variant="rectangular" height={118} />
                    </Box>
                  ))}
                </Box>
              ))}
            </>
          ) : (
            <List>
              {indexData.forum_list.map((item) => (
                <ForumGroup data={item} key={item.name} />
              ))}
            </List>
          )}
        </Box>
        {!tabbedTopView && (
          <Aside topList={indexData?.top_list} homepage loading={isLoading} />
        )}
      </Stack>
    </>
  )
}

export default Home
