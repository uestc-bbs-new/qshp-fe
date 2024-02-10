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

import { getUserFriends } from '@/apis/user'
import { UserSummary } from '@/common/interfaces/user'
import EmptyList from '@/components/EmptyList'
import Link from '@/components/Link'
import Separated from '@/components/Separated'
import { pages } from '@/utils/routes'
import { searchParamsAssign } from '@/utils/tools'

import CommonUserItem from './CommonUserItem'
import { SubPageCommonProps } from './types'

function Friends({
  userQuery,
  queryOptions,
  onLoad,
  self,
  userSummary,
}: SubPageCommonProps & {
  self: boolean
  userSummary?: UserSummary
}) {
  const [searchParams, setSearchParams] = useSearchParams()
  const initQuery = () => ({
    common: { ...userQuery, ...queryOptions },
    page: parseInt(searchParams.get('page') || '1') || 1,
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
  const { data } = useQuery({
    queryKey: ['user', 'friends', query],
    queryFn: async () => {
      const data = await getUserFriends(query.common, query.page)
      onLoad && onLoad(data)
      return data
    },
  })

  return (
    <>
      <Box pb={1}>
        {self && (
          <>
            <Stack
              direction="row"
              justifyContent={'space-between'}
              sx={{ p: 1.5 }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography
                  fontSize={16}
                  fontWeight="600"
                  color="rgb(95, 97, 102)"
                >
                  查找好友
                </Typography>
                <TextField
                  size="small"
                  placeholder="输入用户名"
                  sx={{ width: 600 }}
                />
                <Button variant="contained" sx={{ whiteSpace: 'nowrap' }}>
                  搜索
                </Button>
              </Stack>

              <Typography color="rgb(33, 117, 243)" className="mt-3">
                邀请好友
              </Typography>
            </Stack>
            <Divider />
          </>
        )}
        {!data &&
          [...Array(10)].map((_, index) => (
            <Skeleton key={index} height={85} />
          ))}
        {data && !data.total && (
          <EmptyList
            text={
              self
                ? '您还未添加过好友'
                : userSummary?.friends_hidden
                  ? '该用户隐藏了好友列表'
                  : '暂无好友'
            }
          />
        )}
        {data && !!data.total && (
          <>
            <Separated separator={<Divider />}>
              {data.rows.map((friend) => (
                <CommonUserItem
                  user={friend}
                  key={friend.uid}
                  menuItems={
                    self && (
                      <>
                        <MenuItem>
                          <ListItemText>修改备注</ListItemText>
                        </MenuItem>
                        <MenuItem>
                          <ListItemText>删除</ListItemText>
                        </MenuItem>
                      </>
                    )
                  }
                >
                  <Typography variant="userItemSummary">
                    <Stack direction="row" alignItems="center">
                      {friend.group_title}
                      {friend.group_subtitle && (
                        <Typography variant="userItemDetails" ml={0.25}>
                          ({friend.group_subtitle})
                        </Typography>
                      )}
                      {friend.latest_thread && (
                        <>
                          <Typography mx={0.75}>·</Typography>
                          <Link
                            to={pages.thread(friend.latest_thread.tid)}
                            underline="hover"
                            mt={0.25}
                          >
                            {friend.latest_thread?.subject}
                          </Link>
                        </>
                      )}
                    </Stack>
                  </Typography>
                  <Typography variant="userItemDetails" mt={0.5}>
                    <Stack direction="row" spacing={0.75}>
                      <Separated separator={<span>·</span>}>
                        <span>积分：{friend.credits}</span>
                        <span>威望：{friend.ext_credits['威望'] || 0}</span>
                        <span>水滴：{friend.ext_credits['水滴'] || 0}</span>
                        <span>好友：{friend.friends}</span>
                        <span>主题：{friend.threads}</span>
                        <span>回复：{friend.replies}</span>
                      </Separated>
                    </Stack>
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
    </>
  )
}
export default Friends
