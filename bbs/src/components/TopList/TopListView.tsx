import 'swiper/css'
import 'swiper/css/autoplay'
import 'swiper/css/pagination'
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react'

import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useInView } from 'react-cool-inview'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'

import { Close } from '@mui/icons-material'
import {
  Alert,
  Box,
  Button,
  IconButton,
  List,
  Paper,
  Skeleton,
  Slide,
  Stack,
  Tab,
  Tabs,
  debounce,
} from '@mui/material'

import { getTopLists } from '@/apis/common'
import { TopListKey, TopListThread } from '@/common/interfaces/response'
import Announcement from '@/components/Announcement'
import ThreadItemGrid from '@/components/ThreadItem/ThreadItemGrid'
import { ForumGroup } from '@/pages/Home/ForumCover'
import { useAppState, useForumList, useTopList } from '@/states'
import { topListKeys, topListTitleMap } from '@/utils/constants'

const kAllForums = 'allforums'
type TabKey = TopListKey | 'allforums'
const tabKeys: TabKey[] = [...topListKeys, kAllForums]

const TopListView = ({ onClose }: { onClose?: () => void }) => {
  const [activeTab, setActiveTab] = useState<TabKey>('newthread')
  const swiperRef = useRef<SwiperRef>(null)

  const switchTab = (key: TabKey) => {
    setActiveTab(key)
    swiperRef.current?.swiper?.slideTo(tabKeys.indexOf(key))
  }

  const forumList = useForumList()

  return (
    <Stack height="100%">
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        pr={1}
        sx={(theme) => ({
          backgroundColor: theme.palette.mode == 'dark' ? '#666' : '#eee',
        })}
      >
        <Tabs value={activeTab} variant="scrollable">
          {topListKeys.map((key) => (
            <Tab
              key={key}
              value={key}
              label={topListTitleMap[key]}
              onClick={() => switchTab(key)}
            />
          ))}
          <Tab
            value="allforums"
            label="所有板块"
            onClick={() => switchTab('allforums')}
          />
        </Tabs>
        {onClose && (
          <IconButton onClick={() => onClose()}>
            <Close />
          </IconButton>
        )}
      </Stack>

      <Box flexShrink={1} minHeight="1px" boxSizing="border-box">
        <Swiper
          ref={swiperRef}
          slidesPerView={1}
          autoHeight={false}
          loop
          initialSlide={1}
          css={{ maxWidth: '100%', height: '100%' }}
          onSlideChange={(swiper) => setActiveTab(tabKeys[swiper.realIndex])}
        >
          {topListKeys.map((key) => (
            <SwiperSlide key={key}>
              <TabContent tab={key} requireSignIn>
                <TopListTab tab={key} />
              </TabContent>
            </SwiperSlide>
          ))}
          <SwiperSlide key={kAllForums}>
            <TabContent tab={kAllForums}>
              <List>
                {forumList?.map((item) => (
                  <ForumGroup data={item} key={item.name} />
                ))}
              </List>
            </TabContent>
          </SwiperSlide>
        </Swiper>
      </Box>
    </Stack>
  )
}

type TopListCacheEntry = {
  list: TopListThread[]
  page: number
}
const toplistCache: {
  [key in TopListKey]?: TopListCacheEntry
} = {}
const toplistScrollOffset: {
  [key in TabKey]?: number
} = {}

const TabContent = ({
  tab,
  children,
  requireSignIn,
  skeleton,
}: {
  tab: TabKey
  children?: React.ReactNode
  requireSignIn?: boolean
  skeleton?: React.ReactNode
}) => {
  const { state, dispatch } = useAppState()
  const scrollRef = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = toplistScrollOffset[tab] ?? 0
    }
  }, [tab])

  const saveScrollffsetDebounced = useMemo(
    () =>
      debounce(() => {
        toplistScrollOffset[tab] = scrollRef.current?.scrollTop ?? 0
      }),
    []
  )

  if (state.user.uninitialized) {
    return (
      <Box p={2}>
        {skeleton ?? (
          <>
            <Skeleton height={74} />
            {[...Array(6)].map((_, index) => (
              <Skeleton key={index} height={40} />
            ))}
          </>
        )}
      </Box>
    )
  }
  if (requireSignIn && !state.user.uid) {
    return (
      <Box px={1} py={3}>
        <Alert
          severity="info"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() =>
                dispatch({ type: 'open dialog', payload: { kind: 'login' } })
              }
            >
              登录
            </Button>
          }
        >
          请您登录后继续浏览。
        </Alert>
      </Box>
    )
  }
  return (
    <Box
      p={2}
      overflow="auto"
      height="100%"
      boxSizing="border-box"
      sx={{
        '&::-webkit-scrollbar': {
          backgroundColor: 'rgba(128, 128, 128, 0.5)',
          width: '3px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#999',
          width: '3px',
        },
      }}
      onScroll={() => saveScrollffsetDebounced()}
      ref={scrollRef}
    >
      {children}
    </Box>
  )
}

const TopListTab = ({ tab }: { tab: TopListKey }) => {
  const homeCachedData = useTopList()
  const getCache = () => {
    const cachedData = toplistCache[tab]
    if (cachedData) {
      return cachedData
    }
    return {
      list: homeCachedData && homeCachedData[tab],
      page: 1,
      scrollOffset: 0,
    }
  }
  const initData = getCache()
  const [list, setList] = useState<TopListThread[] | undefined>(initData.list)
  const [isEnded, setEnded] = useState(false)
  const [isFetching, setFetching] = useState(false)
  const [isError, setError] = useState(false)
  const [page, setPage] = useState(initData.page)
  const saveCache = (newData: Partial<TopListCacheEntry>) => {
    const newList = newData.list || list
    if (newList) {
      toplistCache[tab] = {
        page,
        ...newData,
        list: newList,
      }
    }
  }
  useEffect(() => {
    const initData = getCache()
    setList(initData.list)
    setPage(initData.page)
  }, [tab])

  const fetch = async () => {
    setFetching(true)
    setError(false)
    let newPage = page
    try {
      const newData = (await getTopLists(tab, page + 1))[tab]
      if (newData?.length) {
        ++newPage
        setPage(newPage)
      } else {
        setEnded(true)
      }
      let newList: TopListThread[] | undefined
      newData?.forEach((item) => {
        if (
          (list || []).every(
            (existingItem) => existingItem.thread_id != item.thread_id
          )
        ) {
          if (!newList) {
            newList = list?.slice() || []
          }
          newList.push(item)
        }
      })
      if (newList) {
        setList(newList)
      }
      saveCache({ list: newList, page: newPage })
    } catch (_) {
      setError(true)
    } finally {
      setFetching(false)
    }
  }

  const { observe } = useInView({
    rootMargin: '50px 0px',
    onEnter: () => {
      if (!isEnded && !isFetching && !isError) {
        fetch()
      }
    },
  })

  return (
    <>
      {(tab == 'newthread' || tab == 'hotlist') && <Announcement inSwiper />}
      {!!list?.length && (
        <ResponsiveMasonry
          columnsCountBreakPoints={{ 320: 1, 720: 2, 1200: 3 }}
        >
          <Masonry gutter="12px">
            {list?.map((item) => (
              <ThreadItemGrid key={item.thread_id} item={item} />
            ))}
          </Masonry>
        </ResponsiveMasonry>
      )}
      {!isEnded && !(isFetching && page == 1) && (
        <Stack ref={isFetching ? undefined : observe}>
          {isError ? (
            <Alert
              severity="error"
              action={
                <Button color="inherit" size="small" onClick={() => fetch()}>
                  重试
                </Button>
              }
              sx={{ mt: 2 }}
            >
              加载失败
            </Alert>
          ) : (
            [...Array(6)].map((_, index) => (
              <Skeleton key={index} height={40} />
            ))
          )}
        </Stack>
      )}
    </>
  )
}

export const TopListDialog = ({
  open,
  alwaysOpen,
  noTransition,
  onClose,
}: {
  open: boolean
  alwaysOpen?: boolean
  noTransition?: boolean
  onClose: () => void
}) => {
  useEffect(() => {
    if (open && !alwaysOpen) {
      document.body.style.overflow = 'hidden'
    } else if (!open) {
      document.body.style.overflow = ''
    }
    return () => void (document.body.style.overflow = '')
  }, [open])

  const body = (
    <Paper
      sx={{
        left: 0,
        right: 0,
        bottom: 0,
        top: 64,
        position: 'fixed',
        zIndex: 1,
      }}
      hidden={(alwaysOpen || noTransition) && !open}
    >
      <TopListView
        onClose={
          alwaysOpen
            ? undefined
            : () => {
                document.body.style.overflow = ''
                onClose()
              }
        }
      />
    </Paper>
  )
  return alwaysOpen || noTransition ? (
    body
  ) : (
    <Slide in={open} direction="up">
      {body}
    </Slide>
  )
}

export default TopListView
