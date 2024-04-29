import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { useEffect, useState } from 'react'

import { Sms } from '@mui/icons-material'
import { Box, Pagination, Skeleton, Typography } from '@mui/material'

import { getPostDetails } from '@/apis/thread'
import { PostFloor } from '@/common/interfaces/response'
import Avatar from '@/components/Avatar'
import Link from '@/components/Link'
import { chineseTime } from '@/utils/dayjs'
import { pages } from '@/utils/routes'

import { PostExtraDetailsAccordian } from './PostExtraDetails'
import { PostExtraDetailsEx } from './types'

const PostComments = ({
  post,
  postDetails,
}: {
  post: PostFloor
  postDetails?: PostExtraDetailsEx
}) => {
  const [page, setPage] = useState(1)
  const queryKey: [
    string,
    { post_id: number; page: number; refresh?: number },
  ] = [
    'postcomment',
    { post_id: post.post_id, page, refresh: postDetails?.commentsRefresh },
  ]
  useEffect(() => setPage(1), [postDetails?.commentsRefresh])
  const {
    data: currentPostDetails,
    isLoading,
    isPlaceholderData,
  } = useQuery({
    queryKey,
    placeholderData: keepPreviousData,
    queryFn: async ({ queryKey }) => {
      const [_, { post_id, page }] = queryKey
      if (page == 1 && postDetails?.comments && !postDetails?.commentsRefresh) {
        return postDetails
      }
      const result = (
        await getPostDetails({
          threadId: post.thread_id,
          commentPids: [post.post_id],
          page,
        })
      )[post_id]
      return result
    },
  })
  return (
    <PostExtraDetailsAccordian Icon={Sms} title="点评">
      {(isLoading || isPlaceholderData) &&
      ((page == 1 && !postDetails?.commentsRefresh) || page != 1)
        ? [...Array(10)].map((_, index) => <Skeleton key={index} height={50} />)
        : currentPostDetails?.comments?.map((comment) => {
            let time = chineseTime(comment.dateline * 1000)
            if (time.match(/^[0-9a-zA-Z]/)) {
              time = ' ' + time
            }
            return (
              <Box key={comment.id} my={2}>
                <Link
                  to={pages.user({ uid: comment.author_id })}
                  underline="hover"
                >
                  <Avatar
                    sx={{
                      display: 'inline-block',
                      verticalAlign: 'middle',
                    }}
                    size={28}
                    uid={comment.author_id}
                  />
                  <Typography
                    ml={0.75}
                    mr={1.25}
                    sx={{
                      verticalAlign: 'middle',
                      fontWeight: 'bold',
                      display: 'inline-block',
                      minWidth: '8em',
                      textDecoration: 'inherit',
                    }}
                  >
                    {comment.author}
                  </Typography>
                </Link>
                <span style={{ verticalAlign: 'middle' }}>
                  {comment.message}
                </span>
                <span
                  className="text-sm text-slate-300"
                  style={{
                    verticalAlign: 'middle',
                    marginLeft: '1em',
                  }}
                >
                  发表于{time}
                </span>
              </Box>
            )
          })}
      {currentPostDetails?.comment_pages &&
        currentPostDetails?.comment_pages > 1 && (
          <Box pb={2}>
            <Pagination
              count={currentPostDetails.comment_pages}
              page={page}
              onChange={(_, page) => setPage(page)}
            />
          </Box>
        )}
    </PostExtraDetailsAccordian>
  )
}

export default PostComments
