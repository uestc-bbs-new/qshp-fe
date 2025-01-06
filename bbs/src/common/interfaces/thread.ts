import { ExtCreditsUpdateResponse } from './base'

export type ThreadType = {
  type_id: number
  name: string
  moderators_only?: boolean
  virtual?: boolean
}

export type ThreadTypeMap = { [type_id: number]: ThreadType }

export type PostThreadResult = {
  thread_id: number
  pending_review?: boolean
} & ExtCreditsUpdateResponse

export type PostReplyResult = {
  post_id: number
  wait_timeout?: number
} & ExtCreditsUpdateResponse

export type PublicThreadFavoriteFolder = {
  collection_id: number
  owner_uid: number
  username: string
  name: string
  description?: string
  is_owner?: boolean
  is_favorite?: boolean
}

export type ThreadFavoriteStatus = {
  is_personal_favorite?: boolean
  public_favorites?: PublicThreadFavoriteFolder[]
}

export const kThreadDisplayOrderDeleted = -1
export const kThreadDisplayOrderInReview = -2
export const kThreadDisplayOrderRejected = -3
export const kThreadDisplayOrderDraft = -4

export const kPostInvisibleThreadDeleted = -1
export const kPostInvisibleInReview = -2
export const kPostInvisibleDraft = -3
export const kPostInvisibleReplyDeleted = -5
