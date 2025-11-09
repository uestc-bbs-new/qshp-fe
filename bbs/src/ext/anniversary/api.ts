import { CaptchaResult, getCaptchaHeaders } from '@/apis/captcha'
import request, { commonUrl } from '@/apis/request'
import { User } from '@/common/interfaces/base'

const baseUrl = `${commonUrl}/x/anniversary`
const adminBase = `${baseUrl}/admin`

export const kSpecialCode = 'QingShuiHePan_18'
export const kSpecialCode2 = '2007202518'

export type LuckyDrawGift = {
  water?: number
  gift?: string
  claim_text?: string
  claimed?: boolean
  code2: number
}

export type LuckyDrawResult = {
  water?: number
  gift?: string
  claim_text?: string
}

export type LuckyDrawStatus = {
  total_water?: number
  gifts?: LuckyDrawGift[]
  allow_code2?: boolean
  is_verifier?: boolean
}

export const getStatus = () => request.get<LuckyDrawStatus>(`${baseUrl}/status`)
export const verifyCode = (
  code: string,
  method2?: boolean,
  captcha?: CaptchaResult
) =>
  request.post<LuckyDrawResult>(
    `${baseUrl}/verify/${encodeURIComponent(code)}${method2 ? '/1' : ''}`,
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
  code2: string
  uid: number
  username: string
  water?: number
  prize_name?: string
  validation_time: number
  claimed?: boolean
}
export type LuckyDrawConfig = {
  allow_code2?: boolean
  verifier_uids?: number[]
  verifier_users?: User[]
  water_min1?: number
  water_min2?: number
  water_min3?: number
  water_max1?: number
  water_max2?: number
  water_max3?: number
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

  config: LuckyDrawConfig
}
export enum PrizeSortMethod {
  ByPrize = 0,
  ByWaterDesc = 1,
  ByWaterAsc = 2,
  ByDatelineDesc = 3,
  ByDatelineAsc = 4,
  NotClaimedFirst = 5,
  ClaimedFirst = 6,
  ByUser = 7,
}
export const getPrizes = ({ sort }: { sort?: PrizeSortMethod }) =>
  request.get<LuckyDrawPrizes>(
    `${adminBase}/prizes`,
    sort ? { params: { sort } } : undefined
  )
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
export const updateConfig = (config: LuckyDrawConfig) =>
  request.put(`${adminBase}/config`, config)

export type GiftToVerify = {
  uid: number
  username: string
  code: string
  code2: string
  gift: string
  claimed?: boolean
}
export type GiftListToVerify = {
  gifts?: GiftToVerify[]
}
export type GiftVerifyQuery = {
  uid?: number
  code?: string
  code2?: string
}
export const claimQuery = (query: GiftVerifyQuery) =>
  request.get<GiftListToVerify>(`${adminBase}/claim`, { params: query })
export const claimUpdate = (code: string, action?: 'cancel' | 'claim') =>
  request.post<GiftListToVerify>(`${adminBase}/claim`, undefined, {
    params: { code, action: action == 'cancel' ? 2 : 1 },
  })
