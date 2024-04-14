import { useQuery } from '@tanstack/react-query'

import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { CollectionsBookmark, ExpandMore } from '@mui/icons-material'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  Pagination,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material'

import { getUserFavorites } from '@/apis/user'
import { User } from '@/common/interfaces/base'
import { Collection } from '@/common/interfaces/collection'
import { UserFavorite } from '@/common/interfaces/user'
import Avatar from '@/components/Avatar'
import EmptyList from '@/components/EmptyList'
import Link from '@/components/Link'
import Separated from '@/components/Separated'
import ThreadItem from '@/components/ThreadItem'
import { legacyPages, pages } from '@/utils/routes'
import { scrollAnchorCss } from '@/utils/scrollAnchor'
import { searchParamsAssign } from '@/utils/tools'

import { SubPageCommonProps } from './types'

function Favorites({
  userQuery,
  queryOptions,
  onLoad,
  self,
}: SubPageCommonProps & { self: boolean }) {
  const [searchParams] = useSearchParams()
  const [collections, setCollections] = useState<Collection[]>()
  const userInfo = useRef<Partial<User>>()
  const initQuery = () => ({
    common: { ...userQuery, ...queryOptions },
    page: parseInt(searchParams.get('page') || '1') || 1,
    collections:
      !collections ||
      !userInfo.current ||
      (userInfo.current.uid != userQuery.uid &&
        userInfo.current.username != userQuery.username),
  })
  const [query, setQuery] = useState(initQuery())
  useEffect(() => {
    setQuery(initQuery())
    userInfo.current = {
      ...(userQuery.uid && { uid: userQuery.uid }),
      ...(userQuery.username && { username: userQuery.username }),
    }
  }, [
    searchParams,
    userQuery.uid,
    userQuery.username,
    userQuery.removeVisitLog,
    userQuery.admin,
  ])
  const { data } = useQuery({
    queryKey: ['user', 'favorites', query],
    queryFn: async () => {
      const getCollections = query.collections
      const data = await getUserFavorites(
        query.common,
        query.page,
        getCollections
      )
      onLoad && onLoad(data)
      if (getCollections) {
        setCollections(data.collections || [])
      }
      return data
    },
  })

  const navigate = useNavigate()
  const topRef = useRef<HTMLDivElement>(null)
  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    navigate(
      `${location.pathname}?${searchParamsAssign(searchParams, {
        page,
      })}`,
      { preventScrollReset: true }
    )
    topRef.current?.scrollIntoView()
  }

  return (
    <Box p={1}>
      {!!collections?.length && (
        <>
          <Accordion
            defaultExpanded
            disableGutters
            elevation={0}
            sx={{ pt: 1 }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              sx={{
                minHeight: 0,
                px: 0,
                mb: 1,
                '& .MuiAccordionSummary-content': { my: 0 },
              }}
            >
              <Typography variant="userProfileHeading">淘专辑</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0, pb: 2, px: 1.75 }}>
              {collections.map((item) => (
                <CollectionItem item={item} key={item.collection_id} />
              ))}
            </AccordionDetails>
          </Accordion>

          {self && !!data?.total && <Divider />}
        </>
      )}
      <div ref={topRef} css={scrollAnchorCss} />
      {!self && data && !collections?.length && <EmptyList text="暂无收藏" />}
      {!data &&
        [...Array(15)].map((_, index) => <Skeleton key={index} height={85} />)}
      {self && data && !data.total && !collections?.length && (
        <EmptyList text="暂无收藏" />
      )}
      {self && !!data?.total && data.rows && (
        <>
          <Typography variant="userProfileHeading" component="p" mt={2}>
            我的收藏
          </Typography>
          {data.rows.map((item) => (
            <FavoriteItem key={item.favorite_id} item={item} />
          ))}
          {!!data?.total && data.total > data.page_size && (
            <Stack direction="row" justifyContent="center" my={1.5}>
              <Pagination
                boundaryCount={3}
                siblingCount={1}
                page={data.page}
                count={Math.ceil(data.total / (data.page_size || 1))}
                onChange={handlePageChange}
              />
            </Stack>
          )}
        </>
      )}
    </Box>
  )
}

const CollectionItem = ({ item }: { item: Collection }) => (
  <Box p={0.5}>
    <Stack direction="row" sx={{ mt: 1 }}>
      <Link
        external
        target="_blank"
        to={legacyPages.collection(item.collection_id)}
        sx={{ mr: 2 }}
      >
        {item.is_owner ? (
          <Stack
            justifyContent="center"
            alignItems="center"
            width={40}
            height={40}
          >
            <CollectionsBookmark
              htmlColor="#aaaaaa"
              sx={{ width: 28, height: 28 }}
            />
          </Stack>
        ) : (
          <Avatar alt={item.username} uid={item.uid} size={40} />
        )}
      </Link>
      <Box className="flex-1">
        <Stack
          justifyContent="space-between"
          direction="column"
          sx={{ minWidth: 0 }}
        >
          <Stack direction="row">
            <Link
              external
              target="_blank"
              to={legacyPages.collection(item.collection_id)}
              color="rgb(33, 117, 243)"
              underline="hover"
              className={'line-clamp-3'}
            >
              <Typography fontSize={16} fontWeight={500}>
                {item.name}
              </Typography>
            </Link>
          </Stack>
          <Typography variant="userItemSummary">{item.description}</Typography>
          {!!item.latest_thread?.thread_id && (
            <Typography variant="userItemSummary">
              最新收藏：
              <Link
                to={pages.thread(item.latest_thread.thread_id)}
                underline="hover"
              >
                {item.latest_thread.subject}
              </Link>
            </Typography>
          )}
          <Typography variant="userItemDetails">
            <Stack direction="row" spacing={0.75}>
              <Separated separator={<span>·</span>}>
                <span>{item.is_owner ? '创建人' : '共同维护者'}</span>
                <span>关注：{item.follows}</span>
                <span>评论：{item.comments}</span>
                <span>评分：{item.average_rate.toFixed(1)}</span>
              </Separated>
            </Stack>
          </Typography>
        </Stack>
      </Box>
    </Stack>
  </Box>
)

const FavoriteItem = ({ item }: { item: UserFavorite }) => {
  if (item.target_type == 'tid' && item.thread_details) {
    return (
      <ThreadItem
        data={item.thread_details}
        showSummary
        ignoreThreadHighlight
      />
    )
  }
  return <></>
}
export default Favorites
