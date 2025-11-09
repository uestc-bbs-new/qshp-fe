import { useRef, useState } from 'react'

import {
  Alert,
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

import { parseApiError } from '@/apis/error'
import Avatar from '@/components/Avatar'
import Link from '@/components/Link'
import { useAppState } from '@/states'
import { pages } from '@/utils/routes'

import {
  GiftListToVerify,
  GiftToVerify,
  GiftVerifyQuery,
  claimQuery,
  claimUpdate,
} from './api'
import { QrScanError, QrScanner } from './qrcode'

const Verify = () => {
  const [scanError, setScanError] = useState<QrScanError>()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<GiftListToVerify>()
  const [activeQuery, setActiveQuery] = useState<GiftVerifyQuery>()
  const queryGift = async (query: GiftVerifyQuery) => {
    setLoading(true)
    try {
      setData(await claimQuery(query))
      setActiveQuery(query)
    } finally {
      setLoading(false)
    }
  }
  const inputRef = useRef<HTMLInputElement>(null)
  const handleManualQuery = () => {
    const value = inputRef.current?.value
    if (!value) {
      return
    }
    if (value.match(/^[0-9]{1,6}$/)) {
      queryGift({ uid: parseInt(value) })
    } else {
      queryGift({ code2: value })
    }
  }

  return (
    <Stack alignItems="center">
      <Typography variant="h4" color="#59a4dd" mt={2}>
        清水河畔十八周年
      </Typography>
      <Typography variant="h6" mb={2}>
        （奖品核销）
      </Typography>

      <QrScanner
        text="用户/刮刮卡扫码"
        disabled={loading}
        onError={(err) => setScanError(err)}
        onDetected={(text) => {
          let match = text.match(
            /^https?:\/\/bbs\.uestc\.edu\.cn\/s\/([0-9a-z_-]+)$/i
          )
          if (match) {
            const code = match[1]
            queryGift({ code })
            return true
          }
          match = text.match(
            /^https?:\/\/bbs\.uestc\.edu\.cn\/(?:user\/|\?|home\.php\?mod=space&uid=)([0-9]+)$/
          )
          if (match) {
            const uid = parseInt(match[1])
            if (uid) {
              queryGift({ uid })
              return true
            }
          }
        }}
      />
      {scanError && (
        <Alert severity="error" sx={{ mt: 1 }}>
          <Typography>{scanError.message}</Typography>
          {scanError.detail && (
            <Typography variant="body2">{scanError.detail}</Typography>
          )}
        </Alert>
      )}
      <Stack direction="row" alignItems="center" mt={2} mb={1}>
        <TextField label="UID/编码" size="small" inputRef={inputRef} />
        <Button
          onClick={handleManualQuery}
          disabled={loading}
          sx={{ ml: 1 }}
          variant="outlined"
        >
          查询
        </Button>
      </Stack>
      <Stack my={2} width="100%" maxWidth="600px" px={2}>
        {loading && (
          <Stack alignItems="center">
            <CircularProgress />
          </Stack>
        )}
        {data && !data.gifts?.length && (
          <Typography>
            {activeQuery?.uid
              ? `UID ${activeQuery.uid} `
              : activeQuery?.code2
                ? `编码 ${activeQuery.code2} `
                : ''}
            未查询到奖品信息
          </Typography>
        )}
        {!!data?.gifts?.length && (
          <>
            {data.gifts.map((item) => (
              <Stack
                direction="row"
                justifyContent="spaceBetween"
                alignItems="center"
                key={item.code}
                py={1}
                borderBottom="1px solid #d8d8d8"
              >
                <Stack flexGrow={1} flexShrink={1}>
                  <Typography variant="h6">{item.gift}</Typography>
                  <Typography variant="body2">{item.code2}</Typography>
                </Stack>
                {item.claimed ? (
                  <Button disabled>已领取</Button>
                ) : (
                  <ClaimButton item={item} />
                )}
              </Stack>
            ))}
            <Stack alignItems="center" mt={2}>
              <Avatar uid={data.gifts[0].uid} />
              <Typography variant="h6">{data.gifts[0].username}</Typography>
              <Typography>UID: {data.gifts[0].uid}</Typography>
            </Stack>
          </>
        )}
      </Stack>
      <Button
        component={Link}
        to={pages.xAnniversary()}
        variant="contained"
        color="info"
      >
        返回
      </Button>
    </Stack>
  )
}

const ClaimButton = ({ item }: { item: GiftToVerify }) => {
  const { dispatch } = useAppState()
  const [pending, setPending] = useState(false)
  const [justClaimed, setJustClaimed] = useState(false)

  const handleClaim = async () => {
    setPending(true)
    try {
      await claimUpdate(item.code, justClaimed ? 'cancel' : 'claim')
      setJustClaimed(!justClaimed)
    } catch (e) {
      const err = parseApiError(e)
      dispatch({
        type: 'open snackbar',
        payload: {
          message: err.message,
          severity: err.severity,
        },
      })
    } finally {
      setPending(false)
    }
  }

  return (
    <Button
      variant={justClaimed ? 'outlined' : 'contained'}
      color={justClaimed ? 'warning' : 'success'}
      disabled={pending}
      onClick={handleClaim}
    >
      {justClaimed ? '撤销领取' : '确认领取'}
    </Button>
  )
}
export default Verify
