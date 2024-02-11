import { useQuery } from '@tanstack/react-query'

import React, { useEffect, useRef, useState } from 'react'
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
import { UserFriend, UserSummary } from '@/common/interfaces/user'
import EmptyList from '@/components/EmptyList'
import Link from '@/components/Link'
import Separated from '@/components/Separated'
import { pages } from '@/utils/routes'
import { searchParamsAssign } from '@/utils/tools'

import CommonUserItem from './CommonUserItem'
import { SubPageCommonProps } from './types'

const kQuery = 'query'

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
    ...(searchParams.get(kQuery) && { query: searchParams.get(kQuery) }),
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
      const data = await getUserFriends(query.common, query.page, query.query)
      onLoad && onLoad(data)
      return data
    },
  })

  const queryRef = useRef<HTMLInputElement>()
  const handleSearch = () => {
    const value = queryRef.current?.value.trim()
    if (value && !query.query) {
      setSearchParams(
        searchParamsAssign(searchParams, { query: value }, 'page')
      )
    } else if (!value && query.query) {
      setSearchParams(searchParamsAssign(searchParams, {}, [kQuery, 'page']))
    }
  }

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
                <Typography variant="userAction">查找好友</Typography>
                <TextField
                  size="small"
                  placeholder="用户名或备注"
                  defaultValue={query.query}
                  sx={{ width: 600 }}
                  inputRef={queryRef}
                  inputProps={{ type: 'search' }}
                  onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) =>
                    e.key == 'Enter' && handleSearch()
                  }
                />
                <Button variant="contained" onClick={handleSearch}>
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
                ? query.query
                  ? '未找到相关好友'
                  : '您还未添加过好友'
                : userSummary?.friends_hidden
                  ? '该用户隐藏了好友列表'
                  : '暂无好友'
            }
          />
        )}
        {data && !!data.total && (
          <>
            <Separated separator={<Divider />}>
              {data.rows.map((item) => (
                <FriendItem key={item.uid} item={item} self={self} />
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

const FriendItem = ({ item, self }: { item: UserFriend; self: boolean }) => (
  <CommonUserItem
    user={item}
    menuItems={
      self
        ? [
            <MenuItem key="edit">
              <ListItemText>修改备注</ListItemText>
            </MenuItem>,
            <MenuItem key="delete">
              <ListItemText>删除</ListItemText>
            </MenuItem>,
          ]
        : undefined
    }
  >
    <Typography variant="userItemSummary">
      <Stack direction="row" alignItems="center">
        {item.group_title}
        {item.group_subtitle && (
          <Typography variant="userItemDetails" ml={0.25}>
            ({item.group_subtitle})
          </Typography>
        )}
        {item.latest_thread && (
          <>
            <Typography mx={0.75}>·</Typography>
            <Link
              to={pages.thread(item.latest_thread.tid)}
              underline="hover"
              mt={0.25}
            >
              {item.latest_thread?.subject}
            </Link>
          </>
        )}
      </Stack>
    </Typography>
    <Typography variant="userItemDetails" mt={0.5}>
      <Stack direction="row" spacing={0.75}>
        <Separated separator={<span>·</span>}>
          <span>积分：{item.credits}</span>
          <span>威望：{item.ext_credits['威望'] || 0}</span>
          <span>水滴：{item.ext_credits['水滴'] || 0}</span>
          <span>好友：{item.friends}</span>
          <span>主题：{item.threads}</span>
          <span>回复：{item.replies}</span>
        </Separated>
      </Stack>
    </Typography>
  </CommonUserItem>
)

export default Friends
