import { MutableRefObject, useState } from 'react'

import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Select,
  SelectProps,
  Stack,
  TextField,
  TextFieldProps,
  Typography,
  useMediaQuery,
} from '@mui/material'

import { PostThreadReplyCreditDetails } from '@/apis/thread'
import { ReplyCreditStatus } from '@/common/interfaces/forum'

import { PostOptionsBlock } from './PostOptionsBase'
import { PostEditorValue } from './types'

const ReplyCredit = ({
  status,
  valueRef,
}: {
  status: ReplyCreditStatus
  valueRef: MutableRefObject<PostEditorValue>
}) => {
  const narrowView = useMediaQuery('(max-width: 930px)')
  const [hasReplyCredit, setReplyCredit] = useState(
    !!valueRef.current?.reply_credit
  )
  const [details, setDetails] = useState<PostThreadReplyCreditDetails>(
    valueRef.current?.reply_credit || {
      credit_amount: 0,
      credit_name: status.allowed_credits[0],
      count: 1,
      limit_per_user: 1,
      probability: 100,
    }
  )
  const updateValueRef = (newDetails?: PostThreadReplyCreditDetails) => {
    if (!valueRef.current) {
      return
    }
    valueRef.current.reply_credit = hasReplyCredit ? newDetails : undefined
    if (newDetails) {
      setDetails(newDetails)
    }
  }
  const settings = status.details[status.allowed_credits[0]]
  const totalAmount = details.credit_amount * details.count
  const taxRate = status.details[status.allowed_credits[0]]?.tax_rate || 0
  const creditsToPay = Math.ceil(totalAmount * (1 + taxRate))
  let errorText = ''
  if (
    creditsToPay >
    (status.details[status.allowed_credits[0]]?.remaining_credits || 0)
  ) {
    errorText = '您的' + status.allowed_credits[0] + '不足！'
  }
  if (settings?.max_total_credits && totalAmount > settings.max_total_credits) {
    errorText = `回帖奖励总额太大（不超过 ${settings.max_total_credits}）！`
  }
  if (
    settings?.max_single_credits &&
    details.credit_amount > settings.max_single_credits
  ) {
    errorText = `每次回帖奖励数额太大（不超过 ${settings.max_single_credits}）！`
  }

  const textFieldProps: TextFieldProps = {
    size: 'small',
    sx: {
      width: narrowView ? '4em' : '6em',
      mx: 1,
      mb: narrowView ? 0.75 : undefined,
      verticalAlign: 'middle',
    },
    InputProps: narrowView
      ? { sx: { px: 1, py: 0.25, input: { px: 1, py: 0 } } }
      : undefined,
  }
  const selectProps: SelectProps = {
    size: 'small',
    sx: { mx: 1, verticalAlign: 'middle' },
    inputProps: narrowView ? { sx: { px: 1, py: 0.25 } } : undefined,
  }
  return (
    <>
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={hasReplyCredit}
              onChange={(e) => {
                const checked = e.target.checked
                setReplyCredit(checked)
                updateValueRef(details)
              }}
            />
          }
          label="散水"
        />
      </FormGroup>
      {hasReplyCredit && (
        <PostOptionsBlock>
          <Box>
            每次回帖奖励
            <TextField
              value={details.credit_amount || ''}
              onChange={(e) => {
                updateValueRef({
                  ...details,
                  credit_amount: parseInt(e.target.value) || 0,
                })
              }}
              {...textFieldProps}
            />
            {status.allowed_credits[0]}
            ，总计
            <TextField
              value={details.count || ''}
              onChange={(e) => {
                updateValueRef({
                  ...details,
                  count: parseInt(e.target.value) || 0,
                })
              }}
              {...textFieldProps}
            />
            份。每人最多
            <Select
              value={details.limit_per_user}
              onChange={(e) => {
                updateValueRef({
                  ...details,
                  limit_per_user: Number(e.target.value),
                })
              }}
              {...selectProps}
            >
              {[...Array(10)].map((_, index) => (
                <MenuItem value={index + 1} key={index}>
                  {index + 1}
                </MenuItem>
              ))}
            </Select>
            次，中奖概率
            <Select
              value={details.probability}
              onChange={(e) => {
                updateValueRef({
                  ...details,
                  probability: Number(e.target.value),
                })
              }}
              {...selectProps}
            >
              {[...Array(10)].map((_, index) => (
                <MenuItem value={(index + 1) * 10} key={index}>
                  {(index + 1) * 10}%
                </MenuItem>
              ))}
            </Select>
            。
          </Box>
          <Stack direction="row" mt={1}>
            {errorText && (
              <Typography color="red" fontWeight="bold">
                {errorText}
              </Typography>
            )}
            <Typography>您当前拥有</Typography>
            <Typography mx={0.5}>
              {status.details[status.allowed_credits[0]]?.remaining_credits}
            </Typography>
            <Typography>{status.allowed_credits[0]}</Typography>
            ，回帖奖励总额
            <Typography mx={0.5}>{totalAmount}</Typography>
            <Typography>{status.allowed_credits[0]}</Typography>
            {!!taxRate && (
              <>
                ，税后支付
                <Typography mx={0.5}>{creditsToPay}</Typography>
                <Typography>{status.allowed_credits[0]}</Typography>
              </>
            )}
            。
          </Stack>
        </PostOptionsBlock>
      )}
    </>
  )
}

export default ReplyCredit
