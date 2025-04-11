import 'swiper/css'
import 'swiper/css/autoplay'
import 'swiper/css/pagination'
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react'

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useInView } from 'react-cool-inview'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import { useLocation } from 'react-router-dom'

import {
  Close,
  KeyboardArrowUp,
  KeyboardDoubleArrowLeft,
  Refresh,
  Wysiwyg,
} from '@mui/icons-material'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Fab,
  IconButton,
  List,
  Paper,
  Skeleton,
  Slide,
  Stack,
  SxProps,
  Tab,
  Tabs,
  debounce,
  useMediaQuery,
} from '@mui/material'

import { getTopLists } from '@/apis/common'
import {
  TopList,
  TopListKey,
  TopListThread,
} from '@/common/interfaces/response'
import {
  kSidebarWidth,
  useSidebarInMarginMediaQuery,
} from '@/common/ui/TopList'
import { kContentWidth } from '@/common/ui/base'
import Announcement from '@/components/Announcement'
import ThreadItemGrid from '@/components/ThreadItem/ThreadItemGrid'
import { ForumGroup } from '@/pages/Home/ForumCover'
import { globalCache, useAppState, useForumList, useTopList } from '@/states'
import { topListKeys, topListTitleMap } from '@/utils/constants'
import { persistedStates } from '@/utils/storage'

import Ad from '../Ad'
import { OverviewInfoMobile } from '../Header/OverviewInfo'

const kAllForums = 'allforums'
type TabKey = TopListKey | 'allforums'
const tabKeys: TabKey[] = [...topListKeys, kAllForums]

const TopListView = ({
  singleColumn,
  alwaysOpen,
  onClose,
}: {
  singleColumn?: boolean
  alwaysOpen?: boolean
  onClose?: () => void
}) => {
  const { state, dispatch } = useAppState()
  const [activeTab, setActiveTab] = useState<TabKey>('newthread')
  const swiperRef = useRef<SwiperRef>(null)

  const switchTab = (key: TabKey) => {
    setActiveTab(key)
    swiperRef.current?.swiper?.slideToLoop(tabKeys.indexOf(key))
  }

  const location = useLocation()
  const lastLocation = useRef<{ pathname?: string; search?: string }>()
  useEffect(() => {
    if (
      lastLocation.current &&
      (lastLocation.current.pathname != location.pathname ||
        lastLocation.current.search != location.search)
    ) {
      if (state.toplistView?.open && !state.toplistView?.sidebar) {
        dispatch({ type: 'close toplist', payload: { noTransition: true } })
      }
    }
    lastLocation.current = {
      pathname: location.pathname,
      search: location.search,
    }
  }, [location])

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
          <Stack direction="row" alignItems="center">
            <IconButton
              onClick={() => {
                const sidebar = !state.toplistView?.sidebar
                persistedStates.toplistMode = sidebar ? 'sidebar' : 'full'
                dispatch({
                  type: 'open toplist',
                  payload: {
                    ...state.toplistView,
                    sidebar,
                  },
                })
              }}
            >
              {state.toplistView?.sidebar ? (
                <Wysiwyg />
              ) : (
                <KeyboardDoubleArrowLeft />
              )}
            </IconButton>
            <IconButton onClick={() => onClose()}>
              <Close />
            </IconButton>
          </Stack>
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
              <ThreadTabContent
                tab={key}
                alwaysOpen={alwaysOpen}
                singleColumn={singleColumn}
              />
            </SwiperSlide>
          ))}
          <SwiperSlide key={kAllForums}>
            <ForumTabContent />
          </SwiperSlide>
        </Swiper>
      </Box>
    </Stack>
  )
}

const ThreadTabContent = ({
  tab,
  alwaysOpen,
  singleColumn,
}: {
  tab: TopListKey
  alwaysOpen?: boolean
  singleColumn?: boolean
}) => {
  const tabRef = useRef<TopListTabHandle>(null)
  return (
    <TabContent
      tab={tab}
      requireSignIn
      onRefresh={() => tabRef.current?.refresh() ?? Promise.resolve()}
    >
      <TopListTab
        tab={tab}
        ref={tabRef}
        alwaysOpen={alwaysOpen}
        singleColumn={singleColumn}
      />
    </TabContent>
  )
}

const ForumTabContent = () => {
  const forumList = useForumList()
  const narrowView = useMediaQuery('(max-width: 640px')

  return (
    <TabContent tab={kAllForums} sx={{ px: 1, py: 0 }}>
      <List disablePadding>
        {forumList?.map((item) => (
          <ForumGroup data={item} key={item.name} toplistView />
        ))}
      </List>
      {narrowView && <OverviewInfoMobile data={globalCache.globalStat} />}
    </TabContent>
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
  onRefresh,
  sx,
}: {
  tab: TabKey
  children?: React.ReactNode
  requireSignIn?: boolean
  skeleton?: React.ReactNode
  onRefresh?: () => Promise<void>
  sx?: SxProps
}) => {
  const { state, dispatch } = useAppState()
  const scrollRef = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = toplistScrollOffset[tab] ?? 0
    }
  }, [tab])

  const onScroll = useMemo(
    () =>
      debounce(() => {
        const offset = scrollRef.current?.scrollTop ?? 0
        toplistScrollOffset[tab] = offset
        setShowBackTop(offset > 64)
      }),
    []
  )
  const scrollToTop = () =>
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })

  const [showBackTop, setShowBackTop] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

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
        scrollbarGutter: 'stable',
        overscrollBehavior: 'contain',
        ...sx,
      }}
      onScroll={() => onScroll()}
      ref={scrollRef}
    >
      {children}
      <Stack position="absolute" right={12} bottom={8} spacing={1}>
        {onRefresh && (
          <Fab
            size="small"
            color="primary"
            onClick={() => {
              scrollToTop()
              setRefreshing(true)
              onRefresh().finally(() => setRefreshing(false))
            }}
          >
            {refreshing ? (
              <CircularProgress sx={{ color: 'black' }} size={24} />
            ) : (
              <Refresh />
            )}
          </Fab>
        )}
        <Slide direction="left" in={showBackTop}>
          <Fab size="small" onClick={scrollToTop}>
            <KeyboardArrowUp />
          </Fab>
        </Slide>
      </Stack>
    </Box>
  )
}

type TopListTabHandle = {
  refresh: () => Promise<void>
}
type TopListTabProps = {
  tab: TopListKey
  alwaysOpen?: boolean
  singleColumn?: boolean
}
const TopListTab = forwardRef<TopListTabHandle, TopListTabProps>(
  function TopListTab({ tab, alwaysOpen, singleColumn }: TopListTabProps, ref) {
    const singleColumnAd = useMediaQuery('(max-width: 720px')
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

    useImperativeHandle(
      ref,
      () => ({
        async refresh() {
          const data = {
            list: (await getTopLists(tab, 1))[tab],
            page: 1,
          }
          setList(data.list)
          setPage(data.page)
          saveCache(data)
        },
      }),
      []
    )

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
        {tab == 'newthread' && alwaysOpen && (
          <Ad mb={2} singleColumn={singleColumnAd} />
        )}
        <ListView list={list} singleColumn={singleColumn} />
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
)

const ListView = ({
  list,
  singleColumn,
}: {
  list?: TopListThread[]
  singleColumn?: boolean
}) => {
  const single = useMediaQuery('(max-width: 720px') || singleColumn
  if (!list?.length) {
    return <></>
  }
  const items = list?.map((item) => (
    <ThreadItemGrid
      key={item.thread_id}
      item={item}
      sx={single ? { my: 1.5 } : undefined}
    />
  ))
  if (single) {
    return <>{items}</>
  }
  return (
    <ResponsiveMasonry
      columnsCountBreakPoints={{
        320: 1,
        720: 2,
        800: 1,
        848: 2,
        1300: 3,
        1921: 4,
      }}
    >
      <Masonry gutter="12px">{items}</Masonry>
    </ResponsiveMasonry>
  )
}

export const TopListDialog = ({
  open,
  alwaysOpen,
  sidebar,
  onClose,
}: {
  open: boolean
  alwaysOpen?: boolean
  sidebar?: boolean
  onClose: () => void
}) => {
  const sidebarInMargin = useSidebarInMarginMediaQuery()
  const content = (
    <Paper
      sx={(theme) => ({
        position: 'absolute',
        ...(alwaysOpen
          ? {
              left: 0,
              right: 0,
              top: 64,
              bottom: 0,
            }
          : sidebar
            ? {
                position: 'fixed',
                left: sidebarInMargin
                  ? `calc(50% - ${kContentWidth / 2 + kSidebarWidth}px)`
                  : 0,
                top: 64,
                bottom: 0,
                width: kSidebarWidth,
                zIndex: 1,
              }
            : {
                left: 64,
                right: 64,
                bottom: 16,
                top: 72,
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: `4px 4px 8px ${
                  theme.palette.mode == 'dark'
                    ? 'rgba(255, 255, 255, 0.15)'
                    : 'rgba(0, 0, 0, 0.2)'
                }`,
              }),
      })}
      hidden={!open}
    >
      <TopListView
        singleColumn={sidebar}
        alwaysOpen={alwaysOpen}
        onClose={alwaysOpen ? undefined : onClose}
      />
    </Paper>
  )
  if (sidebar) {
    return content
  }
  return (
    <div
      css={{
        position: 'fixed',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        zIndex: 1,
        ...(!alwaysOpen && {
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(2px)',
        }),
      }}
      hidden={!open}
    >
      {content}
    </div>
  )
}

export default TopListView
