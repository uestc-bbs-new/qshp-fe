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
  overall?: number
}

export type HotlistConfig = {
  weights: HotlistWeights
  fid_overrides?: Array<
    {
      fids: number[]
    } & HotlistWeights
  >
  fid_top_limits?: { [fid in number]?: number }
  uid_overrides?: { [uid in number]?: number }
  tid_overrides?: { [tid in number]?: number }
  excluded_fids?: number[]
}

export const getHotlistConfig = () =>
  request.get<HotlistConfig>(kHotlistConfigUrl)
export const setHotlistConfig = (config: HotlistConfig) =>
  request.post(kHotlistConfigUrl, config)
