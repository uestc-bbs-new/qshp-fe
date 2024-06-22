import HCaptcha from '@hcaptcha/react-hcaptcha'

import {
  Component,
  Suspense,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react'
import React from 'react'
import ReCaptcha from 'react-google-recaptcha'

import { CircularProgress, Stack } from '@mui/material'

import { useAppState } from '@/states'

export type CaptchaConfiguration = {
  name: string
  site: string
}

export const LazyHCaptcha = React.lazy(() => import('@hcaptcha/react-hcaptcha'))

export default forwardRef(function Captcha(
  {
    captcha,
    onVerified,
  }: {
    captcha: CaptchaConfiguration
    onVerified: (value: string) => void
  },
  ref
) {
  const { state } = useAppState()
  const hCaptchaRef = useRef<HCaptcha>(null)
  const reCaptchaRef = useRef<ReCaptcha>(null)
  useImperativeHandle(
    ref,
    () => ({
      reset() {
        hCaptchaRef.current?.resetCaptcha()
        reCaptchaRef.current?.reset()
      },
    }),
    [hCaptchaRef, reCaptchaRef]
  )
  if (captcha.name == 'hcaptcha') {
    return (
      <Suspense
        fallback={
          <Stack justifyContent="center">
            <CircularProgress />
          </Stack>
        }
      >
        <LazyHCaptcha
          sitekey={captcha.site}
          onVerify={(token: string) => onVerified(token)}
          ref={hCaptchaRef}
        />
      </Suspense>
    )
  }
  if (captcha.name == 'recaptcha') {
    return (
      <ReCaptcha
        sitekey={captcha.site}
        theme={state.theme}
        onChange={(token) => token && onVerified(token)}
        ref={reCaptchaRef}
      />
    )
  }
  return <></>
})

export declare class Captcha extends Component {
  reset(): void
}
