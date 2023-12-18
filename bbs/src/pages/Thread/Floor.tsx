import React, { useState } from 'react'
import { useQuery } from 'react-query'

import { ExpandMore } from '@mui/icons-material'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Pagination,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'

import { getPostDetails } from '@/apis/thread'
import {
  PostComment,
  PostExtraDetails,
  type PostFloor,
  PostRate,
  PostRateStat,
} from '@/common/interfaces/response'
import Avatar from '@/components/Avatar'
import Chip from '@/components/Chip'
import Link from '@/components/Link'
import UserCard from '@/components/UserCard'
import { chineseTime } from '@/utils/dayjs'

import Footer from './Footer'

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
          {hasContent
            ? children
            : [
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
                totalPages={postDetails.comment_pages}
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

const PostStatus = ({ post }: { post: PostFloor }) => {
  return (
    <>
      {post.warned && (
        <Alert severity="warning">
          <Typography>本帖被管理员或版主警告</Typography>
        </Alert>
      )}
      {post.blocked && (
        <Alert severity="warning">
          <Typography>本帖被管理员或版主屏蔽</Typography>
        </Alert>
      )}
      {post.hidden_reply && (
        <Alert severity="info">
          <Typography>此帖仅作者可见</Typography>
        </Alert>
      )}
      {post.password && (
        <Alert severity="info">
          <Typography>本帖为密码帖</Typography>
        </Alert>
      )}
    </>
  )
}

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

const PostRates = ({
  rates,
  rateStat,
}: {
  rates: PostRate[]
  rateStat: PostRateStat
}) => {
  const kCreditNamesToPromote = ['威望', '奖励券']
  const kCreditNamesInOrder = ['威望', '水滴', '奖励券']
  const kMaxPromotedRates = 3
  const kMaxInitialRates = 10
  const promotedRates = []
  let initialRates = []
  const usedCredits: string[] = []
  for (const rate of rates) {
    if (
      kCreditNamesToPromote.some((name) => rate.credits[name]) &&
      promotedRates.length < kMaxPromotedRates
    ) {
      promotedRates.push(rate)
    } else if (initialRates.length < kMaxInitialRates) {
      initialRates.push(rate)
    }
  }
  initialRates = promotedRates.concat(initialRates).slice(0, kMaxInitialRates)
  kCreditNamesInOrder.forEach(
    (name) => rateStat.total_credits[name] && usedCredits.push(name)
  )
  return (
    <Accordion defaultExpanded disableGutters>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography variant="h6">评分</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ paddingY: 0 }}>
        <Table>
          <TableHead>
            <TableCell sx={{ width: '14em' }}>
              共 {rateStat.total_users} 人参与
            </TableCell>
            {usedCredits.map((name, index) => (
              <TableCell
                key={index}
                className="text-center"
                sx={{ width: '12em' }}
              >
                {name}
                {rateStat.total_credits[name] != 0 && (
                  <Chip
                    text={
                      (rateStat.total_credits[name] > 0 ? '+' : '') +
                      rateStat.total_credits[name]
                    }
                  />
                )}
              </TableCell>
            ))}
            <TableCell>理由</TableCell>
          </TableHead>
          <TableBody>
            {initialRates.map((rate, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Link to={`/user/${rate.user_id}`}>
                    <Stack direction="row" alignItems="center">
                      <Avatar
                        sx={{
                          width: 28,
                          height: 28,
                          display: 'inline-block',
                          verticalAlign: 'middle',
                        }}
                        uid={rate.user_id}
                      />
                      <Typography ml={1}>{rate.username}</Typography>
                    </Stack>
                  </Link>
                </TableCell>
                {usedCredits.map((name, index) => (
                  <TableCell key={index} className="text-center">
                    {rate.credits[name] > 0 && '+'}
                    {rate.credits[name]}
                  </TableCell>
                ))}
                <TableCell>{rate.reason}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {rates.length > initialRates.length && (
          <Stack direction="row" justifyContent="flex-end" my={1}>
            <Button>查看更多</Button>
          </Stack>
        )}
      </AccordionDetails>
    </Accordion>
  )
}

export default Floor
