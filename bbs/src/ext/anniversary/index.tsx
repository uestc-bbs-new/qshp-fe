import { keyframes } from '@emotion/react'
import { useQuery } from '@tanstack/react-query'

import React, { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

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
import { sleep } from '@/utils/misc'
import { pages } from '@/utils/routes'
import { searchParamsAssign } from '@/utils/tools'

import {
  LuckyDrawResult,
  LuckyDrawStatus,
  getStatus,
  kSpecialCode,
  verifyCode,
} from './api'
import { LuckyDrawPlate } from './luckydraw'
import { QrScanError, QrScanner } from './qrcode'

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

const Index = () => {
  const { isLoading, isError, error, data, refetch } = useQuery({
    queryKey: ['x', 'freshman', 'status'],
    queryFn: getStatus,
  })
  const [searchParams, setSearchParams] = useSearchParams()
  const directScan = searchParams.get('s')
  const [captchaOpen, setCaptchaOpen] = useState(false)
  const [captchaConfig, setCaptchaConfig] = useState<CaptchaConfiguration>()
  const barcodeRef = useRef<string>('')
  const code2Ref = useRef<HTMLInputElement>()
  const [animate, setAnimate] = useState(!!directScan)
  const [luckyResult, setResult] = useState<LuckyDrawResult>()
  const [resultError, setResultError] = useState<{
    message: string
    severity: string
  }>()
  const [resultOpen, setResultOpen] = useState(false)
  const [specialPrompt, setSpecialPrompt] = useState(false)
  const validatePrize = async (captcha?: CaptchaResult) => {
    setAnimate(true)
    const start = Date.now()
    const minAnimate = 3000
    try {
      if (barcodeRef.current == kSpecialCode) {
        setSpecialPrompt(true)
        return
      }
      const result = await verifyCode(barcodeRef.current, captcha)
      const remainingTime = minAnimate - (Date.now() - start)
      if (remainingTime > 0) {
        await sleep(remainingTime)
      }
      setResult(result)
      setResultError(undefined)
      setResultOpen(true)
    } catch (e) {
      const captchaRequired = parseCaptchaError(e)
      if (captchaRequired) {
        setCaptchaConfig(captchaRequired)
        setCaptchaOpen(true)
      } else {
        setResultError(parseApiError(e))
        setResult(undefined)
        setResultOpen(true)
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
    if (directScan) {
      setSearchParams(searchParamsAssign(searchParams, {}, 's'))
    } else {
      await refetch()
    }
    setResultOpen(false)
  }
  const closeSpecialPrompt = () => {
    if (directScan) {
      setSearchParams(searchParamsAssign(searchParams, {}, 's'))
    }
    setSpecialPrompt(false)
  }
  const [scanError, setScanError] = useState<QrScanError>()
  useEffect(() => {
    if (data && directScan) {
      barcodeRef.current = directScan
      validatePrize()
    }
  }, [data])
  return (
    <Paper sx={{ p: 2, my: 2 }}>
      <Stack alignItems="center">
        <Typography variant="h4" color="#59a4dd">
          清水河畔十八周年
        </Typography>
        {isLoading ? (
          <CircularProgress sx={{ my: 20 }} />
        ) : isError ? (
          <Stack mt={4} mb={2}>
            <Error error={error} />
          </Stack>
        ) : (
          <>
            {!directScan && (
              <>
                {(!!data?.total_water || data?.gifts) && (
                  <PrizeResultList data={data} />
                )}
                <Typography variant="h6" fontWeight="normal" mt={1}>
                  线下获得实体刮刮卡的用户，请在此处扫码抽奖。
                </Typography>
                <Typography variant="body2">
                  （也可使用微信或其他扫码 App 扫描刮刮卡上的二维码）
                </Typography>
              </>
            )}
            <LuckyDrawPlate animate={animate}>
              <Paper sx={{ p: 0, boxShadow: '0 0 16px rgba(0, 0, 0, 0.5)' }}>
                <QrScanner
                  disabled={animate}
                  onError={(err) => setScanError(err)}
                  onDetected={(text) => {
                    const match = text.match(
                      /^https?:\/\/bbs\.uestc\.edu\.cn\/s\/([0-9a-z_-]+)$/i
                    )
                    if (match) {
                      barcodeRef.current = match[1]
                      validatePrize()
                      return true
                    }
                  }}
                />
              </Paper>
            </LuckyDrawPlate>
            {scanError && (
              <Alert severity="error">
                <Typography>{scanError.message}</Typography>
                {scanError.detail && (
                  <Typography variant="body2">{scanError.detail}</Typography>
                )}
              </Alert>
            )}
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
      {resultOpen && (
        <Dialog
          open
          onClose={closeResult}
          PaperProps={{ sx: { animation: `${scaleIn} 1s ease` } }}
        >
          <DialogContent>
            {luckyResult && (
              <PrizeResult data={luckyResult} sx={{ mt: 0, mb: 2 }} />
            )}
            {resultError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                <Typography>{resultError.message}</Typography>
              </Alert>
            )}
            <Stack direction="row" justifyContent="center">
              <Button variant="contained" onClick={closeResult}>
                返回
              </Button>
            </Stack>
          </DialogContent>
        </Dialog>
      )}
      {specialPrompt && (
        <Dialog
          open
          onClose={closeSpecialPrompt}
          PaperProps={{ sx: { animation: `${scaleIn} 1s ease` } }}
        >
          <DialogContent>
            <ResultBox sx={{ mt: 0, mb: 2 }}>
              <Typography my={2}>刮刮卡样例扫描成功！</Typography>
              <Typography>11 月 15 日清水河畔周年庆期待您的参与！</Typography>
            </ResultBox>
            <Stack direction="row" justifyContent="center">
              <Button variant="contained" onClick={closeSpecialPrompt}>
                返回
              </Button>
            </Stack>
          </DialogContent>
        </Dialog>
      )}
    </Paper>
  )
}

const ResultBox = ({
  children,
  sx,
}: {
  children?: React.ReactNode
  sx?: SxProps
}) => (
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
    {children}
  </Stack>
)

const PrizeResult = ({ data, sx }: { data: LuckyDrawResult; sx?: SxProps }) => (
  <ResultBox sx={sx}>
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
          <>请在活动现场领取奖品。</>
        ) : data.claim_text == '2' ? (
          <>
            请关注站内提醒与
            <Link to={pages.forum(46)}>站务综合</Link>
            公告，我们将尽快公布领奖方式。
          </>
        ) : (
          data.claim_text
        )}
      </Typography>
    )}
    <Typography>感谢您的参与！清水河畔更多精彩等你探索！</Typography>
  </ResultBox>
)

const PrizeResultList = ({ data }: { data: LuckyDrawStatus }) => (
  <ResultBox>
    {!!data.total_water && (
      <Typography
        variant="h6"
        my={2}
        sx={(theme) => ({
          color: theme.palette.mode == 'dark' ? '#f9d05f' : '#f9d05f',
        })}
      >
        您已获得论坛积分奖励 {data.total_water} 水滴！
      </Typography>
    )}
    {data.gifts
      ?.filter((item) => item.gift)
      .map((item, index) => (
        <Typography variant="h6" my={2} color="#f2315f" key={index}>
          恭喜您获得{item.gift}！
          {item.claimed ? (
            <>您已领取奖品。</>
          ) : item.claim_text == '1' ? (
            <>请在活动现场领取奖品。</>
          ) : item.claim_text == '2' ? (
            <>
              请关注站内提醒与
              <Link to={pages.forum(46)}>站务综合</Link>
              公告，我们将尽快公布领奖方式。
            </>
          ) : (
            item.claim_text
          )}
        </Typography>
      ))}
    <Typography>
      感谢您的参与！继续参与活动可获得更多刮刮卡，清水河畔更多精彩等你探索！
    </Typography>
  </ResultBox>
)

export default Index
