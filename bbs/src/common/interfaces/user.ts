import { FieldOptional } from '@/utils/types'

import { ExtCreditMap, User } from './base'
import { Collection } from './collection'
import {
  GenericList,
  ThreadBasics,
  ThreadInList,
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

export type CommonUserSummary = User &
  UserGroupDetails & {
    /** 积分 */
    credits: number
    /** 水滴、威望 */
    ext_credits: ExtCreditMap
    /** 好友数 */
    friends: number
    /** 主题数 */
    threads: number
    /** 回复数 */
    replies: number
    /** 精华数 */
    digests: number
  }

/** 用户概况 */
export type UserSummary = CommonUserSummary & {
  /** 用户是否已删除 */
  deleted?: boolean
  /** 勋章 */
  medals?: number[]
  /** 用户空间访问人次 */
  views: number
  favorites_unavailable?: boolean
  /** 留言已隐藏 */
  comments_hidden?: boolean
  /** 好友列表已隐藏 */
  friends_hidden?: boolean
  /** 好友状态：'requested' 已发送请求，等待通过；'friend' 好友；undefined 非好友 */
  friend_status?: 'requested' | 'friend'
  /** 好友备注 */
  friend_note?: string
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
export type UserComment = CommonUserSummary & {
  comment_id: number
  author_id: number
  author: string
  dateline: number
  message: string
  friend_note?: string
}

export type UserCommentsList = UserCommonList<UserComment> & {
  /** 用户隐藏了留言 */
  hidden?: boolean
}

export type UserFriend = CommonUserSummary & {
  /** 备注，只有本人才可见 */
  note?: string
  /** 最新发表的主题帖，只有访问自己的个人空间时才返回 */
  latest_thread?: {
    tid: number
    subject: string
    dateline: number
  }
}

export type UserFriendsList = UserCommonList<UserFriend> & {
  /** 用户隐藏了好友列表 */
  hidden?: boolean
}

export type UserProfile = {
  email?: string
  register_ip?: string
  last_ip?: string
  register_time: number
  online_time: number
  last_visit: number
  last_activity: number
  last_post: number

  introduction?: string
  custom_title: string
  signature: string
  signature_format: string
}

export type FavoriteTargetType = 'tid' | 'fid' | 'gid' | 'albumid' | 'blogid'

export type UserFavorite = {
  favorite_id: number
  target_id: number
  target_type: FavoriteTargetType
  space_uid?: number
  title: string
  description?: string
  dateline: number
  thread_details?: ThreadInList
}

export type UserFavoritesList = FieldOptional<
  UserCommonList<UserFavorite>,
  'rows'
> & {
  collections?: Collection[]
}
