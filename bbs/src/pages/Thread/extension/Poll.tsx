import {
  Box,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material'

import {
  Thread,
  ThreadPollDetails,
  ThreadPollOption,
} from '@/common/interfaces/response'

const PollExtension = ({ threadDetails }: { threadDetails?: Thread }) => (
  <>
    {threadDetails?.poll && (
      <Poll threadDetails={threadDetails} poll={threadDetails.poll} />
    )}
  </>
)

const Poll = ({
  threadDetails,
  poll,
}: {
  threadDetails: Thread
  poll: ThreadPollDetails
}) => {
  const remainingSeconds = poll.expiration - Math.floor(Date.now() / 1000)
  return (
    <Box>
      <Stack direction="row">
        <Typography mr={1}>{poll.multiple ? '多' : '单'}选投票</Typography>
        <Typography>共有 {poll.voter_count} 人参与</Typography>
      </Stack>
      <Stack direction="row">
        <Typography>
          {remainingSeconds <= 0 ? '投票已结束' : '剩余投票时间：'}
        </Typography>
        {remainingSeconds > 0 && (
          <Typography>chineseDuration(remainingSeconds)</Typography>
        )}
      </Stack>
      <PollOptionsContainer poll={poll}>
        {poll.options.map((option, index) => (
          <PollOption key={index} option={option} poll={poll} index={index} />
        ))}
      </PollOptionsContainer>
    </Box>
  )
}

const PollOptionsContainer = ({
  poll,
  children,
}: {
  poll: ThreadPollDetails
  children: React.ReactNode
}) => (poll.multiple ? <>children</> : <RadioGroup>{children}</RadioGroup>)

const PollOption = ({
  poll,
  option,
  index,
}: {
  poll: ThreadPollDetails
  option: ThreadPollOption
  index: number
}) => {
  const kPalette = ['#FFA39E', '#FFD591', '#B7EB8F', '#91D5FF']
  const kBarHeight = 14
  const barStyle = {
    height: `${kBarHeight}px`,
    borderRadius: `${kBarHeight / 2}px`,
  }

  const checked = poll.selected_options?.includes(option.id)
  const percentage = ((option.votes || 0) / (poll.voter_count || 1)) * 100
  const color = kPalette[index % kPalette.length]

  return (
    <>
      <FormControlLabel
        value={option.id}
        control={
          poll.multiple ? (
            <Checkbox checked={checked} />
          ) : (
            <Radio checked={checked} />
          )
        }
        label={`${index + 1}. ${option.text}`}
      />
      <Stack direction="row" alignItems="center">
        <div
          style={{
            ...barStyle,
            backgroundColor: '#F5F6F7',
            width: '400px',
          }}
        >
          {option.votes && (
            <div
              style={{
                ...barStyle,
                backgroundColor: color,
                width: `${percentage}%`,
              }}
            ></div>
          )}
        </div>
        {option.votes && (
          <>
            <Typography>{percentage.toFixed(1)}%</Typography>
            <Typography sx={{ color }}>({option.votes})</Typography>
          </>
        )}
      </Stack>
    </>
  )
}

export default PollExtension
