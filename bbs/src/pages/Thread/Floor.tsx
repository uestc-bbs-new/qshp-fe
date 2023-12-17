import { ExpandMore } from '@mui/icons-material'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'

import {
  PostComment,
  PostExtraDetails,
  type PostFloor,
  PostRate,
} from '@/common/interfaces/response'
import Avatar from '@/components/Avatar'
import UserCard from '@/components/UserCard'
import { chineseTime } from '@/utils/dayjs'

import Footer from './Footer'

type props = {
  children: React.ReactElement
  post: PostFloor
  postDetails?: PostExtraDetails
  set_reply: (data: number) => void
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
          {postDetails?.comments && (
            <Box my={2}>
              <PostComments comments={postDetails.comments} />
            </Box>
          )}
          {postDetails?.rates && (
            <Box my={2}>
              <PostRates rates={postDetails.rates} />
            </Box>
          )}
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

const PostComments = ({ comments }: { comments: PostComment[] }) => {
  return (
    <Accordion defaultExpanded disableGutters>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography variant="h6">点评</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ paddingY: 0 }}>
        {comments.map((comment) => {
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
      </AccordionDetails>
    </Accordion>
  )
}

const PostRates = ({ rates }: { rates: PostRate[] }) => {
  const creditsMap = { 威望: 0, 水滴: 0, 奖励券: 0 }
  rates.forEach((rate) => {
    Object.assign(creditsMap, rate.credits)
  })
  const usedCredits = Object.keys(creditsMap).filter((k) => creditsMap[k])
  return (
    <Accordion defaultExpanded disableGutters>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography variant="h6">评分</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ paddingY: 0 }}>
        <Table>
          <TableHead>
            <TableCell>参与人数</TableCell>
            {usedCredits.map((name, index) => (
              <TableCell key={index}>{name}</TableCell>
            ))}
            <TableCell>理由</TableCell>
          </TableHead>
          <TableBody>
            {rates.map((rate, index) => (
              <TableRow key={index}>
                <TableCell>
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
                </TableCell>
                {usedCredits.map((name, index) => (
                  <TableCell key={index}>
                    {rate.credits[name] > 0 && '+'}
                    {rate.credits[name]}
                  </TableCell>
                ))}
                <TableCell>{rate.reason}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </AccordionDetails>
    </Accordion>
  )
}

export default Floor
