import { useQuery } from '@tanstack/react-query'

import { useEffect, useRef, useState } from 'react'
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

import {
  addComment,
  deleteComment,
  editComment,
  getUserComments,
} from '@/apis/user'
import { UserComment, UserSummary } from '@/common/interfaces/user'
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
  const { data, refetch } = useQuery({
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

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [activeComment, setActiveComment] = useState<UserComment>()
  const editCommentMsg = (item: UserComment) => {
    setActiveComment(item)
    setEditDialogOpen(true)
  }

  const navigate = useNavigate()
  const topRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>()
  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    navigate(
      `${location.pathname}?${searchParamsAssign(searchParams, {
        page,
      })}`,
      { preventScrollReset: true }
    )
    topRef.current?.scrollIntoView()
  }

  const handleComment = async () => {
    if (userSummary && inputRef.current?.value) {
      await addComment({
        uid: userSummary.uid,
        message: inputRef.current.value,
      })
      inputRef.current.value = ''
      refetch()
    }
  }

  return (
    <>
      <Box pb={1}>
        <div ref={topRef} css={scrollAnchorCss} />
        <Stack direction="row" alignItems="center" spacing={2} sx={{ p: 2 }}>
          <Typography variant="userAction">留言板</Typography>
          <TextField
            size="small"
            placeholder="请输入留言"
            inputRef={inputRef}
            sx={{ width: 624 }}
            multiline
          />
          <Button
            variant="contained"
            sx={{ whiteSpace: 'nowrap' }}
            onClick={handleComment}
          >
            留言
          </Button>
        </Stack>

        <Divider style={{ backgroundColor: '#eae8ed' }} />
        {!data &&
          [...Array(15)].map((_, index) => (
            <Skeleton key={index} height={85} />
          ))}
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
                              {
                                title: '回复',
                              },
                            ]) ||
                            []),
                          ...((comment.author_id == state.user.uid && [
                            {
                              title: '编辑',
                              onClick: () => editCommentMsg(comment),
                            },
                          ]) ||
                            []),
                          ...(((self ||
                            comment.author_id == state.user.uid) && [
                            {
                              title: '删除',
                              onClick: async () => {
                                await deleteComment(comment.comment_id)
                                refetch()
                              },
                            },
                          ]) ||
                            []),
                        ]
                      : undefined
                  }
                >
                  <Typography variant="userItemSummary">
                    <UserHtmlRenderer
                      html={comment.message.replace(/\n/g, '<br>')}
                    />
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
      <CommentEditDialog
        open={editDialogOpen}
        item={activeComment}
        onClose={(newComment?: string) => {
          setEditDialogOpen(false)
          if (
            newComment !== undefined &&
            newComment != activeComment?.message
          ) {
            refetch()
          }
        }}
      />
    </>
  )
}

const CommentEditDialog = ({
  open,
  item,
  onClose,
}: {
  open: boolean
  item?: UserComment
  onClose?: (newNote?: string) => void
}) => {
  const [pending, setPending] = useState(false)
  const inputRef = useRef<HTMLInputElement>()
  const updateComment = () => {
    if (item && inputRef.current) {
      setPending(true)
      const newMessage = inputRef.current.value.trim()
      editComment(item.comment_id, { message: newMessage })
        .then(() => onClose && onClose(newMessage))
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
      disableRestoreFocus
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
            <Typography variant="dialogTitle">更新留言</Typography>
          </Stack>
          <IconButton onClick={() => onClose && onClose()}>
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>
      {item && (
        <DialogContent>
          <Stack direction="column" alignItems="center" minWidth={320} m={1}>
            <TextField
              size="small"
              defaultValue={item.message}
              inputRef={inputRef}
              sx={{ width: 500 }}
              multiline
            />
          </Stack>
          <Stack alignItems="center">
            <Button
              disabled={pending}
              onClick={updateComment}
              variant="contained"
            >
              {pending ? '请稍候...' : '保存'}
            </Button>
          </Stack>
        </DialogContent>
      )}
    </Dialog>
  )
}

export default MessageBoard
