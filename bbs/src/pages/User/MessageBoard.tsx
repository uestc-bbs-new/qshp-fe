import { useQuery } from '@tanstack/react-query'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import {
  Box,
  Button,
  Divider,
  ListItemText,
  MenuItem,
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

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ p: 2 }}>
        <Typography fontSize={16} fontWeight="600" color="rgb(95, 97, 102)">
          留言板
        </Typography>
        <TextField size="small" placeholder="请输入留言" sx={{ width: 624 }} />
        <Button variant="contained" sx={{ whiteSpace: 'nowrap' }}>
          留言
        </Button>
      </Stack>

      <Divider style={{ backgroundColor: '#eae8ed' }} />
      {!data &&
        [...Array(10)].map((_, index) => <Skeleton key={index} height={85} />)}
      {data && !data.total && <EmptyList text="暂无留言" />}
      {!!data?.total && (
        <>
          <Separated separator={<Divider />}>
            {data.rows.map((comment) => (
              <CommonUserItem
                user={{ uid: comment.author_id, username: comment.author }}
                key={comment.comment_id}
                menuItems={
                  (self || comment.author_id == state.user.uid) && (
                    <>
                      {self && comment.author_id != state.user.uid && (
                        <MenuItem>
                          <ListItemText>回复</ListItemText>
                        </MenuItem>
                      )}
                      {comment.author_id == state.user.uid && (
                        <MenuItem>
                          <ListItemText>编辑</ListItemText>
                        </MenuItem>
                      )}
                      {(self || comment.author_id == state.user.uid) && (
                        <MenuItem>
                          <ListItemText>删除</ListItemText>
                        </MenuItem>
                      )}
                    </>
                  )
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
                onChange={(_: React.ChangeEvent<unknown>, page: number) =>
                  setSearchParams(searchParamsAssign(searchParams, { page }))
                }
              />
            </Stack>
          )}
        </>
      )}
    </Box>
  )
}
export default MessageBoard
