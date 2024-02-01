import React from 'react'

import PublishIcon from '@mui/icons-material/Publish'
import { Alert, Box, Stack, Typography } from '@mui/material'

import { ForumDetails, PostFloor, Thread } from '@/common/interfaces/response'
import Avatar from '@/components/Avatar'
import Chip from '@/components/Chip'
import Link from '@/components/Link'
import { CenteredSnackbar, useSnackbar } from '@/components/Snackbar'
import UserCard from '@/components/UserCard'
import { chineseTime } from '@/utils/dayjs'
import { pages } from '@/utils/routes'

import Footer from './Footer'
import PostComments from './PostComments'
import { PostExtraDetailsContainer } from './PostExtraDetails'
import PostRates from './PostRates'
import PostStatus from './PostStatus'
import ThreadLikes from './ThreadLikes'
import PollExtension from './extension/Poll'
import { PostExtraDetailsEx } from './types'

function PostSubject({
  post,
  thread,
  forum,
}: {
  post: PostFloor
  thread?: Thread
  forum?: ForumDetails
}) {
  if (post.is_first) {
    const type =
      forum?.thread_types_map && thread?.type_id
        ? forum.thread_types_map[thread.type_id]
        : null
    return (
      <Stack direction="row" alignItems="center">
        {type?.name && (
          <Link
            to={
              forum &&
              pages.forum(
                forum?.fid,
                new URLSearchParams({ typeid: type.type_id.toString() })
              )
            }
          >
            <Chip text={type.name} size="large" />
          </Link>
        )}
        <Typography variant="h6">{post.subject}</Typography>
      </Stack>
    )
  }
  return <Typography fontWeight="bold">{post.subject}</Typography>
}

type props = {
  children: React.ReactNode
  threadControls?: React.ReactNode
  post: PostFloor
  postDetails?: PostExtraDetailsEx
  threadDetails?: Thread
  forumDetails?: ForumDetails
  onReply: (post: PostFloor) => void
  onComment: (post: PostFloor) => void
  onEdit: (post: PostFloor) => void
}

const Floor = ({
  children,
  threadControls,
  post,
  postDetails,
  threadDetails,
  forumDetails,
  onReply,
  onComment,
  onEdit,
}: props) => {
  const gotoLink =
    post.position == 1 && post.is_first
      ? pages.thread(post.thread_id)
      : pages.goto(post.post_id)

  // 弹出框
  const {
    props: { open, onClose },
    show,
  } = useSnackbar()
  return (
    <Box className="">
      <CenteredSnackbar open={open} autoHideDuration={3000} onClose={onClose}>
        <Alert severity="success">复制成功</Alert>
      </CenteredSnackbar>
      <Stack direction="row">
        <Box className="w-40 flex justify-center pt-5 bg-[#D5E1FB]">
          <UserCard item={post}>
            <div>
              <Avatar
                className="m-auto"
                uid={post.is_anonymous ? 0 : post.author_id}
                sx={{ width: 48, height: 48 }}
                variant="rounded"
              />
              <div className="text-center text-blue-500">
                {post.is_anonymous ? '匿名' : post.author}
              </div>
            </div>
          </UserCard>

          {/* <Typography  */}
        </Box>
        <Box className="flex-1 ml-6 pt-5" minWidth="1em">
          {post.position == 1 && !!post.is_first && (
            <PostSubject
              post={post}
              thread={threadDetails}
              forum={forumDetails}
            />
          )}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            className="text-sm text-slate-300"
            mt={post.position == 1 && post.is_first ? 0.5 : undefined}
            mb={1}
          >
            <Stack direction="row">
              <Link color="inherit" underline="none" to={gotoLink}>
                {chineseTime(post.dateline * 1000)}
              </Link>
              {threadControls}
            </Stack>
            <Stack direction="row" alignItems="center">
              <Link
                color="inherit"
                className="hover:text-blue-500"
                mr={1}
                to={gotoLink}
                underline="hover"
                onClick={(e) => {
                  e.preventDefault()
                  navigator.clipboard.writeText(
                    `${threadDetails?.subject} - 清水河畔\n${location.origin}${gotoLink}`
                  )
                  show('')
                }}
              >
                分享
              </Link>
              <Typography>
                {post.pinned && (
                  <PublishIcon
                    htmlColor="#ff785b"
                    sx={{ verticalAlign: 'middle' }}
                  />
                )}
                #{post.position}
              </Typography>
            </Stack>
          </Stack>
          <PostStatus post={post} />
          {(post.position > 1 || !post.is_first) && (
            <PostSubject
              post={post}
              thread={threadDetails}
              forum={forumDetails}
            />
          )}
          {children}
          {post.position == 1 && !!post.is_first && (
            <PollExtension threadDetails={threadDetails} />
          )}
          {threadDetails && post.position == 1 && post.is_first == 1 && (
            <ThreadLikes
              tid={threadDetails.thread_id}
              values={[post.support, post.oppose]}
            />
          )}
          <PostExtraDetailsContainer
            loading={!!post.has_comment && !postDetails}
            hasContent={
              !!postDetails?.comments?.length || !!postDetails?.commentsRefresh
            }
          >
            <>
              {(postDetails?.comments || !!postDetails?.commentsRefresh) && (
                <PostComments post={post} postDetails={postDetails} />
              )}
            </>
          </PostExtraDetailsContainer>
          <PostExtraDetailsContainer
            loading={!!post.has_rate && !postDetails}
            hasContent={
              !!postDetails?.rates?.length && !!postDetails?.rate_stat
            }
          >
            {postDetails?.rates && postDetails?.rate_stat && (
              <PostRates
                rates={postDetails.rates}
                rateStat={postDetails.rate_stat}
              />
            )}
          </PostExtraDetailsContainer>
          <Footer
            forumDetails={forumDetails}
            threadDetails={threadDetails}
            post={post}
            onReply={() => onReply(post)}
            onComment={() => onComment(post)}
            onEdit={() => onEdit(post)}
          />
        </Box>
      </Stack>
    </Box>
  )
}

export default Floor
