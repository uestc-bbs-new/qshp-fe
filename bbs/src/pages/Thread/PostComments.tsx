import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'

import { ExpandMore } from '@mui/icons-material'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Pagination,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material'

import { getPostDetails } from '@/apis/thread'
import { PostFloor } from '@/common/interfaces/response'
import Avatar from '@/components/Avatar'
import Link from '@/components/Link'
import { chineseTime } from '@/utils/dayjs'

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
    isPreviousData,
  } = useQuery({
    queryKey,
    keepPreviousData: true,
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
    <Accordion defaultExpanded disableGutters>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography variant="h6">点评</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ paddingY: 0 }}>
        {(isLoading || isPreviousData) &&
        ((page == 1 && !postDetails?.commentsRefresh) || page != 1)
          ? [...Array(10)].map((_, index) => (
              <Skeleton key={index} height={50} />
            ))
          : currentPostDetails?.comments?.map((comment) => {
              let time = chineseTime(comment.dateline * 1000)
              if (time.match(/^[0-9a-zA-Z]/)) {
                time = ' ' + time
              }
              return (
                <Stack
                  key={comment.id}
                  direction="row"
                  alignItems="baseline"
                  my={2}
                >
                  <Link to={`/user/${comment.author_id}`}>
                    <Avatar
                      sx={{
                        width: 28,
                        height: 28,
                        display: 'inline-block',
                        verticalAlign: 'middle',
                      }}
                      uid={comment.author_id}
                    />
                    <span
                      style={{
                        verticalAlign: 'middle',
                        fontWeight: 'bold',
                        display: 'inline-block',
                        minWidth: '8em',
                        marginLeft: '0.5em',
                        marginRight: '0.75em',
                      }}
                    >
                      {comment.author}
                    </span>
                  </Link>
                  <span style={{ verticalAlign: 'middle' }}>
                    {comment.message}
                  </span>
                  <span
                    className="text-sm text-slate-300"
                    style={{ verticalAlign: 'middle', marginLeft: '1em' }}
                  >
                    发表于{time}
                  </span>
                </Stack>
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
      </AccordionDetails>
    </Accordion>
  )
}

export default PostComments
