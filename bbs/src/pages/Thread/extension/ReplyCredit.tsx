import { css } from '@emotion/react'

import { Stack, Typography } from '@mui/material'

import { PostFloor, Thread } from '@/common/interfaces/response'
import Timer from '@/components/icons/Timer'

import {
  ReplyAwardBadge,
  ReplyAwardFloorLeft,
  ReplyAwardFloorRight,
} from './ReplyAwardCommon'

export const ReplyCreditBadge = ({ post }: { post: PostFloor }) => (
  <ReplyAwardBadge>
    <Typography variant="replyCredit" ml={1}>
      回帖奖励 +{post.reply_credit_amount} {post.reply_credit_name}
    </Typography>
  </ReplyAwardBadge>
)

export const ReplyCreditFloorLeft = ({
  threadDetails,
  topBottom,
}: {
  threadDetails: Thread
  topBottom?: boolean
}) => (
  <ReplyAwardFloorLeft
    topBottom={topBottom}
    shortName="奖"
    promptText={
      <>
        <Typography ml={3} mr={1} fontSize={16}>
          {threadDetails.reply_credit?.remaining_amount}
        </Typography>
        <Typography>{threadDetails.reply_credit?.credit_name}</Typography>
      </>
    }
    rightBadge={
      threadDetails.can_reply && topBottom ? (
        <ReplyCreditInProgress />
      ) : undefined
    }
  />
)

export const ReplyCreditFloorRight = ({
  threadDetails,
  topBottom,
}: {
  threadDetails: Thread
  topBottom?: boolean
}) => (
  <ReplyAwardFloorRight topBottom={topBottom}>
    <Typography variant="replyCreditDetails" textAlign="justify">
      本帖为
      <span css={css({ fontWeight: 'bold' })}>散水帖</span>
      ，回复本帖可获得 {threadDetails.reply_credit?.credit_amount}{' '}
      {threadDetails.reply_credit?.credit_name}
      奖励！
      {!!threadDetails.reply_credit?.limit_per_user && (
        <>每人限 {threadDetails.reply_credit.limit_per_user} 次</>
      )}
      {!!(
        threadDetails.reply_credit?.limit_per_user &&
        threadDetails.reply_credit?.probability
      ) && <>，</>}
      {!!threadDetails.reply_credit?.probability && (
        <>中奖概率 {threadDetails.reply_credit.probability}%</>
      )}
      {!!(
        threadDetails.reply_credit?.limit_per_user ||
        threadDetails.reply_credit?.probability
      ) && <>。</>}
    </Typography>
    {threadDetails.can_reply && !topBottom && <ReplyCreditInProgress />}
  </ReplyAwardFloorRight>
)

const ReplyCreditInProgress = () => (
  <Stack
    direction="row"
    alignItems="center"
    flexShrink={0}
    ml={1.5}
    sx={{
      borderRadius: '4px',
      backgroundColor: 'rgba(33, 117, 243, 0.8)',
      color: 'white',
      fontSize: 16,
      px: 1.25,
      py: 0.75,
    }}
  >
    <Timer />
    <Typography ml={1}>散水进行中</Typography>
  </Stack>
)
