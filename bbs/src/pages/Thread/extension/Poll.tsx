import { useRef, useState } from 'react'

import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material'

import { parseApiError } from '@/apis/error'
import { pollVote } from '@/apis/thread'
import {
  Thread,
  ThreadPollDetails,
  ThreadPollOption,
} from '@/common/interfaces/response'
import { useSnackbar } from '@/components/Snackbar'
import { chineseDuration } from '@/utils/dayjs'

const PollExtension = ({ threadDetails }: { threadDetails?: Thread }) => (
  <>
    {threadDetails?.poll && (
      <Poll threadDetails={{ ...threadDetails, poll: threadDetails.poll }} />
    )}
  </>
)

type WithRequiredProperty<Type, Key extends keyof Type> = Type & {
  [Property in Key]-?: Type[Property]
}

const Poll = ({
  threadDetails,
}: {
  threadDetails: WithRequiredProperty<Thread, 'poll'>
}) => {
  const [poll, setPoll] = useState(threadDetails.poll)
  const remainingSeconds = poll.expiration - Math.floor(Date.now() / 1000)
  const ended = !!poll.expiration && remainingSeconds <= 0
  const selectedOptions = useRef(new Map<number, boolean>())
  const [selectCount, setSelectedCount] = useState(0)
  const {
    props: snackbarProps,
    message: snackbarMessage,
    show: showError,
  } = useSnackbar()
  const [pending, setPending] = useState(false)

  const handleChange = (option_id: number, checked: boolean) => {
    // <Radio> fires onChange only when checked so we have to clear to make
    // sure only one option is set.
    if (!poll.multiple) {
      selectedOptions.current.clear()
    }
    selectedOptions.current.set(option_id, checked)
    let count = 0
    for (const [_, checked] of selectedOptions.current) {
      if (checked) {
        ++count
      }
    }
    setSelectedCount(count)
  }

  const vote = async () => {
    if (selectCount == 0) {
      showError('请选择投票选项。')
      return
    }
    if (poll.multiple && poll.max_choices < selectCount) {
      showError(`最多选择 ${poll.max_choices} 项。`)
      return
    }
    if (pending) {
      return
    }
    setPending(true)
    try {
      setPoll(
        await pollVote(
          threadDetails.thread_id,
          Array.from(selectedOptions.current.entries())
            .filter(([_, checked]) => checked)
            .map(([optionId, _]) => optionId)
        )
      )
    } catch (e) {
      const { message } = parseApiError(e)
      showError(message)
    } finally {
      setPending(false)
    }
  }

  return (
    <Stack alignItems="center" my={6} position="relative">
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
        <Box
          display="grid"
          maxWidth="100%"
          gridTemplateColumns="minmax(0, 1fr) min-content"
        >
          {poll.options.map((option, index) => (
            <PollOption
              key={index}
              option={option}
              poll={poll}
              index={index}
              ended={ended}
              checked={
                poll.selected_options?.includes(option.id) ||
                !!selectedOptions.current.get(option.id)
              }
              noMoreChoices={poll.multiple && selectCount >= poll.max_choices}
              onChange={handleChange}
            />
          ))}
        </Box>
      </PollOptionsContainer>
      {!ended && (
        <Stack direction="row" mt={1.5}>
          {poll.selected_options ? (
            <Typography>您已经投票，感谢您的参与！</Typography>
          ) : (
            <Button variant="contained" disabled={pending} onClick={vote}>
              确认投票
            </Button>
          )}
        </Stack>
      )}
      <Snackbar
        {...snackbarProps}
        autoHideDuration={5000}
        anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
        style={{ position: 'absolute', bottom: '60px' }}
      >
        <Alert severity="error">{snackbarMessage}</Alert>
      </Snackbar>
    </Stack>
  )
}

const PollOptionsContainer = ({
  poll,
  children,
}: {
  poll: ThreadPollDetails
  children: React.ReactNode
}) =>
  poll.multiple ? (
    <Box sx={{ maxWidth: '100%' }}>{children}</Box>
  ) : (
    <RadioGroup sx={{ maxWidth: '100%' }}>{children}</RadioGroup>
  )

const kPollOptionBarHeight = 14
const pollOptionBarBaseStyle = {
  height: `${kPollOptionBarHeight}px`,
  borderRadius: `${kPollOptionBarHeight / 2}px`,
}
const pollOptionBarStyle = {
  backgroundColor: '#F5F6F7',
  width: '500px',
  maxWidth: '100%',
  marginBottom: '4px',
  ...pollOptionBarBaseStyle,
}
const pollOptionBarPlaceholderStyle = {
  ...pollOptionBarStyle,
  height: '1px',
  backgroundColor: '#cccccc',
}
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

  const percentage =
    Math.min(1, (option.votes || 0) / (poll.voter_count || 1)) * 100
  const color = kPalette[index % kPalette.length]
  const label = `${index + 1}. ${option.text}`
  const handleChange =
    onChange &&
    ((_: React.SyntheticEvent<Element, Event>, checked: boolean) =>
      onChange(option.id, checked))
  return (
    <>
      <Stack>
        {!ended || poll.selected_options ? (
          <FormControlLabel
            value={option.id}
            control={poll.multiple ? <Checkbox /> : <Radio />}
            checked={poll.selected_options ? checked : undefined}
            onChange={handleChange}
            disabled={
              !!poll.selected_options || ended || (noMoreChoices && !checked)
            }
            label={<Typography>{label}</Typography>}
          />
        ) : (
          <Typography my={1}>{label}</Typography>
        )}
        {option.votes == undefined ? (
          <div css={pollOptionBarPlaceholderStyle} />
        ) : (
          <div css={pollOptionBarStyle}>
            <div
              css={pollOptionBarBaseStyle}
              style={{
                backgroundColor: color,
                width: `${percentage}%`,
              }}
            ></div>
          </div>
        )}
      </Stack>
      <Stack direction="row" alignItems="flex-end">
        {option.votes != undefined && (
          <>
            <Typography mx={1}>{percentage.toFixed(1)}%</Typography>
            <Typography sx={{ color }}>({option.votes || 0})</Typography>
          </>
        )}
      </Stack>
    </>
  )
}

export default PollExtension
