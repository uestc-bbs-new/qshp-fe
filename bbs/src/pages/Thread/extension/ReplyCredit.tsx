import { css } from '@emotion/react'

import { Box, Stack, Typography } from '@mui/material'

import { PostFloor, Thread } from '@/common/interfaces/response'
import { ReplyCredit } from '@/components/icons/ReplyCredit'
import Timer from '@/components/icons/Timer'

export const ReplyCreditBadge = ({ post }: { post: PostFloor }) => (
  <Stack alignItems="flex-start" mb={0.75}>
    <Box position="relative" left={-26} width={240}>
      <svg
        css={css({ display: 'block' })}
        viewBox="0 0 320 47"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M296.9,23.5L320,43H10V3h310L296.9,23.5z"
          fill="#FBACA3"
          fillRule="evenodd"
        />
        <path
          d="M9.8,46.1V33.9L0,40L9.8,46.1z"
          fill="#DF6A6A"
          fillRule="evenodd"
        />
        <path
          d="M296.2,20.5L320,40H0L0,0l320,0L296.2,20.5z"
          fill="#FFF4DD"
          fillRule="evenodd"
        />
      </svg>
      <Stack
        position="absolute"
        left="0"
        right="0"
        top="0"
        bottom="0"
        direction="row"
        justifyContent="center"
        alignItems="center"
        pb={0.35}
        pr={1}
      >
        <ReplyCredit css={css({ width: 16 })} />
        <Typography variant="replyCredit" ml={1}>
          回帖奖励 +{post.reply_credit_amount} {post.reply_credit_name}
        </Typography>
      </Stack>
    </Box>
  </Stack>
)

const kReplyCreditHeight = 56

export const ReplyCreditFloorLeft = ({
  threadDetails,
  topBottom,
}: {
  threadDetails: Thread
  topBottom?: boolean
}) => (
  <Stack
    direction="row"
    justifyContent={
      threadDetails.can_reply && topBottom ? 'space-between' : 'center'
    }
    alignItems="center"
    borderBottom={topBottom ? undefined : '5px solid #A3B8DC'}
    height={topBottom ? undefined : kReplyCreditHeight}
    px={topBottom ? 2 : undefined}
    pt={topBottom ? 1.5 : undefined}
  >
    <Stack direction="row" justifyContent="center" alignItems="center">
      <div
        css={css({
          backgroundColor: '#679EF8',
          border: '2px solid #196BE7',
          color: 'white',
          fontSize: '14px',
          textAlign: 'center',
          width: '20px',
          lineHeight: '20px',
          boxSizing: 'content-box',
        })}
      >
        奖
      </div>
      <Typography ml={3} mr={1} fontSize={16}>
        {threadDetails.reply_credit?.remaining_amount}
      </Typography>
      <Typography>{threadDetails.reply_credit?.credit_name}</Typography>
    </Stack>
    {threadDetails.can_reply && topBottom && <ReplyCreditInProgress />}
  </Stack>
)

export const ReplyCreditFloorRight = ({
  threadDetails,
  topBottom,
}: {
  threadDetails: Thread
  topBottom?: boolean
}) => (
  <Stack
    direction="row"
    alignItems="center"
    justifyContent="space-between"
    borderBottom={`${topBottom ? 2 : 5}px solid #E0E0E0`}
    height={topBottom ? undefined : kReplyCreditHeight}
    px={2}
    py={topBottom ? 1 : undefined}
  >
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
  </Stack>
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
