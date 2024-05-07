import { ExtCreditMap } from './base'

export type ThreadType = {
  type_id: number
  name: string
  moderators_only: boolean
}

export type ThreadTypeMap = { [type_id: number]: ThreadType }

export type PostReplyResult = {
  post_id: number
  ext_credits_update?: ExtCreditMap
}
