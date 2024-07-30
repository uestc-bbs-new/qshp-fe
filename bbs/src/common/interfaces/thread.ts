import { ExtCreditMap } from './base'

export type ThreadType = {
  type_id: number
  name: string
  moderators_only?: boolean
  virtual?: boolean
}

export type ThreadTypeMap = { [type_id: number]: ThreadType }

export type PostThreadResult = {
  thread_id: number
  ext_credits_update?: ExtCreditMap
}

export type PostReplyResult = {
  post_id: number
  ext_credits_update?: ExtCreditMap
}

export const kThreadDisplayOrderDeleted = -1
export const kThreadDisplayOrderInReview = -2
export const kThreadDisplayOrderRejected = -3
export const kThreadDisplayOrderDraft = -4

export const kPostInvisibleThreadDeleted = -1
export const kPostInvisibleInReview = -2
export const kPostInvisibleDraft = -3
export const kPostInvisibleReplyDeleted = -5
