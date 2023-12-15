import Vditor from 'vditor'

import { createRef, useEffect, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import { useLocation, useParams, useSearchParams } from 'react-router-dom'

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
  Typography,
} from '@mui/material'

import { getThreadsInfo, replyThreads } from '@/apis/thread'
import {
  ForumDetails,
  PostFloor,
  Thread as ThreadType,
} from '@/common/interfaces/response'
import Avatar from '@/components/Avatar'
import Card from '@/components/Card'
import Chip from '@/components/Chip'
import Editor from '@/components/Editor'
import Error from '@/components/Error'
import Link from '@/components/Link'
import { useAppState } from '@/states'
import { chineseTime } from '@/utils/dayjs'

import Floor from './Floor'
import { ParsePost } from './ParserPost'
import ThreadLikes from './ThreadLikes'

const kPageSize = 20

function searchParamsAssign(value: URLSearchParams, kvList: object) {
  return new URLSearchParams(
    Object.entries(Object.assign(Object.fromEntries(value.entries()), kvList))
  )
}

function PostSubject({
  post,
  thread,
  forum,
}: {
  post: PostFloor
  thread: ThreadType | null
  forum: ForumDetails | null
}) {
  if (post.is_first) {
    const typeName =
      forum?.thread_types_map && thread?.type_id
        ? forum.thread_types_map[thread.type_id]?.name
        : null
    return (
      <Stack direction="row" alignItems="center">
        {typeName && (
          <Link>
            <Chip text={typeName} />
          </Link>
        )}
        <Typography variant="h6">{post.subject}</Typography>
      </Stack>
    )
  }
  return <Typography fontWeight="bold">{post.subject}</Typography>
}

function Thread() {
  const { state } = useAppState()
  const [vd, setVd] = useState<Vditor>()

  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const thread_id = useParams()['id'] as string
  const [replyRefresh, setReplyRefresh] = useState(0)
  const [threadDetails, setThreadDetails] = useState<ThreadType | null>(null)
  const [forumDetails, setForumDetails] = useState<ForumDetails | null>(null)
  const [totalPages, setTotalPages] = useState(1)

  /**
   * 用于记录页面的 query 参数
   * @typedef {{ thread_id: number, page: number}} Query
   */
  const [query, setQuery] = useState(
    /** @type {Query} */
    {
      thread_id: thread_id,
      page: 1,
    }
  )

  const { dispatch } = useAppState()
  const anonymousRef = createRef<HTMLInputElement>()
  const {
    data: info,
    error,
    isError: isError,
    isLoading: infoLoading,
    refetch,
  } = useQuery(
    [query],
    () => {
      return getThreadsInfo(
        thread_id,
        query.page,
        !threadDetails,
        !forumDetails
      )
    },
    {
      onSuccess: (data) => {
        if (data && data.thread) {
          setThreadDetails(data.thread)
          dispatch({ type: 'set thread', payload: data.thread })
        }
        if (data && data.forum) {
          setForumDetails(data.forum)
          dispatch({ type: 'set forum', payload: data.forum })
        }
        if (data && data.total) {
          setTotalPages(Math.ceil(data.total / kPageSize))
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
        post_id:
          reply_floor.current.post_id === -1
            ? undefined
            : reply_floor.current.post_id,
      })
      vd?.setValue('')
      setSearchParams(
        searchParamsAssign(searchParams, {
          // total + 1 because a new reply was posted just now and info is not yet refreshed.
          page: info?.total ? Math.ceil((info?.total + 1) / kPageSize) : 1,
        })
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
    setThreadDetails(null)
    setForumDetails(null)
  }, [thread_id])
  useEffect(() => {
    setQuery({
      ...query,
      page: Number(searchParams.get('page')) || 1,
    })
    refetch()
  }, [searchParams, thread_id, replyRefresh, state.user.uid])

  const reply_floor = useRef({
    floor: 1,
    post_id: -1,
  })

  const set_reply = (floor: number) => {
    reply_floor.current.floor = floor
    const reply_item = info?.rows.find((item) => item.position === floor)
    let msg = reply_item?.message || ''
    reply_floor.current.post_id = reply_item?.post_id || 1

    // 正则处理回复信息
    const exp = /\[\/quote\]\n\n([\s\S]*)/
    msg = exp.test(msg) ? exp.exec(msg)![1] : msg
    vd?.setValue(
      `> ${info?.rows.find((item) => item.position === floor)?.author || ''}
      ${msg}\n
      `
    )
    vd?.focus()
  }

  return (
    <Box className="flex-1" minWidth="1em">
      {isError ? (
        <Error isError={isError} error={error} onRefresh={refetch} />
      ) : (
        <>
          <Pagination
            count={totalPages}
            page={Number(searchParams.get('page')) || 1}
            onChange={(e, value) => {
              setSearchParams(searchParamsAssign(searchParams, { page: value }))
            }}
          />
          {info?.rows
            ? info?.rows.map((item, index) => {
                return (
                  <Card className="mb-4" key={item.position}>
                    <section
                      id={item.position.toString()}
                      style={{ scrollMarginTop: '80px' }}
                    >
                      <Floor item={item} set_reply={set_reply}>
                        <>
                          <PostSubject
                            post={item}
                            thread={threadDetails}
                            forum={forumDetails}
                          />
                          <div className="text-sm text-slate-300 flex justify-between">
                            <div>{chineseTime(item.dateline * 1000)}</div>
                            <div className="flex flex-row gap-3 justify-between">
                              <div
                                className="hover:text-blue-500"
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                  navigator.clipboard.writeText(
                                    window.location.href.split('#')[0] +
                                      '#' +
                                      item.position
                                  )
                                }}
                              >
                                分享
                              </div>
                              <div>#{item.position}</div>
                            </div>
                          </div>
                          <Box paddingRight="1.5em">
                            <ParsePost post={item} />
                          </Box>
                          {item.is_first && item.position == 1 && (
                            <ThreadLikes values={[item.support, item.oppose]} />
                          )}
                        </>
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

          <Card className="py-4">
            <Stack direction="row">
              <Avatar
                className="mr-4"
                alt="test"
                uid={state.user.uid}
                sx={{ width: 120, height: 120 }}
                variant="rounded"
              />
              <Box className="flex-1">
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
