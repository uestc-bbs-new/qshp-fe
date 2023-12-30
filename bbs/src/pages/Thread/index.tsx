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
import ThreadLikes from './ThreadLikes'
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
  const [replyRefresh, setReplyRefresh] = useState(0)
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
    'reply' | 'comment' | undefined
  >(undefined)
  const [dialogPending, setDialogPending] = useState(false)
  const [commentError, setCommentError] = useState(false)
  const activePost = useRef<PostFloor>()
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

  const onReplied = () => {
    navigate(
      `${location.pathname}?${searchParamsAssign(searchParams, {
        // total + 1 because a new reply was posted just now and info is not yet refreshed.
        page: info?.total ? Math.ceil((info?.total + 1) / kPostPageSize) : 1,
      })}`,
      { preventScrollReset: true }
    )
    setReplyRefresh(replyRefresh + 1)
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
    refetch()
  }, [threadId, searchParams, replyRefresh, state.user.uid])

  const replyFloor = useRef<PostFloor | undefined>(undefined)

  const quickReplyRef = useRef<HTMLElement>()
  const handleReply = (post: PostFloor) => {
    replyFloor.current = post
    let msg = post.message || ''

    // 正则处理回复信息
    const exp = /\[\/quote\]\n\n([\s\S]*)/
    msg = exp.test(msg) ? exp.exec(msg)![1] : msg
    //     vd?.focus()
    //     vd?.setValue('')
    //     vd?.insertValue(
    //       `> ${post.author} 发表于 [${chineseTime(post.dateline * 1000, {
    //         full: true,
    //       })}](/goto/${post.post_id})
    // > ${msg}\n\n`
    //     )
    quickReplyRef.current?.scrollIntoView()
  }

  const handleComment = (post: PostFloor) => {
    activePost.current = post
    setCurrentDialog('comment')
    setDialogPending(false)
    setCommentError(false)
    setDialogOpen(true)
  }
  const sendComment = () => {
    if (commentMessage.current?.value && activePost.current) {
      const post = activePost.current
      setDialogPending(true)
      postComment(post.thread_id, post.post_id, commentMessage.current.value)
        .then(() => {
          closeDialog()
          setPostDetails(
            Object.assign({}, postDetails, {
              [post.post_id]: Object.assign({}, postDetails[post.post_id], {
                commentsRefresh:
                  (postDetails[post.post_id]?.commentsRefresh || 0) + 1,
              }),
            })
          )
        })
        .finally(() => setDialogPending(false))
    } else {
      setCommentError(true)
    }
  }

  const currentlyReversed =
    query.order_type == 'reverse' ||
    (threadDetails?.reverse_replies && query.order_type != 'forward')

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) =>
    setSearchParams(searchParamsAssign(searchParams, { page }))

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
                            {item.position == 1 && (
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
                        {threadDetails &&
                          item.is_first == 1 &&
                          item.position == 1 && (
                            <ThreadLikes
                              tid={threadDetails.thread_id}
                              values={[item.support, item.oppose]}
                            />
                          )}
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
          {forumDetails && (
            <Card className="py-4" sx={scrollAnchorSx} ref={quickReplyRef}>
              <Stack direction="row">
                <Box className="flex-1">
                  <PostEditor
                    kind="reply"
                    forum={forumDetails}
                    threadId={threadId}
                    onReplied={onReplied}
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
              {currentDialog == 'comment' ? '点评' : '回复'}
            </Typography>
            <IconButton onClick={closeDialog}>
              <Close />
            </IconButton>
          </Stack>
        }
      >
        <Box px={4}>
          {currentDialog == 'comment' ? (
            <TextField
              fullWidth
              multiline
              required
              error={commentError}
              helperText={commentError && '请输入内容。'}
              inputRef={commentMessage}
            />
          ) : (
            <></>
          )}
          <Stack direction="row" justifyContent="center" my={1}>
            <Button
              onClick={currentDialog == 'comment' ? sendComment : undefined}
              disabled={dialogPending}
            >
              发布
            </Button>
          </Stack>
        </Box>
      </DraggableDialog>
    </Box>
  )
}
export default Thread
