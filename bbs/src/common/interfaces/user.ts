import { ThreadBasics } from './response'

export type UserReply = Omit<ThreadBasics, 'summary'> & {
  post_id: number
  last_poster: string
  /** 版块名称 */
  forum_name?: string
  /** 回复内容摘要 */
  summary: string
}
