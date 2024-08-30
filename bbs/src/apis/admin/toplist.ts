import request from '@/apis/request'

import { baseUrl } from './common'

const kHotlistBase = `${baseUrl}hotlist`
const kHotlistConfigUrl = `${kHotlistBase}/config`

export type HotlistWeights = {
  likes?: number
  dislikes?: number
  replies?: number
  comments?: number
  favorites?: number
  reply_authors?: number
  comment_authors?: number
  positive_rates?: number
  negative_rates?: number
  positive_scores?: number
  negative_scores?: number
  thread_post_age?: number
  last_reply_age?: number
  overall?: number
}

export type HotlistOverride = {
  rank?: number
  score_coefficient?: number
  score_delta?: number
}

export type HotlistConfig = {
  weights: HotlistWeights
  fid_overrides?: Array<
    {
      fids: number[]
    } & HotlistWeights
  >
  fid_top_limits?: { [fid in number]?: number }
  uid_overrides2?: { [uid in number]?: number }
  tid_overrides2?: { [tid in number]?: number }
  excluded_fids?: number[]

  uid_overrides?: { [uid in number]?: number } // DEPRECATED
  tid_overrides?: { [tid in number]?: number } // DEPRECATED
}

export type HotlistCandidate = {
  thread_id: number
  forum_id: number
  subject: string
  author: string
  author_id: number
  recommend_add: number
  recommend_sub: number
  replies: number
  comments: number
  dateline: number
  last_post: number

  reply_authors: number
  comment_authors: number
  rates: number
  positive_rates: number
  negative_rates: number
  positive_scores: number
  negative_scores: number
  score: number
  raw_score: number
  descend_by_override?: boolean
  descend_by_excess?: boolean
}

export const getHotlistConfig = () =>
  request.get<HotlistConfig>(kHotlistConfigUrl)
export const setHotlistConfig = (config: HotlistConfig) =>
  request.post(kHotlistConfigUrl, config)
export const fetchHotlist = (options?: {
  anchor_timestamp?: number
  config?: HotlistConfig
}) => request.post<HotlistCandidate[]>(`${kHotlistBase}/fetch`, options)
