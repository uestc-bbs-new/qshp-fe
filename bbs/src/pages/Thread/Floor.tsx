import React from 'react'

import { Box, Skeleton, Stack } from '@mui/material'

import { PostExtraDetails, type PostFloor } from '@/common/interfaces/response'
import Avatar from '@/components/Avatar'
import UserCard from '@/components/UserCard'
import { chineseTime } from '@/utils/dayjs'

import Footer from './Footer'
import PostComments from './PostComments'
import PostRates from './PostRates'
import PostStatus from './PostStatus'

type props = {
  children: React.ReactElement
  post: PostFloor
  postDetails?: PostExtraDetails
  set_reply: (data: number) => void
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

const Floor = ({ children, post, postDetails, set_reply }: props) => {
  return (
    <Box className="py-4">
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
          <div className="text-sm text-slate-300 flex justify-between">
            <div>{chineseTime(post.dateline * 1000)}</div>
            <div className="flex flex-row gap-3 justify-between">
              <div
                className="hover:text-blue-500"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  navigator.clipboard.writeText(
                    window.location.href.split('#')[0] + '#' + post.position
                  )
                }}
              >
                分享
              </div>
              <div>#{post.position}</div>
            </div>
          </div>
          <PostStatus post={post} />
          {children}
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
          <Footer post={post} set_reply={set_reply} />
        </Box>
      </Stack>
    </Box>
  )
}

export default Floor
