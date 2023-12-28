import { PostExtraDetails } from '@/common/interfaces/response'

export interface PostDetailsByPostIdEx {
  [post_id: number]: PostExtraDetailsEx
}

export interface PostExtraDetailsEx extends PostExtraDetails {
  commentsRefresh?: number
}
