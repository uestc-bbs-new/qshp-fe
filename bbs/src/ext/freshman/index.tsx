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
  SxProps,
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
import Error from '@/components/Error'
import Link from '@/components/Link'
import { useAppState } from '@/states'
import { sleep } from '@/utils/misc'
import { pages } from '@/utils/routes'

import { LuckyDrawResult, getStatus, verifyCode } from './api'

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
const scaleIn = keyframes`
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
`
const kDiagonalCirclePos = 14.6447

export const LuckyDraw = () => {
  const { isLoading, isError, error, data, refetch } = useQuery({
    queryKey: ['x', 'freshman', 'status'],
    queryFn: getStatus,
  })
  const [captchaOpen, setCaptchaOpen] = useState(false)
  const [captchaConfig, setCaptchaConfig] = useState<CaptchaConfiguration>()
  const codeRef = useRef<HTMLInputElement>()
  const [animate, setAnimate] = useState(false)
  const [luckyResult, setResult] = useState<LuckyDrawResult>()
  const [resultOpen, setResultOpen] = useState(false)
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
      setResult(result)
      setResultOpen(true)
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
  const closeResult = async () => {
    await refetch()
    setResultOpen(false)
  }
  return (
    <Paper sx={{ p: 2, my: 2 }}>
      <Stack alignItems="center">
        <Typography variant="h4" color="#59a4dd">
          河畔刮刮卡
        </Typography>
        {isLoading ? (
          <CircularProgress sx={{ my: 20 }} />
        ) : isError ? (
          <Stack mt={4} mb={2}>
            <Error error={error} />
          </Stack>
        ) : data?.verified ? (
          <PrizeResult data={data} />
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
        <Typography variant="h6" my={2}>
          活动说明参见
          <Link to={pages.thread(2369410)}>
            河畔18周年预热活动——”刮刮卡迎新生“
          </Link>
        </Typography>
        <Typography color="#999" variant="body2">
          *活动最终解释权归清水河畔管理组所有
        </Typography>
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
      {luckyResult && resultOpen && (
        <Dialog
          open
          onClose={closeResult}
          PaperProps={{ sx: { animation: `${scaleIn} 1s ease` } }}
        >
          <DialogContent>
            <PrizeResult data={luckyResult} sx={{ mt: 0, mb: 2 }} />
            <Stack direction="row" justifyContent="center">
              <Button variant="contained" onClick={closeResult}>
                返回
              </Button>
            </Stack>
          </DialogContent>
        </Dialog>
      )}
    </Paper>
  )
}

const PrizeResult = ({ data, sx }: { data: LuckyDrawResult; sx?: SxProps }) => (
  <Stack
    alignItems="center"
    my={3}
    px={2}
    pt={1}
    pb={3}
    border="3px dotted #bddb8a"
    borderRadius={3}
    sx={sx}
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
        恭喜您获得{data.gift}！
        {data.claim_text == '1' ? (
          <>
            请
            <Link
              to="/home.php?mod=spacecp&ac=pm&touid=248310"
              external
              target="_blank"
            >
              私信
            </Link>
            联系站长领取奖励。
          </>
        ) : data.claim_text == '2' ? (
          <>
            奖品定做中，请关注站内提醒与
            <Link to={pages.forum(46)}>站务综合</Link>
            公告，我们将尽快公布领奖方式。
          </>
        ) : (
          data.claim_text
        )}
      </Typography>
    )}
    <Typography>感谢您的参与！清水河畔更多精彩等你探索！</Typography>
  </Stack>
)
