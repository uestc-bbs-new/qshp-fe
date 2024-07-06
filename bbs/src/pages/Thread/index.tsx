import { useQuery } from '@tanstack/react-query'

import React, { useEffect, useState } from 'react'
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'

import {
  Box,
  List,
  ListItem,
  Pagination,
  Skeleton,
  Stack,
  useMediaQuery,
} from '@mui/material'

import { getPostDetails, getThreadsInfo } from '@/apis/thread'
import { ForumDetails } from '@/common/interfaces/forum'
import { PostFloor, Thread as ThreadType } from '@/common/interfaces/response'
import Aside from '@/components/Aside'
import Card from '@/components/Card'
import PostEditor from '@/components/Editor/PostEditor'
import Error from '@/components/Error'
import Link from '@/components/Link'
import { PostRenderer } from '@/components/RichText'
import { InternalStamp, ThreadStamp } from '@/components/Stamps'
import { useAppState, useSignInChange } from '@/states'
import { pages } from '@/utils/routes'
import { scrollAnchorCss, scrollAnchorSx } from '@/utils/scrollAnchor'
import { searchParamsAssign } from '@/utils/tools'

import Floor from './Floor'
import { useWatermark } from './Watermark'
import ActionDialog from './dialogs/index'
import { ActionDialogType, PostDetailsByPostIdEx } from './types'

const kEnforceInternalFids = [
  174, // 就业创业
  395, // 藏经阁
  263, // 职场交流
  267, // 非技术
  378, // 晾晒专栏
]

const ForumPagination = (props: {
  count: number
  page: number
  onChange: (e: React.ChangeEvent<unknown>, page: number) => void
}) => {
  const thinView = useMediaQuery('(max-width: 560px)')
  return (
    <Stack direction="row" justifyContent="center" my={1.5}>
      {props.count > 1 && (
        <Pagination
          boundaryCount={thinView ? 1 : 3}
          siblingCount={1}
          {...props}
        />
      )}
    </Stack>
  )
}

const postElementId = (post_id: number) => `post-${post_id}`

const Thread = () => {
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
  const [currentDialog, setCurrentDialog] =
    useState<ActionDialogType>(undefined)
  const isInternalEnforced =
    !!threadDetails?.forum_id &&
    kEnforceInternalFids.includes(threadDetails?.forum_id)

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
  useEffect(() => {
    if (location.state?.fromForumId != state.activeForum?.fid) {
      dispatch({ type: 'set forum' })
    }
    if (state.activeThread?.thread_id != threadId) {
      dispatch({ type: 'set thread' })
    }
  }, [threadId])
  useEffect(() => {
    return () => {
      dispatch({ type: 'set thread' })
    }
  }, [])

  const {
    data: info,
    error,
    isError: isError,
    isLoading: infoLoading,
    refetch,
  } = useQuery({
    queryKey: ['thread', query],
    queryFn: () => {
      return getThreadsInfo(query)
    },
  })
  useEffect(() => {
    ;(async () => {
      if (info && info.thread) {
        setThreadDetails(info.thread)
        dispatch({ type: 'set thread', payload: info.thread })
      }
      if (info && info.forum) {
        setForumDetails(info.forum)
        dispatch({ type: 'set forum', payload: info.forum })
      }
      if (info && info.total) {
        setTotalPages(Math.ceil(info.total / info.page_size))
      }
      if (info && info.rows) {
        const commentPids: number[] = []
        const ratePids: number[] = []
        info.rows.forEach((post) => {
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
    })()
  }, [info])

  const onSubmitted = (action?: string, fromDialog?: boolean) => {
    if (fromDialog) {
      setDialogOpen(false)
    }

    if (action == 'reply') {
      if (currentlyReversed) {
        refetch()
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        // total + 1 because a new reply was posted just now and info is not yet refreshed.
        const newPage = info?.total
          ? Math.ceil((info.total + 1) / info.page_size)
          : 1
        if (newPage != (info?.page ?? query.page)) {
          navigate(
            `${location.pathname}?${searchParamsAssign(searchParams, {
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

  const refreshComment = () => {
    activePost &&
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
  }

  useEffect(() => {
    const pendingTimeout = new Set<number>()
    if (location.hash) {
      const hash_position = location.hash.slice(1)
      const lastpost = hash_position == 'lastpost' && info?.rows.length
      const targetId = lastpost
        ? postElementId(info.rows[info.rows.length - 1].post_id)
        : hash_position
      const dom = document.getElementById(targetId)
      if (!dom) {
        return
      }
      dom.scrollIntoView({ block: lastpost ? 'end' : 'start' })
      const timeoutId = setTimeout(() => {
        pendingTimeout.delete(timeoutId)
        dom.scrollIntoView({ block: lastpost ? 'end' : 'start' })
      }, 600)
      pendingTimeout.add(timeoutId)
    }
    return () => {
      pendingTimeout.forEach((id) => clearTimeout(id))
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
  }, [threadId, searchParams])
  useSignInChange(refetch)

  const [activePost, setActivePost] = useState<PostFloor>()

  const handleReply = (post: PostFloor) => {
    setActivePost(post)
    setCurrentDialog('reply')
    setDialogOpen(true)
  }

  const handleComment = (post: PostFloor) => {
    setActivePost(post)
    setCurrentDialog('comment')
    setDialogOpen(true)
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

  useWatermark({ text: state.user.uid.toString() })

  const hideSidebar = useMediaQuery('(max-width: 1000px)')
  const narrowView = useMediaQuery('(max-width: 800px)')
  const thinView = useMediaQuery('(max-width: 560px)')

  return (
    <Stack direction="row" alignItems="flex-start">
      <Box className="flex-1" minWidth="1em">
        {isError ? (
          <Error error={error} onRefresh={refetch} />
        ) : (
          <>
            <ForumPagination
              count={totalPages}
              page={info?.page ?? 1}
              onChange={handlePageChange}
            />
            {info?.rows
              ? info?.rows.map((item, index) => {
                  return (
                    <Box
                      className="rounded-lg shadow-lg"
                      mb={thinView ? 1 : 1.75}
                      sx={(theme) => ({
                        backgroundColor:
                          '#' + postElementId(item.post_id) == location.hash
                            ? theme.palette.background.paperHighlighted
                            : theme.palette.background.paper,
                      })}
                      key={item.post_id}
                    >
                      <section
                        id={postElementId(item.post_id)}
                        css={{
                          ...scrollAnchorCss,
                          scrollMarginBottom: '16px',
                          position: 'relative',
                        }}
                        onCopy={
                          isInternalEnforced
                            ? (e) => e.preventDefault() // Maybe show some prompt on copy
                            : undefined
                        }
                      >
                        {!!item.is_first && item.position == 1 && (
                          <ThreadStamp stamp={threadDetails?.stamp} />
                        )}
                        {index == 0 && isInternalEnforced && <InternalStamp />}
                        <Floor
                          post={item}
                          postDetails={postDetails[item.post_id]}
                          threadDetails={threadDetails}
                          forumDetails={forumDetails}
                          firstInPage={index == 0}
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
                                      : {
                                          authorid: item.author_id.toString(),
                                        }),
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
                          <Box pr={narrowView ? undefined : '1.5em'}>
                            <PostRenderer post={item} />
                          </Box>
                        </Floor>
                      </section>
                    </Box>
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
              page={info?.page ?? 1}
              onChange={handlePageChange}
            />
            {forumDetails?.can_post_reply && threadDetails?.can_reply && (
              <Card className="py-4" sx={scrollAnchorSx}>
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
        {activePost && forumDetails && threadId && threadDetails && (
          <ActionDialog
            {...{
              currentDialog,
              open: dialogOpen,
              onClose: closeDialog,
              post: activePost,
              forumDetails,
              threadId,
              threadDetails,
              onSubmitted,
              onComment: refreshComment,
            }}
          />
        )}
      </Box>
      {!hideSidebar && <Aside />}
    </Stack>
  )
}
export default Thread
