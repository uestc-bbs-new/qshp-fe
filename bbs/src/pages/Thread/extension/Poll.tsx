import { useRef, useState } from 'react'

import {
  Box,
  Button,
  Checkbox,
  Divider,
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
import { chineseDuration } from '@/utils/dayjs'

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
  const ended = !!poll.expiration && remainingSeconds <= 0
  const selectedOptions = useRef<{ [option_id: number]: boolean }>({})
  const [selectCount, setSelectedCount] = useState(0)

  const handleChange = (option_id: number, checked: boolean) => {
    selectedOptions.current[option_id] = checked
    setSelectedCount(
      Object.entries(selectedOptions.current).reduce(
        (count, [_, checked]) => count + (checked ? 1 : 0),
        0
      )
    )
  }

  return (
    <Box my={2.5}>
      <Stack direction="row">
        <Typography mr={1}>{poll.multiple ? '多' : '单'}选投票</Typography>
        {poll.multiple && (
          <Typography>（最多选 {poll.max_choices} 项）</Typography>
        )}
        <Typography ml={1}>共有 {poll.voter_count} 人参与</Typography>
      </Stack>
      {!!poll.expiration && (
        <Stack direction="row">
          <Typography>{ended ? '投票已结束' : '剩余投票时间：'}</Typography>
          {!ended && (
            <Typography fontWeight="bold">
              {chineseDuration(remainingSeconds)}
            </Typography>
          )}
        </Stack>
      )}
      <PollOptionsContainer poll={poll}>
        {poll.options.map((option, index) => (
          <PollOption
            key={index}
            option={option}
            poll={poll}
            index={index}
            ended={ended}
            checked={
              poll.selected_options?.includes(option.id) ||
              selectedOptions.current[option.id]
            }
            noMoreChoices={poll.multiple && selectCount >= poll.max_choices}
            onChange={handleChange}
          />
        ))}
      </PollOptionsContainer>
      {!ended &&
        (poll.selected_options ? (
          <Typography>您已经投票，感谢您的参与！</Typography>
        ) : (
          <Stack direction="row" mt={1}>
            <Button variant="contained">确认投票</Button>
          </Stack>
        ))}
    </Box>
  )
}

const PollOptionsContainer = ({
  poll,
  children,
}: {
  poll: ThreadPollDetails
  children: React.ReactNode
}) => (poll.multiple ? <>{children}</> : <RadioGroup>{children}</RadioGroup>)

const PollOption = ({
  poll,
  option,
  index,
  ended,
  checked,
  noMoreChoices,
  onChange,
}: {
  poll: ThreadPollDetails
  option: ThreadPollOption
  index: number
  ended: boolean
  checked: boolean
  noMoreChoices: boolean
  onChange?: (index: number, checked: boolean) => void
}) => {
  const kPalette = ['#FFA39E', '#FFD591', '#B7EB8F', '#91D5FF']
  const kBarHeight = 14
  const barStyle = {
    height: `${kBarHeight}px`,
    borderRadius: `${kBarHeight / 2}px`,
  }

  const percentage = ((option.votes || 0) / (poll.voter_count || 1)) * 100
  const color = kPalette[index % kPalette.length]
  const label = `${index + 1}. ${option.text}`
  const handleChange =
    onChange &&
    ((_: React.ChangeEvent<HTMLInputElement>, checked: boolean) =>
      onChange(option.id, checked))

  return (
    <>
      {!ended || poll.selected_options ? (
        <FormControlLabel
          value={option.id}
          control={
            poll.multiple ? (
              <Checkbox defaultChecked={checked} onChange={handleChange} />
            ) : (
              <Radio defaultChecked={checked} onChange={handleChange} />
            )
          }
          disabled={
            !!poll.selected_options || ended || (noMoreChoices && !checked)
          }
          label={<Typography>{label}</Typography>}
        />
      ) : (
        <Typography my={1}>{label}</Typography>
      )}
      {option.votes == undefined ? (
        <Divider />
      ) : (
        <Stack direction="row" alignItems="center">
          <div
            style={{
              ...barStyle,
              backgroundColor: '#F5F6F7',
              width: '400px',
            }}
          >
            <div
              style={{
                ...barStyle,
                backgroundColor: color,
                width: `${percentage}%`,
              }}
            ></div>
          </div>
          <Typography mx={1}>{percentage.toFixed(1)}%</Typography>
          <Typography sx={{ color }}>({option.votes})</Typography>
        </Stack>
      )}
    </>
  )
}

export default PollExtension
