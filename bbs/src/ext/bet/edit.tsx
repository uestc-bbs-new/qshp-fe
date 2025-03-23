import React, { useState } from 'react'

import {
  Alert,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

import {
  normalizeNumberInput,
  parseNumberInput,
  toDatetimeLocal,
} from '@/utils/input'

import { BetDetails, BetStatus, createBet, updateBet } from './api'

export const BetEditDialog = ({
  open,
  onClose,
  initialValue,
}: {
  open: boolean
  onClose: (shouldRefetch?: boolean) => void
  initialValue?: BetDetails & { status?: BetStatus }
}) => {
  const inDraft = !initialValue || initialValue.status == 'draft'
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [title, setTitle] = useState(initialValue?.title ?? '')
  const emptyOption = { text: '', rate: '' }
  const [options, setOptions] = useState(
    initialValue?.options?.map((item) => ({
      text: item.text,
      rate: item.rate.toString(),
    })) ?? [{ ...emptyOption }, { ...emptyOption }]
  )
  const [endTime, setEndTime] = useState(
    initialValue?.end_time
      ? toDatetimeLocal(new Date(initialValue.end_time))
      : ''
  )
  const [taxRate, setTaxRate] = useState(
    initialValue?.tax_rate ? (initialValue.tax_rate * 100).toString() : ''
  )
  const [minCredits, setMinCredits] = useState(
    initialValue?.min_bet_credits?.toString() ?? ''
  )
  const [maxCredits, setMaxCredits] = useState(
    initialValue?.max_bet_credits?.toString() ?? ''
  )
  const [errorPrompt, setErrorPrompt] = useState('')
  const [submitValue, setSubmitValue] = useState<BetDetails>()
  const [submitPending, setSubmitPending] = useState(false)

  const setOption = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newOptions = options.slice()
    newOptions[index] = Object.assign(newOptions[index], {
      text: e.target.value,
    })
    setOptions(newOptions)
  }
  const setRate = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newOptions = options.slice()
    newOptions[index] = Object.assign(newOptions[index], {
      rate: normalizeNumberInput(e.target.value),
    })
    setOptions(newOptions)
  }

  const prepareSubmit = (draft?: boolean) => {
    const value: BetDetails = {
      title: title.trim(),
      options: options
        .map((item) => ({
          text: item.text.trim(),
          rate: parseNumberInput(item.rate, { float: true }),
        }))
        .filter((item) => item.text && !isNaN(item.rate) && item.rate > 1),
    }
    if (draft) {
      value.draft = true
    }
    if (!value.title) {
      setErrorPrompt('请输入标题。')
      return
    }
    if (value.options && value.options.length < 2) {
      setErrorPrompt('请输入有效的竞猜选项及赔率。')
      return
    }

    let num = parseFloat(taxRate)
    if (num) {
      value.tax_rate = num / 100
    }
    num = parseInt(minCredits)
    if (num) {
      value.min_bet_credits = num
    }
    num = parseInt(maxCredits)
    if (num) {
      value.max_bet_credits = num
    }
    if (endTime) {
      const date = new Date(endTime)
      if (date) {
        value.end_time = date.getTime()
      }
    }
    if (draft || !inDraft) {
      doSubmit(value)
    } else {
      setSubmitValue(value)
      setConfirmOpen(true)
    }
  }

  const handleSubmit = () => {
    submitValue && doSubmit(submitValue)
  }

  const doSubmit = async (value: BetDetails) => {
    setSubmitPending(true)
    try {
      if (initialValue?.id) {
        await updateBet(initialValue.id, value)
      } else {
        await createBet(value)
      }
      onClose(true)
    } finally {
      setSubmitPending(false)
    }
  }
  return (
    <>
      <Dialog open={open} onClose={() => onClose()}>
        <DialogTitle>
          <Typography variant="h5">开新盘</Typography>
        </DialogTitle>
        <DialogContent>
          <div
            css={{
              display: 'grid',
              grid: 'auto-flow / max-content 1fr max-content 1fr',
              alignItems: 'center',
              gap: '1em',
            }}
          >
            <Typography>标题</Typography>
            <TextField
              size="small"
              css={{ gridColumn: 'span 3' }}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {/* <Typography css={{ gridColumn: 'span 3' }}>
            描述
          </Typography>
          <TextField multiline css={{ gridColumn: 'span 3' }} /> */}
            {options.map((item, index) => (
              <React.Fragment key={index}>
                <Typography>选项 {index + 1}</Typography>
                <TextField
                  size="small"
                  value={item.text}
                  onChange={(e) => setOption(index, e)}
                  disabled={!inDraft}
                />
                <Typography>赔率</Typography>
                <TextField
                  size="small"
                  value={item.rate}
                  onChange={(e) => setRate(index, e)}
                  disabled={!inDraft}
                />
              </React.Fragment>
            ))}
          </div>
          <div
            css={{
              display: 'grid',
              grid: 'auto-flow / max-content 1fr max-content 1fr',
              alignItems: 'center',
              gap: '1em',
              marginTop: '2em',
            }}
          >
            <Typography>截止时间</Typography>
            <TextField
              size="small"
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
            <Typography>服务费率</Typography>
            <Stack direction="row" alignItems="center">
              <TextField
                size="small"
                type="number"
                disabled={!inDraft}
                value={taxRate}
                onChange={(e) =>
                  setTaxRate(
                    normalizeNumberInput(e.target.value, { nonNegative: true })
                  )
                }
              />
              <Typography ml={0.5}>%</Typography>
            </Stack>
            <Typography>最低投注</Typography>
            <TextField
              size="small"
              type="number"
              value={minCredits}
              onChange={(e) =>
                setMinCredits(
                  normalizeNumberInput(e.target.value, {
                    integer: true,
                    nonNegative: true,
                  })
                )
              }
            />
            <Typography>最高投注</Typography>
            <TextField
              size="small"
              type="number"
              value={maxCredits}
              onChange={(e) =>
                setMaxCredits(
                  normalizeNumberInput(e.target.value, {
                    integer: true,
                    nonNegative: true,
                  })
                )
              }
            />
          </div>
          {errorPrompt && (
            <Alert severity="error" sx={{ my: 1.5 }}>
              {errorPrompt}
            </Alert>
          )}
          <Stack direction="row" spacing="1em" mt={1.5}>
            <Button
              color="success"
              variant="contained"
              onClick={() => prepareSubmit()}
            >
              {inDraft ? '确认开盘' : '保存'}
            </Button>
            {inDraft && (
              <Button
                color="secondary"
                variant="outlined"
                onClick={() => prepareSubmit(true)}
              >
                保存草稿
              </Button>
            )}
            <Button variant="outlined" onClick={() => onClose()}>
              {!initialValue || initialValue.status == 'draft'
                ? '放弃开盘'
                : '返回'}
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>
          <Typography variant="h6">确认开盘信息</Typography>
          <Typography>请仔细核对选项与赔率，开盘后无法更改：</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography fontWeight="bold" mb={1}>
            {title}
          </Typography>
          {options.map((item, index) => (
            <Stack direction="row" key={index}>
              <Typography>{item.text}</Typography>
              <Typography ml={1}>赔率：{item.rate}</Typography>
            </Stack>
          ))}
          <Stack direction="row" mt={1}>
            <Typography>服务费率</Typography>
            <Typography ml={1}>{taxRate || 0}%</Typography>
          </Stack>
          <Stack direction="row" spacing="1em" mt={2}>
            <Button
              color="primary"
              variant="contained"
              disabled={submitPending}
              onClick={handleSubmit}
            >
              确认无误
            </Button>
            <Button variant="outlined" onClick={() => setConfirmOpen(false)}>
              返回修改
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  )
}
