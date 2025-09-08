import { isVpnProxy } from '@/utils/siteRoot'

export type CaptchaConfiguration = {
  name: string
  site: string
}

export type CaptchaResult = {
  captcha_value?: string
  captcha_type?: string
}

export const kErrCaptchaRequired = 1

const kCaptchaSupportedInVpn = {
  name: 'hcaptcha',
  site: '52100d97-0777-4497-8852-e380d5b3430b',
}

export const getCaptchaHeaders = (params?: CaptchaResult) => ({
  ...(params?.captcha_value && {
    'X-UESTC-BBS-Captcha': params.captcha_value,
  }),
  ...(params?.captcha_type && {
    'X-UESTC-BBS-Captcha-Type': params.captcha_type,
  }),
})

export const parseCaptchaError = (
  e: unknown
): CaptchaConfiguration | undefined => {
  const err = e as
    | {
        type: string
        code: number
        message: string
        details: { data: CaptchaConfiguration[] }
      }
    | undefined
  if (
    err?.type == 'api' &&
    err.code == kErrCaptchaRequired &&
    err.details?.data &&
    err.details.data[0]
  ) {
    return isVpnProxy ? kCaptchaSupportedInVpn : err.details.data[0]
  }
}
