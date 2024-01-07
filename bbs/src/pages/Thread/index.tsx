import React, { useEffect, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'

import { Close } from '@mui/icons-material'
import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  Pagination,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

import {
  getPostDetails,
  getThreadsInfo,
  kPostPageSize,
  postComment,
} from '@/apis/thread'
import {
  ForumDetails,
  PostFloor,
  Thread as ThreadType,
} from '@/common/interfaces/response'
import Card from '@/components/Card'
import DraggableDialog from '@/components/DraggableDialog'
import PostEditor from '@/components/Editor/PostEditor'
import Error from '@/components/Error'
import Link from '@/components/Link'
import { PostRenderer } from '@/components/RichText'
import { useAppState } from '@/states'
import { pages } from '@/utils/routes'
import { scrollAnchorStyle, scrollAnchorSx } from '@/utils/scrollAnchor'
import { searchParamsAssign } from '@/utils/tools'

import Floor from './Floor'
import { PostDetailsByPostIdEx } from './types'

const ForumPagination = (props: {
  count: number
  page: number
  onChange: (e: React.ChangeEvent<unknown>, page: number) => void
}) => (
  <Stack direction="row" justifyContent="center" my={1.5}>
    {props.count > 1 && (
      <Pagination boundaryCount={3} siblingCount={1} {...props} />
    )}
  </Stack>
)

function Thread() {
  const { state, dispatch } = useAppState()
  const navigate = useNavigate()

  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const threadId = parseInt(useParams()['id'] || '')
  const [threadDetails, setThreadDetails] = useState<ThreadType | undefined>(
    undefined
  )
  const [forumDetails, setForumDetails] = useState<ForumDetails | undefined>(
    undefined
  )
  const [totalPages, setTotalPages] = useState(1)
  const [postDetails, setPostDetails] = useState<PostDetailsByPostIdEx>({})
  const [dialogOpen, setDialogOpen] = useState(false)
  const closeDialog = () => setDialogOpen(false)
  const [currentDialog, setCurrentDialog] = useState<
    'reply' | 'edit' | 'comment' | undefined
  >(undefined)
  const [dialogPending, setDialogPending] = useState(false)
  const [commentError, setCommentError] = useState(false)
  const commentMessage = useRef<HTMLInputElement>()

  const initQuery = (threadChanged?: boolean) => {
    const authorId = searchParams.get('authorid')
    const orderType = searchParams.get('ordertype')
    return {
      thread_id: threadId,
      page: parseInt(searchParams.get('page') || '1') || 1,
      author_id: (authorId && parseInt(authorId)) || undefined,
      order_type: orderType || undefined,
      thread_details: threadChanged || !threadDetails,
      forum_details: threadChanged || !forumDetails,
    }
  }

  const [query, setQuery] = useState(initQuery())

  const {
    data: info,
    error,
    isError: isError,
    isLoading: infoLoading,
    refetch,
  } = useQuery(
    ['thread', query],
    () => {
      return getThreadsInfo(query)
    },
    {
      onSuccess: async (data) => {
        if (data && data.thread) {
          setThreadDetails(data.thread)
          dispatch({ type: 'set thread', payload: data.thread })
        }
        if (data && data.forum) {
          setForumDetails(data.forum)
          dispatch({ type: 'set forum', payload: data.forum })
        }
        if (data && data.total) {
          setTotalPages(Math.ceil(data.total / kPostPageSize))
        }
        if (data && data.rows) {
          const commentPids: number[] = []
          const ratePids: number[] = []
          data.rows.forEach((post) => {
            if (post.has_comment) {
              commentPids.push(post.post_id)
            }
            if (post.has_rate) {
              ratePids.push(post.post_id)
            }
          })
          if (commentPids.length || ratePids.length) {
            const details = await getPostDetails({
              threadId,
              commentPids,
              ratePids,
            })
            commentPids
              .concat(ratePids)
              .forEach((pid) => !details[pid] && (details[pid] = {}))
            setPostDetails(details)
          }
        }
      },
    }
  )

  const onSubmitted = (action?: string, fromDialog?: boolean) => {
    if (fromDialog) {
      setDialogOpen(false)
    }

    if (action == 'reply') {
      if (currentlyReversed) {
        refetch()
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        const newPage = info?.total
          ? Math.ceil((info?.total + 1) / kPostPageSize)
          : 1
        if (newPage != query.page) {
          navigate(
            `${location.pathname}?${searchParamsAssign(searchParams, {
              // total + 1 because a new reply was posted just now and info is not yet refreshed.
              page: newPage,
            })}`,
            { preventScrollReset: true }
          )
        } else {
          refetch()
        }
      }
    } else if (action == 'edit') {
      if (activePost?.position == 1 && activePost?.is_first) {
        setQuery(initQuery(true))
        refetch()
      } else {
        refetch()
      }
    }
  }

  useEffect(() => {
    if (location.hash) {
      const hash_position = location.hash.slice(1)
      const dom = document.getElementById(hash_position)
      dom?.scrollIntoView()
    }
  }, [info])

  useEffect(() => {
    let threadChanged = false
    if (threadId != query.thread_id) {
      setThreadDetails(undefined)
      setForumDetails(undefined)
      threadChanged = true
    }
    setQuery(initQuery(threadChanged))
  }, [threadId, searchParams, state.user.uid])

  const [activePost, setActivePost] = useState<PostFloor>()

  const quickReplyRef = useRef<HTMLElement>()
  const handleReply = (post: PostFloor) => {
    setActivePost(post)
    setCurrentDialog('reply')
    setDialogOpen(true)
  }

  const handleComment = (post: PostFloor) => {
    setActivePost(post)
    setCurrentDialog('comment')
    setDialogPending(false)
    setCommentError(false)
    setDialogOpen(true)
  }
  const sendComment = () => {
    if (commentMessage.current?.value && activePost) {
      setDialogPending(true)
      postComment(
        activePost.thread_id,
        activePost.post_id,
        commentMessage.current.value
      )
        .then(() => {
          closeDialog()
          setPostDetails(
            Object.assign({}, postDetails, {
              [activePost.post_id]: Object.assign(
                {},
                postDetails[activePost.post_id],
                {
                  commentsRefresh:
                    (postDetails[activePost.post_id]?.commentsRefresh || 0) + 1,
                }
              ),
            })
          )
        })
        .finally(() => setDialogPending(false))
    } else {
      setCommentError(true)
    }
  }

  const handleEdit = (post: PostFloor) => {
    setActivePost(post)
    setCurrentDialog('edit')
    setDialogOpen(true)
  }

  const currentlyReversed =
    query.order_type == 'reverse' ||
    (threadDetails?.reverse_replies && query.order_type != 'forward')

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) =>
    setSearchParams(searchParamsAssign(searchParams, { page }))

  const getEditorInitialValue = (
    post: PostFloor,
    threadDetails?: ThreadType
  ) => {
    return {
      subject: post.subject,
      message: post?.message,
      format: post?.format,
      is_anonymous: !!post.is_anonymous,
      ...(threadDetails && {
        type_id: threadDetails.type_id,
      }),
    }
  }
  return (
    <Box className="flex-1" minWidth="1em">
      {isError ? (
        <Error isError={isError} error={error} onRefresh={refetch} />
      ) : (
        <>
          <ForumPagination
            count={totalPages}
            page={query.page}
            onChange={handlePageChange}
          />
          {info?.rows
            ? info?.rows.map((item) => {
                return (
                  <Card className="mb-4" key={item.post_id}>
                    <section
                      id={`post-${item.post_id}`}
                      style={scrollAnchorStyle}
                    >
                      <Floor
                        post={item}
                        postDetails={postDetails[item.post_id]}
                        threadDetails={threadDetails}
                        forumDetails={forumDetails}
                        onReply={handleReply}
                        onComment={handleComment}
                        onEdit={handleEdit}
                        threadControls={
                          <>
                            <Link
                              color="inherit"
                              className="hover:text-blue-500"
                              underline="hover"
                              to={pages.thread(
                                item.thread_id,
                                new URLSearchParams({
                                  ...(query.order_type && {
                                    ordertype: query.order_type,
                                  }),
                                  ...(query.author_id
                                    ? null
                                    : { authorid: item.author_id.toString() }),
                                })
                              )}
                              ml={2}
                            >
                              {query.author_id ? '查看全部' : '只看该作者'}
                            </Link>
                            {item.position == 1 && !!item.is_first && (
                              <Link
                                color="inherit"
                                className="hover:text-blue-500"
                                underline="hover"
                                ml={2}
                                to={pages.thread(
                                  item.thread_id,
                                  new URLSearchParams({
                                    ...(query.author_id && {
                                      authorid: item.author_id.toString(),
                                    }),
                                    ...(currentlyReversed
                                      ? threadDetails?.reverse_replies && {
                                          ordertype: 'forward',
                                        }
                                      : { ordertype: 'reverse' }),
                                  })
                                )}
                              >
                                {currentlyReversed ? '正序浏览' : '倒序浏览'}
                              </Link>
                            )}
                          </>
                        }
                      >
                        <Box paddingRight="1.5em">
                          <PostRenderer post={item} />
                        </Box>
                      </Floor>
                    </section>
                  </Card>
                )
              })
            : infoLoading && (
                <List>
                  {[...Array(4)].map((_, index) => (
                    <ListItem key={index}>
                      <Skeleton className="w-full" height={81}></Skeleton>
                    </ListItem>
                  ))}
                </List>
              )}

          <ForumPagination
            count={totalPages}
            page={query.page}
            onChange={handlePageChange}
          />
          {forumDetails?.can_post_reply && threadDetails?.can_reply && (
            <Card className="py-4" sx={scrollAnchorSx} ref={quickReplyRef}>
              <Stack direction="row">
                <Box className="flex-1">
                  <PostEditor
                    kind="reply"
                    forum={forumDetails}
                    threadId={threadId}
                    onSubmitted={() => onSubmitted('reply')}
                  />
                </Box>
              </Stack>
            </Card>
          )}
        </>
      )}
      <DraggableDialog
        open={dialogOpen}
        onClose={closeDialog}
        maxWidth="md"
        fullWidth
        dialogTitle={
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography>
              {
                { comment: '点评', reply: '回复', edit: '编辑' }[
                  currentDialog || 'comment'
                ]
              }
            </Typography>
            <IconButton onClick={closeDialog}>
              <Close />
            </IconButton>
          </Stack>
        }
        dialogTitleProps={{ sx: { pl: 2.5, pr: 1.5, py: 1 } }}
      >
        <Box px={2} pb={currentDialog == 'comment' ? undefined : 1.5}>
          {currentDialog == 'comment' ? (
            <>
              <TextField
                fullWidth
                multiline
                required
                error={commentError}
                helperText={commentError && '请输入内容。'}
                inputRef={commentMessage}
              />
              <Stack direction="row" justifyContent="center" my={1}>
                <Button
                  variant="contained"
                  onClick={currentDialog == 'comment' ? sendComment : undefined}
                  disabled={dialogPending}
                >
                  发布
                </Button>
              </Stack>
            </>
          ) : (
            <PostEditor
              kind={currentDialog}
              smallAuthor
              forum={forumDetails}
              threadId={threadId}
              postId={activePost?.post_id}
              replyPost={currentDialog == 'reply' ? activePost : undefined}
              initialValue={
                currentDialog == 'edit' && activePost
                  ? getEditorInitialValue(
                      activePost,
                      activePost.position == 1 && activePost.is_first
                        ? threadDetails
                        : undefined
                    )
                  : undefined
              }
              onSubmitted={() => onSubmitted(currentDialog, true)}
            />
          )}
        </Box>
      </DraggableDialog>
    </Box>
  )
}
export default Thread
