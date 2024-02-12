import { useQuery } from '@tanstack/react-query'

import { createRef, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import {
  Box,
  Button,
  Divider,
  Pagination,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

import { getUserComments } from '@/apis/user'
import EmptyList from '@/components/EmptyList'
import { UserHtmlRenderer } from '@/components/RichText'
import Separated from '@/components/Separated'
import { useAppState } from '@/states'
import { chineseTime } from '@/utils/dayjs'
import { scrollAnchorCss } from '@/utils/scrollAnchor'
import { searchParamsAssign } from '@/utils/tools'

import CommonUserItem from './CommonUserItem'
import { SubPageCommonProps } from './types'

function MessageBoard({
  userQuery,
  queryOptions,
  onLoad,
  self,
}: SubPageCommonProps & {
  self: boolean
}) {
  const [searchParams, setSearchParams] = useSearchParams()
  const initQuery = () => ({
    common: { ...userQuery, ...queryOptions },
    page: parseInt(searchParams.get('page') || '1') || 1,
  })
  const [query, setQuery] = useState(initQuery())
  const { data } = useQuery({
    queryKey: ['user', 'profile', query],
    queryFn: async () => {
      const data = await getUserComments(query.common, query.page)
      onLoad && onLoad(data)
      return data
    },
  })
  useEffect(() => {
    setQuery(initQuery())
  }, [
    searchParams,
    userQuery.uid,
    userQuery.username,
    userQuery.removeVisitLog,
    userQuery.admin,
  ])
  const { state } = useAppState()

  const navigate = useNavigate()
  const topRef = createRef<HTMLDivElement>()
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
    <Box pb={1}>
      <div ref={topRef} css={scrollAnchorCss} />
      <Stack direction="row" alignItems="center" spacing={2} sx={{ p: 2 }}>
        <Typography variant="userAction">留言板</Typography>
        <TextField size="small" placeholder="请输入留言" sx={{ width: 624 }} />
        <Button variant="contained" sx={{ whiteSpace: 'nowrap' }}>
          留言
        </Button>
      </Stack>

      <Divider style={{ backgroundColor: '#eae8ed' }} />
      {!data &&
        [...Array(15)].map((_, index) => <Skeleton key={index} height={85} />)}
      {data && !data.total && <EmptyList text="暂无留言" />}
      {!!data?.total && (
        <>
          <Separated separator={<Divider />}>
            {data.rows.map((comment) => (
              <CommonUserItem
                user={{
                  uid: comment.author_id,
                  username: comment.author,
                  note: comment.friend_note,
                }}
                key={comment.comment_id}
                menuItems={
                  self || comment.author_id == state.user.uid
                    ? [
                        ...((self &&
                          comment.author_id != state.user.uid && [
                            { title: '回复' },
                          ]) ||
                          []),
                        ...((comment.author_id == state.user.uid && [
                          { title: '编辑' },
                        ]) ||
                          []),
                        ...(((self || comment.author_id == state.user.uid) && [
                          { title: '删除' },
                        ]) ||
                          []),
                      ]
                    : undefined
                }
              >
                <Typography variant="userItemSummary">
                  <UserHtmlRenderer html={comment.message} />
                </Typography>
                <Typography variant="userItemDetails" mt={0.5}>
                  {chineseTime(comment.dateline * 1000)}
                </Typography>
              </CommonUserItem>
            ))}
          </Separated>
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
export default MessageBoard
