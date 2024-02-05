import {
  ExtCreditMap,
  GenericList,
  ThreadBasics,
  UserGroupDetails,
} from './response'

/** 用户发表过的回复 */
export type UserReply = Omit<ThreadBasics, 'summary'> & {
  post_id: number
  last_poster: string
  /** 版块名称 */
  forum_name?: string
  /** 回复内容摘要 */
  summary: string
}

/** 用户发表过的点评 */
export type UserPostComment = UserReply

/** 用户概况 */
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
  medals?: number[]
  /** 好友数 */
  friends: number
  /** 主题数 */
  threads: number
  /** 回复数 */
  replies: number
  /** 精华数 */
  digests: number
  /** 留言已隐藏 */
  comments_hidden?: boolean
  /** 好友列表已隐藏 */
  friends_hidden?: boolean
  /** 好友状态：'requested' 已发送请求，等待通过；'friend' 好友；undefined 非好友 */
  friend_status?: 'requested' | 'friend'
  /** 是否在黑名单中 */
  blocked?: boolean
}

/** 用户空间的最近访客 */
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

/** 用户空间中的留言 */
export type UserComment = {
  comment_id: number
  author_id: number
  author: string
  dateline: number
  message: string
}

export type UserCommentsList = UserCommonList<UserComment> & {
  /** 用户隐藏了留言 */
  hidden?: boolean
}
