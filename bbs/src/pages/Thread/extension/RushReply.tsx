import { css } from '@emotion/react'

import { useEffect, useState } from 'react'

import { MilitaryTech } from '@mui/icons-material'
import { Stack, Typography } from '@mui/material'

import {
  PostFloor,
  RushReplyDetails,
  Thread,
} from '@/common/interfaces/response'

import {
  ReplyAwardBadge,
  ReplyAwardFloorLeft,
  ReplyAwardFloorRight,
} from './ReplyAwardCommon'

export const RushReplyBadge = ({
  rushReply,
  post,
}: {
  rushReply: RushReplyDetails
  post: PostFloor
}) => {
  const postPosition = post.position.toString()
  if (
    rushReply.target_positions?.some((position) => {
      if (postPosition == position) {
        return true
      }
      if (position.length >= 2 && position[position.length - 1] == '*') {
        return postPosition.startsWith(position.slice(0, -1))
      }
    })
  )
    return (
      <ReplyAwardBadge>
        <Typography variant="replyCredit" ml={1}>
          抢中楼层
        </Typography>
      </ReplyAwardBadge>
    )
  return <></>
}
export const RushReplyFloorLeft = ({
  threadDetails,
  topBottom,
}: {
  threadDetails: Thread
  topBottom?: boolean
}) => (
  <ReplyAwardFloorLeft
    large
    topBottom={topBottom}
    shortName="抢"
    promptText={
      <>
        <Typography ml={3} fontSize={16}>
          抢楼帖
        </Typography>
      </>
    }
    rightBadge={
      threadDetails.can_reply && topBottom ? <RushReplyInProgress /> : undefined
    }
  />
)

const kMaxEndTimePrompt = 60 * 60 * 24 * 7
const formatDuration = (durationInSeconds: number) => {
  const sec = Math.floor(durationInSeconds) % 60
  const min = Math.floor(durationInSeconds / 60) % 60
  const hr = Math.floor(durationInSeconds / 60 / 60) % 24
  const day = Math.floor(durationInSeconds / 60 / 60 / 24)
  let result = ''
  if (day) {
    result += ` ${day} 天`
  }
  if (hr) {
    result += ` ${hr} 小时`
  }
  if (min) {
    result += ` ${min} 分`
  }
  if (sec) {
    result += ` ${sec} 秒`
  }
  return result
}
const TimePrompt = ({ rushReply }: { rushReply: RushReplyDetails }) => {
  const now = Date.now() / 1000
  const pendingStart = rushReply.start_time && rushReply.start_time > now
  const waitingForEnd =
    rushReply.end_time &&
    rushReply.end_time > now &&
    rushReply.end_time - now < kMaxEndTimePrompt
  const [nowMs, setNowMs] = useState(Date.now())
  useEffect(() => {
    let intervalId: number | undefined = undefined
    if (pendingStart || waitingForEnd) {
      intervalId = setInterval(() => {
        setNowMs(Date.now())
      }, 1000)
    } else if (intervalId) {
      clearInterval(intervalId)
      intervalId = undefined
    }
    return () => clearInterval(intervalId)
  })
  return (
    <>
      {pendingStart &&
        rushReply.start_time &&
        `【还有${formatDuration(rushReply.start_time - nowMs / 1000)}开始】`}
      {waitingForEnd &&
        rushReply.end_time &&
        `【还有${formatDuration(rushReply.end_time - nowMs / 1000)}结束】`}
    </>
  )
}

export const RushReplyFloorRight = ({
  threadDetails,
  topBottom,
}: {
  threadDetails: Thread
  topBottom?: boolean
}) => {
  return (
    <ReplyAwardFloorRight topBottom={topBottom} large>
      <Typography variant="replyCreditDetails" textAlign="justify">
        本帖为
        <span css={css({ fontWeight: 'bold' })}>抢楼帖</span>
        {threadDetails.rush_reply?.credit_limit != undefined &&
          `，积分达到 ${threadDetails.rush_reply.credit_limit} 时才能参与`}
        {threadDetails.rush_reply && (
          <TimePrompt rushReply={threadDetails.rush_reply} />
        )}
        {!!threadDetails.rush_reply?.reply_limit &&
          `，每人最多回复 ${threadDetails.rush_reply.reply_limit} 次`}
        {threadDetails.rush_reply?.max_position != undefined &&
          `，截止楼层 ${threadDetails.rush_reply.max_position}`}
        {!!threadDetails.rush_reply?.target_positions?.length &&
          `，目标楼层：${threadDetails.rush_reply.target_positions.join('、')}`}
        。
      </Typography>
      {threadDetails.can_reply && !topBottom && <RushReplyInProgress />}
    </ReplyAwardFloorRight>
  )
}

const RushReplyInProgress = () => (
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
    <MilitaryTech />
    <Typography ml={1}>抢楼进行中</Typography>
  </Stack>
)
