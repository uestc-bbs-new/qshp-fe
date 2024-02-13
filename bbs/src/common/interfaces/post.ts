import { User } from './base'

export interface PostPosition {
  thread_id: number
  position: number
}

export type AtListMatch = User & {
  status?: 'friend' | 'blocked' | 'throttled' | 'not_friend'
}

export type AtListResponse = {
  exact_match?: AtListMatch
  rows?: AtListMatch[]
}
