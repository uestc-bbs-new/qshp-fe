import { useQuery } from '@tanstack/react-query'

import React, { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

import {
  Box,
  Divider,
  List,
  Pagination,
  Skeleton,
  Stack,
  Tab,
  Tabs,
} from '@mui/material'

import {
  CommonQueryParams,
  getUserPostComments,
  getUserReplies,
  getUserThreads,
} from '@/apis/user'
import { PaginationParams, ThreadInList } from '@/common/interfaces/response'
import {
  UserCommonList,
  UserPostComment,
  UserReply,
} from '@/common/interfaces/user'
import EmptyList from '@/components/EmptyList'
import Link from '@/components/Link'
import ThreadItem, { ThreadReplyOrCommentItem } from '@/components/ThreadItem'
import { pages } from '@/utils/routes'
import { searchParamsAssign } from '@/utils/tools'

import { AdditionalQueryOptions, SubPageCommonProps, UserQuery } from './types'

type CoalescedReply = UserReply & {
  replyItems: ThreadReplyOrCommentItem[]
}
type CoalescedList<T> = UserCommonList<T> & {
  coalescedReplies?: CoalescedReply[]
}

type TabProps<T extends PaginationParams> = {
  id: string
  title: string
  component: React.ElementType
  fetcher: (common: CommonQueryParams, page?: number) => Promise<T>
}

const Threads = ({ data }: { data: UserCommonList<ThreadInList> }) =>
  data?.rows.map((item) => (
    <ThreadItem
      key={item.thread_id}
      data={item}
      showSummary
      hideThreadAuthor
      ignoreThreadHighlight
    />
  ))

const Replies = ({ data }: { data: CoalescedList<UserReply> }) =>
  data?.coalescedReplies?.map((item) => (
    <ThreadItem
      key={item.thread_id}
      data={item}
      hideThreadAuthor
      ignoreThreadHighlight
      replies={item.replyItems}
    />
  ))

const PostComments = ({ data }: { data: CoalescedList<UserPostComment> }) =>
  data?.coalescedReplies?.map((item) => (
    <ThreadItem
      key={item.thread_id}
      data={item}
      hideThreadAuthor
      ignoreThreadHighlight
      replies={item.replyItems}
    />
  ))

function ThreadList<T extends PaginationParams>({
  userQuery,
  queryOptions,
  subPage,
  onLoad,
  tab,
}: {
  userQuery: UserQuery
  queryOptions: AdditionalQueryOptions
  subPage: string
  onLoad?: (data: T) => void
  tab: TabProps<T>
}) {
  const Component = tab.component
  const [searchParams, setSearchParams] = useSearchParams()
  const [pagination, setPagination] = useState<PaginationParams>()
  const initQuery = () => ({
    common: { ...userQuery, ...queryOptions },
    subPage,
    page: parseInt(searchParams.get('page') || '1') || 1,
    fid: parseInt(searchParams.get('page') || '') || undefined,
  })
  const [query, setQuery] = useState(initQuery())
  useEffect(() => {
    setQuery(initQuery())
  }, [
    searchParams,
    userQuery.uid,
    userQuery.username,
    userQuery.removeVisitLog,
    userQuery.admin,
  ])
  const { data, isLoading } = useQuery({
    queryKey: ['user', tab.id, query],
    queryFn: async () => {
      const data = await tab.fetcher(query.common, query.page)
      setPagination({
        page: data.page,
        page_size: data.page_size,
        total: data.total,
      })
      onLoad && onLoad(data)
      return data
    },
  })
  return (
    <>
      {isLoading && (
        <>
          {[...Array(4)].map((_, index) => (
            <Skeleton className="w-full" height={102} key={index}></Skeleton>
          ))}
        </>
      )}
      {data && !!data.total && (
        <List>
          <Component data={data} />
        </List>
      )}
      {data && !data.total && <EmptyList text={`暂无${tab.title}`} />}
      {pagination && pagination.total > pagination.page_size && (
        <Stack direction="row" justifyContent="center" my={1.5}>
          <Pagination
            boundaryCount={3}
            siblingCount={1}
            page={pagination.page}
            count={Math.ceil(pagination.total / (pagination.page_size || 1))}
            onChange={(_: React.ChangeEvent<unknown>, page: number) =>
              setSearchParams(searchParamsAssign(searchParams, { page }))
            }
          />
        </Stack>
      )}
    </>
  )
}

function coalesceRepliesOrComments(
  apiData: UserCommonList<UserReply | UserPostComment>
) {
  const data: CoalescedList<UserReply | UserPostComment> = apiData
  const coalescedReplies: CoalescedReply[] = []
  const tidItemMap: {
    [thread_id: number]: CoalescedReply
  } = {}
  data.rows?.forEach((item) => {
    const replyItem = { post_id: item.post_id, summary: item.summary }
    if (tidItemMap[item.thread_id]) {
      tidItemMap[item.thread_id].replyItems.push(replyItem)
    } else {
      const newItem = { ...item, replyItems: [replyItem] }
      tidItemMap[item.thread_id] = newItem
      coalescedReplies.push(newItem)
    }
  })
  data.coalescedReplies = coalescedReplies
  return data
}

const tabs = [
  { id: 'threads', title: '主题', component: Threads, fetcher: getUserThreads },
  {
    id: 'replies',
    title: '回复',
    component: Replies,
    fetcher: (common: CommonQueryParams, page?: number) =>
      getUserReplies(common, page).then((data) =>
        coalesceRepliesOrComments(data)
      ),
  },
  {
    id: 'postcomments',
    title: '点评',
    component: PostComments,
    fetcher: (common: CommonQueryParams, page?: number) =>
      getUserPostComments(common, page).then((data) =>
        coalesceRepliesOrComments(data)
      ),
  },
]

const UserThreads = ({
  userQuery,
  queryOptions,
  onLoad,
}: SubPageCommonProps) => {
  const subPage = useParams().subPage
  const activeTab = tabs.find((item) => item.id == subPage) || tabs[0]
  return (
    <Box pb={1}>
      <Tabs value={subPage}>
        {tabs.map((tab) => (
          <Tab
            to={pages.user({
              uid: userQuery.uid,
              username: userQuery.username,
              removeVisitLog: userQuery.removeVisitLog,
              admin: userQuery.admin,
              subPage: tab.id,
            })}
            component={Link}
            key={tab.id}
            label={tab.title}
            value={tab.id}
          />
        ))}
      </Tabs>
      <Divider />
      <ThreadList
        key={activeTab.id}
        tab={activeTab}
        userQuery={userQuery}
        queryOptions={queryOptions}
        subPage={activeTab.id}
        onLoad={(data) => onLoad && onLoad(data)}
      />
    </Box>
  )
}

export default UserThreads
