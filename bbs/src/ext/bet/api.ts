import request, { commonUrl } from '@/apis/request'
import { GenericList } from '@/common/interfaces/response'

const baseUrl = `${commonUrl}/x/bet`

export type BetStatus =
  | 'deleted'
  | 'canceled'
  | 'draft'
  | 'settled'
  | 'not_started'
  | 'ended'
  | 'active'

export const translateBetStatus = (status: BetStatus) => {
  switch (status) {
    case 'deleted':
      return '已删除'
    case 'canceled':
      return '已取消'
    case 'draft':
      return '草稿'
    case 'settled':
      return '已结算'
    case 'not_started':
      return '尚未开始'
    case 'ended':
      return '已封盘'
    case 'active':
      return '竞猜中'
  }
}

export type BetOption = {
  id: number
  text: string
  rate: number
}

export type BetCompetition = {
  id: number
  creator_uid: number
  category_id?: number
  title: string
  description: string
  tax_rate?: number
  start_time?: number
  end_time?: number
  result_option?: number
  status: BetStatus
  options?: BetOption[]

  bet_option?: number
  bet_amount?: number
  can_admin?: boolean
}

export type BetList = GenericList<BetCompetition> & {
  can_create?: boolean
  can_manage_settings?: boolean
}

export const getList = async (page: number) =>
  await request.get<BetList>(`${baseUrl}/list`, {
    params: { page },
  })

export type BetDetails = {
  id?: number
  category_id?: number
  title?: string
  description?: string
  options?: Pick<BetOption, 'text' | 'rate'>[]
  tax_rate?: number
  start_time?: number
  end_time?: number
  min_bet_credits?: number
  max_bet_credits?: number
  draft?: boolean
  cancel?: boolean
}

export const createBet = async (details: BetDetails) =>
  await request.post(`${baseUrl}/bet/new`, details)
export const updateBet = async (id: number, details: BetDetails) =>
  await request.patch(`${baseUrl}/bet/${id}`, details)
