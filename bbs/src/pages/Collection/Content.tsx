import { useQuery } from '@tanstack/react-query'

import { useEffect, useRef } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import { ExpandMore } from '@mui/icons-material'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  List,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material'

import { getCollectionDetails } from '@/apis/collection'
import {
  CollectionDetails,
  CollectionQueryResponse,
} from '@/apis/types/collection'
import { User } from '@/common/interfaces/base'
import Avatar from '@/components/Avatar'
import Card from '@/components/Card'
import { CollectionItemLite } from '@/components/Collection/Item'
import Error from '@/components/Error'
import Link from '@/components/Link'
import ForumPagination from '@/components/Pagination/ForumPagination'
import Separated from '@/components/Separated'
import ThreadItem from '@/components/ThreadItem'
import { globalCache, useForumList } from '@/states'
import { useBreadcrumb } from '@/states/breadcrumb'
import { pages } from '@/utils/routes'
import { kAppBarTop, scrollAnchorSx } from '@/utils/scrollAnchor'
import { searchParamsAssign } from '@/utils/tools'

const Collaborator = ({ user }: { user: User }) => (
  <Stack direction="row" alignItems="flex-end">
    <Avatar uid={user.uid} size={28} />
    <Link to={pages.user({ uid: user.uid })} ml={0.5}>
      {user.username}
    </Link>
  </Stack>
)

const Head = ({ collection }: { collection: CollectionDetails }) => (
  <Accordion defaultExpanded disableGutters>
    <AccordionSummary
      expandIcon={<ExpandMore />}
      sx={(theme) => ({ ...theme.commonSx.headerCardGradient })}
    >
      <Stack direction="row">
        <Stack
          direction="row"
          className="pr-5"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography fontSize={19} fontWeight="bold">
            {collection.name}
          </Typography>
        </Stack>
        <Separated
          separator={
            <Divider
              orientation="vertical"
              variant="middle"
              flexItem
              className="mx-4"
            />
          }
        >
          <Stack direction="row" alignItems="center">
            <Typography>已收录：</Typography>
            <Typography fontWeight="bold">{collection.threads}</Typography>
          </Stack>
          <Stack direction="row" alignItems="center">
            <Typography>关注：</Typography>
            <Typography fontWeight="bold">{collection.follows}</Typography>
          </Stack>
          <Stack direction="row" alignItems="center">
            <Typography>评论：</Typography>
            <Typography fontWeight="bold">{collection.comments}</Typography>
          </Stack>
        </Separated>
      </Stack>
    </AccordionSummary>
    <AccordionDetails>
      <Stack direction="row" alignItems="flex-end" mt={1}>
        <Typography>创建者：</Typography>
        <Collaborator user={collection} />
      </Stack>
      {!!collection.collaborators?.length && (
        <Stack direction="row" alignItems="flex-end" mt={2}>
          <Typography>协作者：</Typography>
          <Stack direction="row" alignItems="flex-end" spacing={1}>
            {collection.collaborators.map((user) => (
              <Collaborator user={user} />
            ))}
          </Stack>
        </Stack>
      )}
      {collection.description.trim() && (
        <Typography mt={2}>{collection.description}</Typography>
      )}
    </AccordionDetails>
  </Accordion>
)

const Side = ({ data }: { data?: CollectionQueryResponse }) => {
  return (
    <Box className="ml-2 w-60">
      {!!data?.collection?.other_collections?.length && (
        <Paper sx={{ p: 1 }}>
          <Typography variant="h6" mb={2}>
            其他公共收藏夹
          </Typography>
          <Stack spacing={2}>
            {data?.collection?.other_collections?.map((item) => (
              <CollectionItemLite item={item} />
            ))}
          </Stack>
        </Paper>
      )}
    </Box>
  )
}

const Content = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const threadListTop = useRef<HTMLDivElement>(null)
  useForumList()

  const query = (() => {
    const id = parseInt(useParams()['id'] || '')
    const order = searchParams.get('order')
    const page = parseInt(searchParams.get('page') || '1') || 1
    return {
      id,
      page,
      ...(order == '1' && { order: 'collect' as 'collect' }),
      details: true,
    }
  })()
  const { data, error, isLoading, isError, refetch } = useQuery({
    queryKey: ['collection', query],
    queryFn: () => getCollectionDetails(query),
  })
  const { setBreadcrumb } = useBreadcrumb()
  useEffect(() => {
    if (data?.collection) {
      setBreadcrumb({
        collection: {
          name: data.collection.name,
          id: data.collection.collection_id,
        },
      })
    }
  }, [data])

  const handlePageChange = (_: any, newPage: number) => {
    navigate(
      `${location.pathname}?${searchParamsAssign(searchParams, {
        page: newPage,
      })}`,
      { preventScrollReset: true }
    )
    threadListTop.current?.scrollIntoView()
  }

  return (
    <Stack direction="row" alignItems="flex-start" mt={2}>
      <Box className="flex-1" minWidth="1em">
        {isError ? (
          <Error error={error} onRefresh={refetch} />
        ) : isLoading ? (
          <Card>
            <Skeleton height={81} />
          </Card>
        ) : data?.collection ? (
          <Head collection={data.collection} />
        ) : (
          <></>
        )}
        <Paper
          elevation={3}
          sx={{ borderRadius: '10px', mt: 1, ...scrollAnchorSx }}
          ref={threadListTop}
        >
          <List>
            {data?.threads?.map((item) => (
              <ThreadItem
                showSummary
                data={{
                  ...item,
                  forum_name: globalCache.fidNameMap[item.forum_id],
                }}
                key={item.thread_id}
              />
            ))}
          </List>
        </Paper>
        {!!data?.threads?.length && (
          <ForumPagination
            count={Math.ceil(data.total / data.page_size)}
            page={query.page}
            onChange={handlePageChange}
          />
        )}
      </Box>
      <Side data={data} />
    </Stack>
  )
}

export default Content
