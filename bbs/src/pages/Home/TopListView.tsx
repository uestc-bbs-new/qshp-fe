import { useEffect, useState } from 'react'
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
} from '@mui/material'

import { getTopLists } from '@/apis/common'
import { TopListKey, TopListThread } from '@/common/interfaces/response'
import ThreadItemGrid from '@/components/ThreadItem/ThreadItemGrid'
import { useTopList } from '@/states'
import { topListKeys, topListTitleMap } from '@/utils/constants'

const TopListView = ({ onClose }: { onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState<TopListKey>('newthread')
  const cachedData = useTopList()
  const [list, setList] = useState<TopListThread[]>()
  const [isEnded, setEnded] = useState(false)
  const [isFetching, setFetching] = useState(false)
  const [isError, setError] = useState(false)
  const [page, setPage] = useState(1)
  useEffect(() => {
    setList(cachedData ? cachedData[activeTab] : undefined)
    setPage(1)
  }, [activeTab])
  const { observe } = useInView({
    rootMargin: '50px 0px',
    onEnter: async ({ unobserve }) => {
      unobserve()
      if (!isEnded && !isFetching) {
        setFetching(true)
        setError(false)
        try {
          const newData = (await getTopLists(activeTab, page + 1))[activeTab]
          if (newData?.length) {
            setPage(page + 1)
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
        } catch (_) {
          setError(true)
        } finally {
          setFetching(false)
        }
      }
    },
  })

  return (
    <Stack height="100%">
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        pr={1}
      >
        <Tabs value={activeTab}>
          {topListKeys.map((key) => (
            <Tab
              key={key}
              label={topListTitleMap[key]}
              value={key}
              onClick={() => setActiveTab(key)}
            ></Tab>
          ))}
        </Tabs>
        <IconButton onClick={() => onClose()}>
          <Close />
        </IconButton>
      </Stack>
      <Box flexShrink={1} overflow="auto" p={1}>
        <ResponsiveMasonry
          columnsCountBreakPoints={{ 320: 1, 720: 2, 1200: 3 }}
        >
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
    </Stack>
  )
}

export default TopListView
