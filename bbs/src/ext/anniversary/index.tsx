import { keyframes } from '@emotion/react'
import { Html5Qrcode } from 'html5-qrcode'

import { useEffect, useRef, useState } from 'react'

import { Close, QrCode2 } from '@mui/icons-material'
import {
  Alert,
  Button,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'

const lateAppear = keyframes`0% { opacity: 0 }
70% { opacity: 0 }
100% { opacity: 1 }`

const Index = () => {
  const kScanContainerId = 'qrcode-scanner'
  const scanRef = useRef<HTMLDivElement>(null)
  const [scanOpen, setScanOpen] = useState(false)
  const qrcodeRef = useRef<Html5Qrcode | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<{
    message: string
    detail?: string
  } | null>(null)
  const startScan = async () => {
    if (loading) {
      return
    }
    setLoading(true)
    try {
      if (!qrcodeRef.current) {
        qrcodeRef.current = new (await import('html5-qrcode')).Html5Qrcode(
          kScanContainerId
        )
      }
      setScanOpen(true)
    } catch (e) {
      setError({ message: '网络不畅，请稍后再试。' })
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    if (scanOpen) {
      ;(async () => {
        try {
          const qrSize = Math.min(window.innerWidth, window.innerHeight) * 0.7
          await qrcodeRef.current?.start(
            { facingMode: { exact: 'environment' } },
            {
              fps: 10,
              qrbox: {
                width: qrSize,
                height: qrSize,
              },
            },
            (text) => {
              const match = text.match(
                /^https?:\/\/bbs\.uestc\.edu\.cn\/s\/([0-9a-z_-]+)$/i
              )
              if (match) {
                alert(match[1])
                cancelScan()
              }
            },
            (msg, err) => {}
          )
        } catch (e) {
          setError({ message: '', detail: e?.toString() })
          cancelScan()
        }
      })()
    }
  }, [scanOpen])
  const cancelScan = () => {
    setScanOpen(false)
    qrcodeRef.current?.stop()
  }
  return (
    <Stack alignItems="center">
      <Button variant="outlined" onClick={startScan}>
        <Stack
          direction="column"
          alignItems="center"
          position="relative"
          sx={{ transition: 'opacity 0.5s ease' }}
          style={loading ? { opacity: 0.3 } : undefined}
        >
          <QrCode2 sx={{ fontSize: 48 }} />
          <Typography variant="h6">刮刮卡扫码</Typography>
        </Stack>
        {loading && (
          <CircularProgress
            size={48}
            sx={{
              position: 'absolute',
              margin: 'auto',
              left: '0',
              right: '0',
              top: '0',
              bottom: '0',
            }}
          />
        )}
      </Button>
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          <Typography>{error.message}</Typography>
          {error.detail && (
            <Typography variant="body2">{error.detail}</Typography>
          )}
        </Alert>
      )}
      <div
        css={{
          width: '100%',
          height: '100%',
          position: 'fixed',
          left: 0,
          top: 0,
          backgroundColor: '#666',
          zIndex: 9999,
          animation: `${lateAppear} 1s linear`,
        }}
        style={{ display: scanOpen ? 'block' : 'none' }}
      >
        <div
          ref={scanRef}
          id={kScanContainerId}
          css={{ width: '100%', height: '100%' }}
        ></div>
        <IconButton
          onClick={cancelScan}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            backgroundColor: 'white',
            '&:hover': {
              backgroundColor: '#ddd',
            },
          }}
        >
          <Close htmlColor="#666" />
        </IconButton>
      </div>
    </Stack>
  )
}

export default Index
