import { useQuery } from '@tanstack/react-query'

import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { Close } from '@mui/icons-material'
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Pagination,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

import { deleteFriend, editFriend, getUserFriends } from '@/apis/user'
import { UserFriend, UserSummary } from '@/common/interfaces/user'
import Avatar from '@/components/Avatar'
import EmptyList from '@/components/EmptyList'
import Link from '@/components/Link'
import Separated from '@/components/Separated'
import { pages } from '@/utils/routes'
import { scrollAnchorCss } from '@/utils/scrollAnchor'
import { handleEnter, searchParamsAssign } from '@/utils/tools'

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
  const { data, refetch } = useQuery({
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
    if (value && query.query != value) {
      setSearchParams(
        searchParamsAssign(searchParams, { query: value }, 'page')
      )
    } else if (!value && query.query) {
      setSearchParams(searchParamsAssign(searchParams, {}, [kQuery, 'page']))
    }
  }

  const [friendNoteOpen, setFriendNoteOpen] = useState(false)
  const [activeFriend, setActiveFriend] = useState<UserFriend>()
  const editFriendNote = (item: UserFriend) => {
    setActiveFriend(item)
    setFriendNoteOpen(true)
  }

  const deleteFriendNode = async (uid: number) => {
    await deleteFriend(uid)
    refetch()
  }

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
    <>
      <Box pb={1}>
        <div ref={topRef} css={scrollAnchorCss} />
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
                  onKeyDown={handleEnter(handleSearch)}
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
          [...Array(15)].map((_, index) => (
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
                <FriendItem
                  key={item.uid}
                  item={item}
                  self={self}
                  onEditFriendNote={editFriendNote}
                  onDeleteFriend={deleteFriendNode}
                />
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
      <FriendNoteDialog
        open={friendNoteOpen}
        item={activeFriend}
        onClose={(newNote?: string) => {
          setFriendNoteOpen(false)
          if (newNote !== undefined && newNote != activeFriend?.note) {
            refetch()
          }
        }}
      />
    </>
  )
}

const FriendItem = ({
  item,
  self,
  onEditFriendNote,
  onDeleteFriend,
}: {
  item: UserFriend
  self: boolean
  onEditFriendNote: (item: UserFriend) => void
  onDeleteFriend: (uid: number) => void
}) => (
  <CommonUserItem
    user={item}
    menuItems={
      self
        ? [
            { title: '修改备注', onClick: () => onEditFriendNote(item) },
            {
              title: '删除',
              onClick: () => {
                onDeleteFriend(item.uid)
              },
            },
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

const FriendNoteDialog = ({
  open,
  item,
  onClose,
}: {
  open: boolean
  item?: UserFriend
  onClose?: (newNote?: string) => void
}) => {
  const [pending, setPending] = useState(false)
  const inputRef = useRef<HTMLInputElement>()
  const updateNote = () => {
    if (item && inputRef.current) {
      setPending(true)
      const newNote = inputRef.current.value.trim()
      editFriend(item.uid, { note: newNote })
        .then(() => onClose && onClose(newNote))
        .catch(() => setPending(false))
    }
  }
  useEffect(() => {
    if (!open) {
      setPending(false)
    }
  }, [open])
  return (
    <Dialog
      open={open}
      onClose={() => onClose && onClose()}
      disableRestoreFocus // Work around of bug https://github.com/mui/material-ui/issues/33004
    >
      <DialogTitle
        sx={{
          borderBottom: '1px solid #E5E5E5',
          pt: 2.25,
          pb: 1.5,
          pl: 2.5,
          pr: 1.5,
          mb: 2,
        }}
      >
        <Stack direction="row" alignItems="center">
          <Stack direction="row" alignItems="center" flexGrow={1}>
            <Box
              mr={1.25}
              sx={{ width: 6, height: 29, backgroundColor: '#2175F3' }}
            />
            <Typography variant="dialogTitle">设置好友备注</Typography>
          </Stack>
          <IconButton onClick={() => onClose && onClose()}>
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>
      {item && (
        <DialogContent>
          <Stack direction="row" alignItems="center" minWidth={320} mt={1}>
            <Avatar uid={item.uid} size={40} />
            <Typography ml={1}>{item.username}</Typography>
          </Stack>
          <Stack alignItems="center">
            <TextField
              label="好友备注"
              sx={{ my: 3 }}
              defaultValue={item.note}
              inputRef={inputRef}
              autoFocus
              fullWidth
              onKeyDown={handleEnter(updateNote)}
            />
            <Button disabled={pending} onClick={updateNote} variant="contained">
              {pending ? '请稍候...' : '保存'}
            </Button>
          </Stack>
        </DialogContent>
      )}
    </Dialog>
  )
}

export default Friends
