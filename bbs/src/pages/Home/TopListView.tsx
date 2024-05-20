import 'swiper/css'
import 'swiper/css/autoplay'
import 'swiper/css/pagination'
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react'

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useInView } from 'react-cool-inview'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'

import { Close } from '@mui/icons-material'
import {
  Box,
  IconButton,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  Typography,
  debounce,
} from '@mui/material'

import { getTopLists } from '@/apis/common'
import { TopListKey, TopListThread } from '@/common/interfaces/response'
import ThreadItemGrid from '@/components/ThreadItem/ThreadItemGrid'
import { useTopList } from '@/states'
import { topListKeys, topListTitleMap } from '@/utils/constants'

const TopListView = ({ onClose }: { onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState<TopListKey>('newthread')
  const swiperRef = useRef<SwiperRef>(null)

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
              label={topListTitleMap[key]}
              value={key}
              onClick={() => {
                setActiveTab(key)
                swiperRef.current?.swiper?.slideTo(topListKeys.indexOf(key))
              }}
            ></Tab>
          ))}
        </Tabs>
        <IconButton onClick={() => onClose()}>
          <Close />
        </IconButton>
      </Stack>

      <Box flexShrink={1} minHeight="1px" boxSizing="border-box">
        <Swiper
          ref={swiperRef}
          slidesPerView={1}
          autoHeight={false}
          loop
          initialSlide={1}
          css={{ maxWidth: '100%', height: '100%' }}
          onSlideChange={(swiper) =>
            setActiveTab(topListKeys[swiper.realIndex])
          }
        >
          {topListKeys.map((key) => (
            <SwiperSlide key={key}>
              <TopListTab tab={key} />
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    </Stack>
  )
}

type TopListCacheEntry = {
  list: TopListThread[]
  page: number
  scrollOffset: number
}

const toplistCache: {
  [key in TopListKey]?: TopListCacheEntry
} = {}

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
  const scrollRef = useRef<HTMLDivElement>(null)
  const saveCache = (newData: Partial<TopListCacheEntry>) => {
    const newList = newData.list || list
    if (newList) {
      toplistCache[tab] = {
        page,
        ...newData,
        list: newList,
        scrollOffset: scrollRef.current?.scrollTop ?? 0,
      }
    }
  }
  useEffect(() => {
    const initData = getCache()
    setList(initData.list)
    setPage(initData.page)
  }, [tab])
  useLayoutEffect(() => {
    const initData = getCache()
    if (scrollRef.current) {
      scrollRef.current.scrollTop = initData.scrollOffset
    }
  }, [tab])

  const { observe } = useInView({
    rootMargin: '50px 0px',
    onEnter: async () => {
      if (!isEnded && !isFetching) {
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
              list?.every(
                (existingItem) => existingItem.thread_id != item.thread_id
              )
            ) {
              if (newList) {
                newList.push(item)
              } else {
                newList = list?.slice() || []
              }
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
    },
  })

  const saveCacheDebounced = useMemo(() => debounce(saveCache), [])

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
      onScroll={() => saveCacheDebounced({ list, page })}
      ref={scrollRef}
    >
      <ResponsiveMasonry columnsCountBreakPoints={{ 320: 1, 720: 2, 1200: 3 }}>
        <Masonry gutter="12px">
          {list?.map((item) => (
            <ThreadItemGrid key={item.thread_id} item={item} />
          ))}
        </Masonry>
      </ResponsiveMasonry>
      {!isEnded && !(isFetching && page == 1) && (
        <Stack
          direction="row"
          justifyContent="center"
          ref={isFetching ? undefined : observe}
        >
          {isError ? (
            <Typography>加载失败</Typography>
          ) : (
            <Skeleton width="100%" height={40} />
          )}
        </Stack>
      )}
    </Box>
  )
}

export default TopListView
