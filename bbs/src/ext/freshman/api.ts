import { CaptchaResult, getCaptchaHeaders } from '@/apis/captcha'
import request, { commonUrl } from '@/apis/request'

const baseUrl = `${commonUrl}/x/freshman`
const adminBase = `${baseUrl}/admin`

export type LuckyDrawResult = {
  water?: number
  gift?: string
  claim_text?: string
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

export type LuckyDrawPrize = {
  id: number
  name: string
  total: number
  remaining: number
  probability1: number
  probability2: number
  probability3: number
  claim_text?: string
}
export type LuckyDrawUser = {
  code: string
  uid: number
  username: string
  water?: number
  prize_name?: string
  validation_time: number
}
export type LuckyDrawPrizes = {
  prizes?: LuckyDrawPrize[]
  users?: LuckyDrawUser[]
  total_attempts: number
  total_prize_users: number
  freshman_prize_users: number
  undergraduate_freshman_prize_users: number
  new_register_prize_users: number
  total_codes: number
  claimed_codes: number
  claimed_codes_with_gift: number
  total_gifts: number
  remaining_gifts: number
}
export const getPrizes = () =>
  request.get<LuckyDrawPrizes>(`${adminBase}/prizes`)
export const addPrize = (item: Omit<LuckyDrawPrize, 'id'>) =>
  request.put(`${adminBase}/prize`, item)
export const deletePrize = (id: number) =>
  request.delete(`${adminBase}/prize/${id}`)
export const updatePrize = (
  id: number,
  item: Omit<LuckyDrawPrize, 'id' | 'total' | 'remaining'> & {
    total_delta?: number
  }
) => request.patch(`${adminBase}/prize/${id}`, item)
