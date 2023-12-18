import { useState } from 'react'
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
import { PostComment } from '@/common/interfaces/response'
import Avatar from '@/components/Avatar'
import Link from '@/components/Link'
import { chineseTime } from '@/utils/dayjs'

const PostComments = ({
  post_id,
  comments,
  totalPages,
}: {
  post_id: number
  comments: PostComment[]
  totalPages: number
}) => {
  const [page, setPage] = useState(1)
  const queryKey: [string, { post_id: number; page: number }] = [
    'postcomment',
    { post_id, page },
  ]
  const { data: currentComments, isLoading } = useQuery({
    queryKey,
    queryFn: async ({ queryKey }) => {
      const [_, { post_id, page }] = queryKey
      if (page == 1) {
        return comments
      }
      const result = (
        await getPostDetails({
          commentPids: [post_id],
          page,
        })
      )[post_id]
      if (result?.comments?.length) {
        return result.comments
      }
      throw 'no data'
    },
  })
  return (
    <Accordion defaultExpanded disableGutters>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography variant="h6">点评</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ paddingY: 0 }}>
        {isLoading && page != 1
          ? [...Array(10)].map((_, index) => (
              <Skeleton key={index} height={50} />
            ))
          : currentComments?.map((comment) => {
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
                  <Typography>
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
                  </Typography>
                </Stack>
              )
            })}
        {totalPages > 1 && (
          <Box pb={2}>
            <Pagination
              count={totalPages}
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
