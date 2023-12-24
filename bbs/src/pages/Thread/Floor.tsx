import React from 'react'

import PublishIcon from '@mui/icons-material/Publish'
import { Box, Skeleton, Stack, Typography } from '@mui/material'

import {
  ForumDetails,
  PostExtraDetails,
  PostFloor,
  Thread,
} from '@/common/interfaces/response'
import Avatar from '@/components/Avatar'
import Chip from '@/components/Chip'
import Link from '@/components/Link'
import UserCard from '@/components/UserCard'
import { chineseTime } from '@/utils/dayjs'
import { pages } from '@/utils/routes'

import Footer from './Footer'
import PostComments from './PostComments'
import PostRates from './PostRates'
import PostStatus from './PostStatus'
import PollExtension from './extension/Poll'

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

const PostExtraDetailsContainer = ({
  children,
  loading,
  hasContent,
}: {
  children?: React.ReactElement
  loading: boolean
  hasContent: boolean
}) => {
  return (
    <>
      {(hasContent || loading) && (
        <Box my={2}>
          {hasContent && children}
          {loading && [
            <Skeleton key={1} height={50} />,
            <Skeleton key={2} height={50} />,
            <Skeleton key={3} height={50} />,
          ]}
        </Box>
      )}
    </>
  )
}

type props = {
  children: React.ReactNode
  threadControls?: React.ReactNode
  post: PostFloor
  postDetails?: PostExtraDetails
  threadDetails?: Thread
  forumDetails?: ForumDetails
  onReply: (post: PostFloor) => void
}

const Floor = ({
  children,
  threadControls,
  post,
  postDetails,
  threadDetails,
  forumDetails,
  onReply,
}: props) => {
  const gotoLink =
    post.position == 1 ? pages.thread(post.thread_id) : pages.goto(post.post_id)
  return (
    <Box pt={1.75} pb={1}>
      <Stack direction="row">
        <Box className="w-40 flex justify-center pr-4">
          <UserCard item={post}>
            <div>
              <Avatar
                className="m-auto"
                alt="Remy Sharp"
                uid={post.author_id}
                sx={{ width: 48, height: 48 }}
                variant="rounded"
              />
              <div className="text-center text-blue-500">{post.author}</div>
            </div>
          </UserCard>

          {/* <Typography  */}
        </Box>
        <Box className="flex-1" minWidth="1em">
          {post.position == 1 && (
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
            mt={post.position == 1 ? 0.5 : undefined}
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
          {post.position > 1 && (
            <PostSubject
              post={post}
              thread={threadDetails}
              forum={forumDetails}
            />
          )}
          {children}
          {post.position == 1 && (
            <PollExtension threadDetails={threadDetails} />
          )}
          <PostExtraDetailsContainer
            loading={!!post.has_comment && !postDetails}
            hasContent={!!postDetails?.comments?.length}
          >
            {postDetails?.comments && (
              <PostComments
                post_id={post.post_id}
                comments={postDetails.comments}
                totalPages={postDetails.comment_pages || 1}
              />
            )}
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
          <Footer post={post} onReply={() => onReply(post)} />
        </Box>
      </Stack>
    </Box>
  )
}

export default Floor
