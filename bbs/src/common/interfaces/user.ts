import {
  ExtCreditMap,
  GenericList,
  ThreadBasics,
  UserGroupDetails,
} from './response'

export type UserReply = Omit<ThreadBasics, 'summary'> & {
  post_id: number
  last_poster: string
  /** 版块名称 */
  forum_name?: string
  /** 回复内容摘要 */
  summary: string
}

export type UserPostComment = UserReply

export type UserSummary = UserGroupDetails & {
  uid: number
  username: string
  /** 用户是否已删除 */
  deleted?: boolean
  /** 积分 */
  credits: number
  /** 水滴、威望 */
  ext_credits: ExtCreditMap
  /** 勋章 */
  medals: number[]
  /** 好友数 */
  friends: number
  /** 主题数 */
  threads: number
  /** 回复数 */
  replies: number
  /** 精华数 */
  digests: number
  /** 好友状态：'requested' 已发送请求，等待通过；'friend' 好友；undefined 非好友 */
  friend_status?: 'requested' | 'friend'
  /** 是否在黑名单中 */
  blocked: boolean
}

export type Visitor = {
  uid: number
  username: string
  /** 来访时间 */
  dateline: number
}

export type CommonUserQueryRpsoense = {
  /** 用户概况（用户空间顶部显示的内容） */
  user_summary?: UserSummary
  /** 最近访客（用户空间右侧显示的内容） */
  recent_visitors?: Visitor[]
}

export type UserCommonList<T> = CommonUserQueryRpsoense & GenericList<T>
