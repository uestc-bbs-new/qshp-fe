import { keyframes } from '@emotion/react'
import { Html5Qrcode } from 'html5-qrcode'

import { useEffect, useRef, useState } from 'react'

import { Close, QrCode2 } from '@mui/icons-material'
import {
  Button,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'

const lateAppear = keyframes`0% { opacity: 0 }
70% { opacity: 0 }
100% { opacity: 1 }`

export type QrScanError = {
  message: string
  detail?: string
}

export const QrScanner = ({
  disabled,
  onDetected,
  onError,
}: {
  disabled?: boolean
  onDetected?: (text: string) => boolean | undefined
  onError?: (error: QrScanError) => void
}) => {
  const kScanContainerId = 'qrcode-scanner'
  const scanRef = useRef<HTMLDivElement>(null)
  const [scanOpen, setScanOpen] = useState(false)
  const qrcodeRef = useRef<Html5Qrcode | null>(null)
  const [loading, setLoading] = useState(false)
  const startScan = async () => {
    if (loading || disabled) {
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
      onError && onError({ message: '网络不畅，请稍后再试。' })
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    if (scanOpen) {
      ;(async () => {
        try {
          await qrcodeRef.current?.start(
            { facingMode: { exact: 'environment' } },
            {
              fps: 10,
              qrbox: Math.min(window.innerWidth, window.innerHeight) * 0.7,
            },
            (text) => {
              onDetected && onDetected(text) && cancelScan()
            },
            () => {}
          )
        } catch (e) {
          onError && onError({ message: '', detail: e?.toString() })
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
    <>
      <Stack alignItems="center">
        <Button variant="outlined" onClick={startScan}>
          <Stack
            direction="column"
            alignItems="center"
            position="relative"
            sx={{ transition: 'opacity 0.5s ease' }}
            style={loading || disabled ? { opacity: 0.3 } : undefined}
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
      </Stack>
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
          css={{ width: '100%', top: '50%', transform: 'translateY(-50%)' }}
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
    </>
  )
}
