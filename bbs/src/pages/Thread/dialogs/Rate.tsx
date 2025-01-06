import { useQuery } from '@tanstack/react-query'

import { useRef, useState } from 'react'
import React from 'react'

import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material'
import {
  Button,
  Checkbox,
  FormControlLabel,
  List,
  ListItemButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

import { parseApiError } from '@/apis/error'
import { RateCreditOptions, getPostRateOptions, ratePost } from '@/apis/thread'
import { ExtCreditName, extCreditNames } from '@/common/interfaces/base'
import { PostFloor } from '@/common/interfaces/response'
import { notifyCreditsUpdate } from '@/common/ui/credits'
import { useAppState } from '@/states'

import { LoadingDialog } from './LoadingDialog'

export const RateDialog = ({
  open,
  onClose,
  onComplete,
  post,
}: {
  open: boolean
  onClose?: () => void
  onComplete?: () => void
  post: PostFloor
}) => {
  const { isLoading, isError, data, error, refetch } = useQuery({
    queryKey: ['post/rate', post.post_id],
    queryFn: () => getPostRateOptions(post.post_id),
  })
  const { dispatch } = useAppState()
  const [pending, setPending] = useState(false)
  const [credits, setCredits] = useState<{ [name in ExtCreditName]?: number }>(
    {}
  )
  const [reason, setReason] = useState('')
  const notifyRef = useRef<HTMLInputElement>(null)

  const rate = async () => {
    try {
      setPending(true)
      if (data?.require_reason && !reason.trim()) {
        dispatch({
          type: 'open snackbar',
          payload: {
            severity: 'error',
            message: '请输入或选择评分理由。',
          },
        })
        return
      }
      const filteredCredits = Object.entries(credits).filter(
        ([_, amount]) => !!amount
      )
      if (filteredCredits.length == 0) {
        dispatch({
          type: 'open snackbar',
          payload: {
            severity: 'error',
            message: '请输入评分数额。',
          },
        })
        return
      }
      const result = await ratePost(post.post_id, {
        credits: Object.fromEntries(filteredCredits),
        reason,
        notify: notifyRef.current?.checked,
      })
      onComplete && onComplete()
      onClose && onClose()
      notifyCreditsUpdate(dispatch, result)
    } catch (e) {
      const { message, severity } = parseApiError(e)
      dispatch({
        type: 'open snackbar',
        payload: {
          severity,
          message,
        },
      })
    } finally {
      setPending(false)
    }
  }

  const tdPx = {
    paddingLeft: 8,
    paddingRight: 8,
  }
  const tdPy = { paddingTop: 8, paddingBottom: 8 }
  return (
    <LoadingDialog
      titleText="评分"
      {...{ open, onClose, isLoading, isError, error }}
    >
      <table>
        <thead>
          <tr>
            <th></th>
            <th css={tdPx}>评分范围</th>
            <th css={tdPx}>今日剩余</th>
          </tr>
        </thead>
        <tbody>
          {extCreditNames
            .filter((name) => (data?.credits || {})[name])
            .map((name) => {
              const details = data?.credits[name]
              if (!details) {
                return <React.Fragment key={name} />
              }
              return (
                <React.Fragment key={name}>
                  <tr>
                    <td css={tdPy}>
                      <TextField
                        type="number"
                        label={name}
                        size="small"
                        sx={{ width: '7em' }}
                        value={credits[name] ?? ''}
                        onChange={(e) => {
                          const value = e.target.value.trim()
                          const newCredits = Object.assign({}, credits)
                          if (!value) {
                            delete newCredits[name]
                          }
                          const valueInt = parseInt(value)
                          if (!isNaN(valueInt)) {
                            newCredits[name] = valueInt
                          }
                          setCredits(newCredits)
                        }}
                      />
                    </td>
                    <td
                      css={{
                        textAlign: 'center',
                        ...tdPx,
                      }}
                    >
                      {details.min ?? 0} ~ {details.max ?? 0}
                    </td>
                    <td css={tdPx}>
                      <RemainingCredits details={details} />
                    </td>
                  </tr>
                  {details.deduct_self && (
                    <tr>
                      <td
                        colSpan={3}
                        css={{
                          maxWidth: 280,
                          paddingLeft: '0.5em',
                          paddingRight: '0.5em',
                          textAlign: 'justify',
                          textWrap: 'pretty',
                        }}
                      >
                        <Typography variant="body2">
                          评分扣除自身相应积分
                          {details.tax_rate_negative && (
                            <>
                              ，扣除他人积分时还需加收{' '}
                              {details.tax_rate_negative * 100}% 的手续费
                            </>
                          )}
                          。
                        </Typography>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              )
            })}
        </tbody>
      </table>
      <Typography mt={1} mb={0.5}>
        评分理由：
      </Typography>
      {!!data?.common_reasons?.length && (
        <List
          disablePadding
          sx={(theme) => ({
            overflowY: 'scroll',
            maxHeight: 130,
            ml: 1,
            backgroundColor:
              theme.palette.mode == 'dark'
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(0, 0, 0, 0.05)',
            ...(theme.palette.mode == 'dark' && {
              '&::-webkit-scrollbar': {
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                width: 4,
                borderRadius: 4,
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                borderRadius: 4,
              },
            }),
          })}
        >
          {data.common_reasons.map((item, index) => (
            <ListItemButton
              key={index}
              sx={{ py: 0.5 }}
              onClick={() => setReason(item)}
            >
              {item}
            </ListItemButton>
          ))}
        </List>
      )}
      <TextField
        size="small"
        fullWidth
        sx={{ mb: 2, mt: data?.common_reasons?.length ? 2 : 0.5 }}
        label={data?.common_reasons?.length ? '填写评分理由' : undefined}
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />
      <Stack direction="row" justifyContent="flex-end" alignItems="center">
        <FormControlLabel
          control={
            <Checkbox
              defaultChecked
              disabled={data?.require_notify}
              inputRef={notifyRef}
            />
          }
          label="通知作者"
          sx={{ mr: 1.5 }}
        />
        <Button variant="contained" onClick={rate} disabled={pending}>
          确定
        </Button>
      </Stack>
    </LoadingDialog>
  )
}

const RemainingCredits = ({ details }: { details: RateCreditOptions }) => {
  const iconSx = { mr: 0.25, width: 16, height: 16 }
  return (
    <Stack alignItems="center" lineHeight={1.15}>
      <div>
        {[
          {
            icon: AddCircleOutline,
            amount: details.remaining_24h_positive,
          },
          {
            icon: RemoveCircleOutline,
            amount: details.remaining_24h_negative,
          },
        ]
          .filter((item) => item.amount)
          .map((item, index) => {
            const Icon = item.icon
            return (
              <Stack direction="row" alignItems="center" key={index}>
                <Icon sx={iconSx} />
                {item.amount}
              </Stack>
            )
          })}
      </div>
    </Stack>
  )
}
