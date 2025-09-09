import { CaptchaResult, getCaptchaHeaders } from '@/apis/captcha'
import request, { commonUrl } from '@/apis/request'

const baseUrl = `${commonUrl}/x/freshman`

export type LuckyDrawResult = {
  water?: number
  gift?: string
}
export type LuckyDrawStatus = {
  verified: boolean
} & LuckyDrawResult

export const getStatus = () => request.get<LuckyDrawStatus>(`${baseUrl}/status`)
export const verifyCode = (code: string, captcha?: CaptchaResult) =>
  request.post<LuckyDrawResult>(
    `${baseUrl}/verify/${encodeURIComponent(code)}`,
    null,
    captcha
      ? {
          headers: getCaptchaHeaders(captcha),
        }
      : undefined
  )
