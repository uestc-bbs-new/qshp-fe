import { CSSObject, keyframes } from '@emotion/react'
import { useQuery } from '@tanstack/react-query'

import { useRef, useState } from 'react'

import { Close } from '@mui/icons-material'
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

import {
  CaptchaConfiguration,
  CaptchaResult,
  parseCaptchaError,
} from '@/apis/captcha'
import { parseApiError } from '@/apis/error'
import Captcha from '@/components/Captcha'
import Link from '@/components/Link'
import { useAppState } from '@/states'
import { sleep } from '@/utils/misc'

import { getStatus, verifyCode } from './api'

const kCircleSize = 420
const kBorderWidth = 10
const kDotSize = 12
const inputButtonCommonCss = { width: '8em', fontSize: 16 }
const divInnerCommonCss = { borderRadius: '100%', height: '100%' }
const dotCommonCss: CSSObject = {
  borderRadius: '100%',
  width: kDotSize,
  height: kDotSize,
  backgroundColor: '#f9f8a8',
  position: 'absolute',
  transform: 'translate(-50%, -50%)',
}
const rotate = keyframes`
  from {
    transform: rotate(0deg)
  }
  to {
    transform: rotate(360deg)
  }
`
const kDiagonalCirclePos = 14.6447

export const LuckyDraw = () => {
  const { isLoading, isError, data } = useQuery({
    queryKey: ['x', 'freshman', 'status'],
    queryFn: getStatus,
  })
  const [captchaOpen, setCaptchaOpen] = useState(false)
  const [captchaConfig, setCaptchaConfig] = useState<CaptchaConfiguration>()
  const codeRef = useRef<HTMLInputElement>()
  const [animate, setAnimate] = useState(false)
  const { dispatch } = useAppState()
  const validatePrize = async (captcha?: CaptchaResult) => {
    const code = codeRef.current?.value
    if (!code || !code.match(/^[0-9a-z]{8}$/i)) {
      dispatch({
        type: 'open snackbar',
        payload: {
          message: '请准确输入刮刮卡上的兑换码。',
          severity: 'error',
        },
      })
      return
    }
    setAnimate(true)
    const start = Date.now()
    const minAnimate = 3000
    try {
      const result = await verifyCode(code, captcha)
      const remainingTime = minAnimate - (Date.now() - start)
      if (remainingTime > 0) {
        await sleep(remainingTime)
      }
      console.log(result)
    } catch (e) {
      const captchaRequired = parseCaptchaError(e)
      if (captchaRequired) {
        setCaptchaConfig(captchaRequired)
        setCaptchaOpen(true)
      } else {
        const err = parseApiError(e)
        dispatch({
          type: 'open snackbar',
          payload: {
            message: err.message,
            severity: err.severity,
          },
        })
      }
    } finally {
      setAnimate(false)
    }
  }
  const handlePrize = () => validatePrize()
  const submitWithCaptcha = (code: string) => {
    setCaptchaOpen(false)
    validatePrize({
      captcha_type: captchaConfig?.name,
      captcha_value: code,
    })
  }
  const closeCaptcha = () => setCaptchaOpen(false)
  return (
    <Paper sx={{ p: 2, my: 2 }}>
      <Stack alignItems="center">
        <Typography variant="h4" color="#59a4dd">
          河畔刮刮卡
        </Typography>
        {isLoading ? (
          <CircularProgress sx={{ my: 20 }} />
        ) : isError ? (
          <Alert severity="error">网络不畅，请稍后刷新重试。</Alert>
        ) : data?.verified ? (
          <Stack
            alignItems="center"
            my={3}
            px={2}
            pt={1}
            pb={3}
            border="3px dotted #bddb8a"
            borderRadius={3}
          >
            {!!data.water && (
              <Typography
                variant="h6"
                my={2}
                sx={(theme) => ({
                  color: theme.palette.mode == 'dark' ? '#f9d05f' : '#f9d05f',
                })}
              >
                您已获得论坛积分奖励 {data.water} 水滴！
              </Typography>
            )}
            {data.gift && (
              <Typography variant="h6" my={2} color="#f2315f">
                恭喜您获得{data.gift}！请
                <Link
                  to="/home.php?mod=spacecp&ac=pm&touid=248310"
                  external
                  target="_blank"
                >
                  私信
                </Link>
                联系站长领取奖励。
              </Typography>
            )}
            <Typography>感谢您的参与！清水河畔更多精彩等你探索！</Typography>
          </Stack>
        ) : (
          <>
            <Typography variant="h6" fontWeight="normal" mt={1}>
              线下获得实体刮刮卡的用户，请在此处输入兑换码抽奖。
            </Typography>
            <div
              css={{
                width: kCircleSize,
                maxWidth: '100%',
                margin: '32px auto',
              }}
            >
              <div css={{ paddingTop: '100%', position: 'relative' }}>
                <div
                  css={{
                    ...divInnerCommonCss,
                    position: 'absolute',
                    width: '100%',
                    left: 0,
                    top: 0,
                    boxSizing: 'border-box',
                    border: `${kBorderWidth}px solid #fa364d`,
                    ...(animate && {
                      animation: `${rotate} 1s linear infinite`,
                    }),
                  }}
                >
                  <div
                    css={{
                      ...divInnerCommonCss,
                      border: `${kBorderWidth}px solid #faa3b3`,
                    }}
                  >
                    <div
                      css={{
                        ...divInnerCommonCss,
                        background:
                          'repeating-conic-gradient(white 0 22.5deg, #f5db4d 22.5deg 45deg)',
                      }}
                    ></div>
                  </div>
                  <div css={dotCommonCss} style={{ left: 0, top: '50%' }} />
                  <div
                    css={dotCommonCss}
                    style={{ left: '100%', top: '50%' }}
                  />
                  <div css={dotCommonCss} style={{ left: '50%', top: 0 }} />
                  <div
                    css={dotCommonCss}
                    style={{ left: '50%', top: '100%' }}
                  />
                  <div
                    css={dotCommonCss}
                    style={{
                      left: `${kDiagonalCirclePos}%`,
                      top: `${kDiagonalCirclePos}%`,
                    }}
                  />
                  <div
                    css={dotCommonCss}
                    style={{
                      left: `${100 - kDiagonalCirclePos}%`,
                      top: `${kDiagonalCirclePos}%`,
                    }}
                  />
                  <div
                    css={dotCommonCss}
                    style={{
                      left: `${kDiagonalCirclePos}%`,
                      top: `${100 - kDiagonalCirclePos}%`,
                    }}
                  />
                  <div
                    css={dotCommonCss}
                    style={{
                      left: `${100 - kDiagonalCirclePos}%`,
                      top: `${100 - kDiagonalCirclePos}%`,
                    }}
                  />
                </div>
                <Stack
                  position="absolute"
                  justifyContent="center"
                  alignItems="center"
                  width="100%"
                  height="100%"
                  left={0}
                  top={0}
                >
                  <Paper
                    sx={{ p: 2, boxShadow: '0 0 16px rgba(0, 0, 0, 0.5)' }}
                  >
                    <Stack alignItems="center">
                      <TextField
                        label="填写兑换码"
                        size="small"
                        sx={{ ...inputButtonCommonCss, mb: 1 }}
                        inputProps={{ sx: { textAlign: 'center' } }}
                        disabled={animate}
                        inputRef={codeRef}
                      />
                      <Button
                        variant="contained"
                        color="warning"
                        sx={inputButtonCommonCss}
                        onClick={handlePrize}
                        disabled={animate}
                      >
                        立即抽奖
                      </Button>
                    </Stack>
                  </Paper>
                </Stack>
              </div>
            </div>
          </>
        )}
      </Stack>
      {captchaConfig && (
        <Dialog open={captchaOpen}>
          <DialogTitle>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography>请您完成验证后抽奖：</Typography>
              <IconButton onClick={closeCaptcha}>
                <Close />
              </IconButton>
            </Stack>
          </DialogTitle>
          <DialogContent>
            <Captcha captcha={captchaConfig} onVerified={submitWithCaptcha} />
          </DialogContent>
        </Dialog>
      )}
    </Paper>
  )
}
