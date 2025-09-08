export type CaptchaConfiguration = {
  name: string
  site: string
}

export type CaptchaResult = {
  captcha_value?: string
  captcha_type?: string
}

export const getCaptchaHeaders = (params?: CaptchaResult) => ({
  ...(params?.captcha_value && {
    'X-UESTC-BBS-Captcha': params.captcha_value,
  }),
  ...(params?.captcha_type && {
    'X-UESTC-BBS-Captcha-Type': params.captcha_type,
  }),
})
