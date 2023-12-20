import Vditor from 'vditor'

import React, { createRef, useEffect, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'

import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  List,
  ListItem,
  Pagination,
  Skeleton,
  Stack,
} from '@mui/material'

import {
  getPostDetails,
  getThreadsInfo,
  kPostPageSize,
  replyThreads,
} from '@/apis/thread'
import {
  ForumDetails,
  PostDetailsByPostId,
  PostFloor,
  Thread as ThreadType,
} from '@/common/interfaces/response'
import Avatar from '@/components/Avatar'
import Card from '@/components/Card'
import Editor from '@/components/Editor'
import Error from '@/components/Error'
import Link from '@/components/Link'
import { useAppState } from '@/states'
import { pages } from '@/utils/routes'
import { scrollAnchorStyle, scrollAnchorSx } from '@/utils/scrollAnchor'
import { searchParamsAssign } from '@/utils/tools'

import Floor from './Floor'
import { ParsePost } from './ParserPost'
import ThreadLikes from './ThreadLikes'

const ForumPagination = (props: {
  count: number
  page: number
  onChange: (e: React.ChangeEvent<unknown>, page: number) => void
}) => (
  <Stack direction="row" justifyContent="center" my={1.5}>
    <Pagination boundaryCount={3} siblingCount={1} {...props} />
  </Stack>
)

function Thread() {
  const { state } = useAppState()
  const [vd, setVd] = useState<Vditor>()

  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const thread_id = useParams()['id'] as string
  const [replyRefresh, setReplyRefresh] = useState(0)
  const [threadDetails, setThreadDetails] = useState<ThreadType | undefined>(
    undefined
  )
  const [forumDetails, setForumDetails] = useState<ForumDetails | undefined>(
    undefined
  )
  const [totalPages, setTotalPages] = useState(1)
  const [postDetails, setPostDetails] = useState<PostDetailsByPostId>({})

  const initQuery = () => {
    const authorId = searchParams.get('authorid')
    const orderType = searchParams.get('ordertype')
    return {
      thread_id,
      page: parseInt(searchParams.get('page') || '1') || 1,
      author_id: (authorId && parseInt(authorId)) || undefined,
      order_type: orderType || undefined,
      thread_details: !threadDetails,
      forum_details: !forumDetails,
    }
  }

  const [query, setQuery] = useState(initQuery())

  const { dispatch } = useAppState()
  const navigate = useNavigate()
  const anonymousRef = createRef<HTMLInputElement>()
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
            const details = await getPostDetails({ commentPids, ratePids })
            commentPids
              .concat(ratePids)
              .forEach((pid) => !details[pid] && (details[pid] = {}))
            setPostDetails(details)
          }
        }
      },
    }
  )

  const handleSubmit = async () => {
    if (vd?.getValue()) {
      await replyThreads({
        thread_id: Number(thread_id),
        message: vd?.getValue(),
        is_anonymous: anonymousRef.current?.checked,
        post_id: replyFloor.current?.post_id,
      })
      vd?.setValue('')
      navigate(
        `${location.pathname}?${searchParamsAssign(searchParams, {
          // total + 1 because a new reply was posted just now and info is not yet refreshed.
          page: info?.total ? Math.ceil((info?.total + 1) / kPostPageSize) : 1,
        })}`,
        { preventScrollReset: true }
      )
      setReplyRefresh(replyRefresh + 1)
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
    setThreadDetails(undefined)
    setForumDetails(undefined)
  }, [thread_id])
  useEffect(() => {
    setQuery(initQuery())
    refetch()
  }, [thread_id, searchParams, replyRefresh, state.user.uid])

  const replyFloor = useRef<PostFloor | undefined>(undefined)

  const quickReplyRef = useRef<HTMLElement>()

  const handleReply = (post: PostFloor) => {
    replyFloor.current = post
    let msg = post.message || ''

    // 正则处理回复信息
    const exp = /\[\/quote\]\n\n([\s\S]*)/
    msg = exp.test(msg) ? exp.exec(msg)![1] : msg
    vd?.focus()
    vd?.setValue('')
    vd?.insertValue(
      `> ${post.author || ''}
> ${msg}\n\n`
    )
    quickReplyRef.current?.scrollIntoView()
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
            ? info?.rows.map((item, index) => {
                return (
                  <Card className="mb-4" key={item.position}>
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
                        threadControls={
                          <>
                            <Link
                              color="inherit"
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
                          <ParsePost post={item} />
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
          <Card className="py-4">
            <Stack direction="row">
              <Avatar
                className="mr-4"
                alt="test"
                uid={state.user.uid}
                sx={{ width: 120, height: 120 }}
                variant="rounded"
              />
              <Box className="flex-1" sx={scrollAnchorSx} ref={quickReplyRef}>
                <Editor setVd={setVd} minHeight={300} />
                {/* TODO(fangjue): Extract PostOptions component. */}
                <Box>
                  {forumDetails?.can_post_anonymously && (
                    <FormGroup>
                      <FormControlLabel
                        control={<Checkbox inputRef={anonymousRef} />}
                        label="匿名发帖"
                      />
                    </FormGroup>
                  )}
                </Box>
                <Box className="text-right">
                  <Button variant="text" onClick={handleSubmit}>
                    回复帖子
                  </Button>
                </Box>
              </Box>
            </Stack>
          </Card>
        </>
      )}
    </Box>
  )
}
export default Thread
