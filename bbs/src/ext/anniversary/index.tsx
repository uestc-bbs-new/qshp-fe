import { keyframes } from '@emotion/react'
import { useQuery } from '@tanstack/react-query'

import React, { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { CardGiftcard, Close } from '@mui/icons-material'
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
import { useAppState, useSignInChange } from '@/states'
import QRCode from '@/third_party/qrcodejs'
import { sleep } from '@/utils/misc'
import { pages } from '@/utils/routes'
import { siteDomain } from '@/utils/siteRoot'
import { searchParamsAssign } from '@/utils/tools'

import {
  LuckyDrawResult,
  LuckyDrawStatus,
  getStatus,
  kSpecialCode,
  kSpecialCode2,
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
  const currentMethod = useRef(false)
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
      const code = currentMethod.current
        ? code2Ref.current?.value
        : barcodeRef.current
      if (code == (currentMethod.current ? kSpecialCode2 : kSpecialCode)) {
        await sleep(1000)
        setResultError(undefined)
        setSpecialPrompt(true)
        return
      }
      if (currentMethod.current && (!code || !code.match(/^[0-9a-z]{10}$/i))) {
        setResultError({
          message: '请准确输入刮刮卡上的兑换码。',
          severity: 'error',
        })
        setResult(undefined)
        setResultOpen(true)
        return
      }
      if (!code) {
        return
      }
      const result = await verifyCode(code, currentMethod.current, captcha)
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
  const validateByBarcode = () => {
    currentMethod.current = false
    validatePrize()
  }
  const validateByCode2 = () => {
    currentMethod.current = true
    validatePrize()
  }
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
      validateByBarcode()
    }
  }, [data])
  useSignInChange(refetch)
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
                {!!data?.total_water || data?.gifts ? (
                  <PrizeResultList data={data} />
                ) : (
                  <PromptText />
                )}
                <Typography variant="h6" fontWeight="normal" mt={1}>
                  获得实体刮刮卡后请在此处扫码抽奖。
                </Typography>
                <Typography variant="body2">
                  （也可使用微信或其他扫码 App 扫描刮刮卡上的二维码）
                </Typography>
              </>
            )}
            <LuckyDrawPlate animate={animate}>
              <Paper sx={{ p: 0, boxShadow: '0 0 16px rgba(0, 0, 0, 0.5)' }}>
                <QrScanner
                  text="刮刮卡扫码"
                  disabled={animate}
                  onError={(err) => setScanError(err)}
                  onDetected={(text) => {
                    const match = text.match(
                      /^https?:\/\/bbs\.uestc\.edu\.cn\/s\/([0-9a-z_-]+)$/i
                    )
                    if (match) {
                      barcodeRef.current = match[1]
                      validateByBarcode()
                      return true
                    }
                  }}
                />
              </Paper>
            </LuckyDrawPlate>
            {scanError && (
              <Alert severity="error">
                <Typography>
                  {scanError.detail?.includes('NotAllowedError')
                    ? '请授予相机权限以便进行扫码。'
                    : scanError.detail?.includes('Error getting userMedia')
                      ? '调用摄像头失败，请在手机浏览器中访问。'
                      : ''}
                  {scanError.message}
                </Typography>
                {scanError.detail && (
                  <Typography variant="caption">
                    ({scanError.detail})
                  </Typography>
                )}
              </Alert>
            )}
            {data?.allow_code2 && (
              <>
                <Typography mb={1}>您也可以输入兑换码进行抽奖：</Typography>
                <Stack direction="row" alignItems="center">
                  <TextField
                    label="填写兑换码"
                    size="small"
                    sx={{ width: '10em', mr: 1 }}
                    inputProps={{ sx: { textAlign: 'center' } }}
                    disabled={animate}
                    inputRef={code2Ref}
                  />
                  <Button
                    variant="contained"
                    color="warning"
                    onClick={validateByCode2}
                    disabled={animate}
                  >
                    立即抽奖
                  </Button>
                </Stack>
              </>
            )}
          </>
        )}
        {(!!data?.total_water || data?.gifts) && <PromptText />}
        {data?.is_verifier && (
          <Button
            component={Link}
            to={pages.xAnniversaryVerify}
            variant="contained"
            color="success"
            sx={{ mb: 2, fontSize: '1.25em' }}
          >
            奖品核销
          </Button>
        )}
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
        mt={2}
        mb={1}
        sx={(theme) => ({
          color: theme.palette.mode == 'dark' ? '#f9d05f' : '#f9d05f',
        })}
      >
        您已获得论坛积分奖励 {data.water} 水滴！
      </Typography>
    )}
    {data.gift && (
      <>
        <Typography variant="h6" my={1} color="#f2315f">
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
        {data.claim_text == '1' && <UserBarcode />}
      </>
    )}
    <Typography>感谢您的参与！清水河畔更多精彩等你探索！</Typography>
  </ResultBox>
)

const PrizeResultList = ({ data }: { data: LuckyDrawStatus }) => {
  const giftList = data.gifts?.filter((item) => item.gift)
  return (
    <ResultBox>
      {!!data.total_water && (
        <Typography
          variant="h6"
          my={1}
          sx={(theme) => ({
            color: theme.palette.mode == 'dark' ? '#f9d05f' : '#f9d05f',
          })}
        >
          您已获得论坛积分奖励 {data.total_water} 水滴！
        </Typography>
      )}
      {!!giftList?.length && (
        <>
          <Typography variant="h6" color="#f2315f" my={1}>
            恭喜您获得以下奖品：
          </Typography>
          <div
            css={{
              display: 'grid',
              grid: 'auto-flow / 1fr max-content',
              alignItems: 'center',
              gap: '1em',
            }}
          >
            {giftList.map((item, index) => (
              <React.Fragment key={index}>
                <div>
                  <Typography variant="h6" color="#59a4dd">
                    <CardGiftcard
                      sx={{
                        display: 'inline-block',
                        verticalAlign: 'middle',
                        mr: 1,
                        fontSize: '0.9em',
                      }}
                    />
                    <span css={{ verticalAlign: 'middle' }}>{item.gift}</span>
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#999' }}>
                    {item.code2}
                  </Typography>
                </div>
                <div css={{ textAlign: 'center' }}>
                  {item.claimed ? (
                    <Typography sx={{ color: '#5caf5c' }}>已领取</Typography>
                  ) : item.claim_text == '1' ? (
                    <Typography sx={{ color: '#db6a13' }}>现场领取</Typography>
                  ) : item.claim_text == '2' ? (
                    <>关注后续公告</>
                  ) : (
                    <>{item.claim_text}</>
                  )}
                </div>
              </React.Fragment>
            ))}
          </div>
          {giftList?.some(
            (item) => !item.claimed && item.claim_text != '2'
          ) && (
            <>
              <Typography my={1}>
                请在活动现场出示个人二维码或刮刮卡领奖
              </Typography>
              <UserBarcode />
            </>
          )}
        </>
      )}
      <Typography>
        感谢您的参与！继续参与活动可获得更多刮刮卡，清水河畔更多精彩等你探索！
      </Typography>
    </ResultBox>
  )
}

const UserBarcode = () => {
  const barcode = useRef<HTMLCanvasElement>(null)
  const qrcode = useRef<QRCode | null>(null)
  const { state } = useAppState()
  const [src, setSrc] = useState('')
  const kSize = 160
  useEffect(() => {
    if (barcode.current && !qrcode.current) {
      qrcode.current = new QRCode(barcode.current, {
        width: kSize,
        height: kSize,
      })
      setSrc(
        qrcode.current.makeCode(
          `https://${siteDomain}${pages.user({ uid: state.user.uid })}`
        )
      )
    }
  }, [barcode.current, state.user.uid])
  return (
    <Stack
      alignItems="center"
      sx={(theme) => ({
        backgroundColor: theme.palette.mode == 'dark' ? '#888' : '#eee',
        p: 2,
        borderRadius: 2,
        mb: 1,
      })}
    >
      <Typography variant="h5">{state.user.username}</Typography>
      <Typography variant="h5" mb={1}>
        UID: {state.user.uid}
      </Typography>
      <canvas ref={barcode} style={{ display: 'none' }} />
      {src && (
        <div css={{ backgroundColor: 'white', padding: 12 }}>
          <img
            src={src}
            css={{ display: 'block', width: kSize, maxWidth: '100%' }}
          />
        </div>
      )}
    </Stack>
  )
}

const PromptText = () => {
  const now = Date.now()
  const beforeStart = now < 1763172000000 // new Date('2025-11-15 10:00').getTime()
  const afterEnd = now > 1763186400000 // new Date('2025-11-15 14:00').getTime()
  return (
    <>
      {beforeStart && (
        <Typography
          variant="h5"
          my={2}
          textAlign="center"
          color="#ff8080"
          fontWeight="bold"
        >
          11 月 15 日（周六）11:00
          <br />
          让我们共聚清水河校区
          <span style={{ display: 'inline-block' }}>学生活动中心门口，</span>
          <br />
          庆祝河畔十八周年生日！
        </Typography>
      )}
      {afterEnd && (
        <Typography variant="h6" my={2} textAlign="center">
          活动已结束，感谢您的参与!
        </Typography>
      )}
      <Typography variant="h6" my={2}>
        活动详细说明请参见
        <Link to={pages.thread(2397048)}>清水河畔十八周年庆！</Link>
      </Typography>
    </>
  )
}

export default Index
