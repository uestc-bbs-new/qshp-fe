import { Attachment, AttachmentSummary, ExtCreditMap } from './base'
import { Collection } from './collection'
import { Forum, ForumDetails } from './forum'

export type ThreadBasics = {
  thread_id: number
  forum_id: number
  author: string
  author_id: number
  subject: string
  dateline: number
  last_post: number
  summary?: string
  summary_attachments?: AttachmentSummary[]
  views: number
  replies: number
}

export type ThreadInList = Omit<ThreadBasics, 'author' | 'author_id'> &
  Partial<Pick<ThreadBasics, 'author' | 'author_id'>> &
  Partial<ThreadExtended> & {
    last_poster: string
    forum_name?: string
  }

type ThreadExtended = {
  type_id: number
  sort_id?: number
  last_poster: string
  display_order: number
  highlight_color?: string
  highlight_bgcolor?: string
  highlight_bold?: boolean
  highlight_italic?: boolean
  highlight_underline?: boolean
  digest?: number
  is_rate: number
  special: number
  attachment: number
  is_moderated: boolean
  is_closed: boolean
  has_stick_reply: boolean
  recommends: number
  recommend_add: number
  recommend_sub: number
  heats: number
  status: number
  favorite_times: number
  share_times: number
  cover: number
  max_position: number
  comments: number
  reverse_replies: boolean
  can_reply: boolean
  stamp?: number
  icon?: number
  reply_credit_remaining_amount?: number
}
export type Thread = ThreadBasics &
  ThreadExtended & {
    poll?: ThreadPollDetails
    reply_credit?: ThreadReplyCredit
    collections?: Collection[]
  }

export type ThreadPollDetails = {
  /** 投票选项 */
  options: ThreadPollOption[]
  /** 当前用户选择的投票选项 ID */
  selected_options: number[]
  /** 公开投票参与人 */
  show_voters: boolean
  /** 是否为多选投票 */
  multiple: boolean
  /** 未投票时能否查看投票结果 */
  visible: boolean
  /** 最多选择几项 */
  max_choices: number
  /** 是否为图片投票（目前暂不支持） */
  is_image: boolean
  /** 投票过期时间。获取帖子信息与编辑投票时，该字段的值为过期时间的时间戳；发表投票
   * 时，应当设置为投票有效时长（以秒为单位表示的有效期，最短 1 天，最长一年）。发表
   * 投票时 0 表示不过期；编辑帖子时，传入负值可关闭投票。*/
  expiration: number
  /** 投票参与人数 */
  voter_count: number
}

export type ThreadPollOption = {
  /** 投票选项 ID。发表投票时不设置该属性。编辑投票时按原值传递；需要新增选项时，新
   * 选项不设置该属性。 */
  id: number
  /** 文字 */
  text: string
  /** 票数 */
  votes?: number
  /** 选项的显示顺序。发表投票时不设置该属性。编辑投票时，如果不改变投票顺序，按原值传递;
   * 需要改变选项顺序时设置为显示顺序，取值范围 1~127。*/
  display_order: number
  voters?: number[]
}

export type ThreadReplyCredit = {
  count: number
  credit_amount: number
  credit_name: string
  limit_per_user: number
  probability: number
  remaining_amount: number
}

export type Users = {
  user_id: number
  username: string
}

export type UserInfo = {
  user_id: number
  username: string
  user_group: number
  credits: number
  last_login_at: number
}

export type ThreadList = GenericList<Thread> & {
  forum?: ForumDetails
}

export interface PostDetails {
  page: number
  pagesize: number
  total: number
  thread?: Thread
  forum?: ForumDetails
  rows: PostFloor[]
}

/** 用户组相关信息 */
export type UserGroupDetails = {
  /** 用户组 ID */
  group_id: number
  /** 用户组名称 */
  group_title: string
  /** 用户组副标题 */
  group_subtitle?: string
  /** 用户组标识图片 */
  group_icon?: string
  /** 用户等级 ID */
  level_id: number
}
export interface PostAuthorDetails extends UserGroupDetails {
  custom_title?: string
  posts: number
  digests: number
  credits: number
  ext_credits: ExtCreditMap
  medals?: number[]
  online_time: number
  register_time: number
  last_visit: number
  signature?: string
  signature_format?: string
}

export interface PostFloor {
  post_id: number
  thread_id: number
  forum_id: number
  position: number
  is_first: number
  dateline: number
  subject: string
  message: string
  format: number
  author: string
  author_id: number
  author_details?: PostAuthorDetails
  support: number
  oppose: number
  is_anonymous: number
  usesig: number
  smileyoff: number

  pinned?: boolean
  blocked?: boolean
  warned?: boolean
  hidden_reply?: boolean
  password?: boolean
  has_comment?: boolean
  has_rate?: boolean
  reply_credit_amount?: number
  reply_credit_name?: string
  lastedit_id?: number
  attachments?: Attachment[]
  invisible: number
}

export interface PostComment {
  id: number
  author: string
  author_id: number
  dateline: number
  message: string
}

export interface CreditScoreMap {
  [name: string]: number
}

export interface PostRate {
  user_id: number
  username: string
  credits: CreditScoreMap
  dateline: number
  reason: string
}

export interface PostRateStat {
  total_users: number
  total_credits: CreditScoreMap
}

export interface PostExtraDetails {
  comments?: PostComment[]
  comment_total?: number
  comment_pages?: number
  comment_page_size?: number
  rates?: PostRate[]
  rate_stat?: PostRateStat
}

export interface PostDetailsByPostId {
  [post_id: number]: PostExtraDetails
}

export type PaginationParams = {
  total: number
  page_size: number
  page: number
}

export type GenericList<T> = PaginationParams & {
  rows: T[]
}

export type MessageCounts = {
  chat: number
  posts: {
    reply: number
    comment: number
    at: number
    rate: number
    other: number
  }
  system: {
    friend: number
    space: number
    task: number
    report: number
    system: number
    admin: number
    app: number
  }
}

export type MessageList<T> = GenericList<T> & {
  new_messages?: MessageCounts
}

export type MessagesSummary = {
  new_messages?: MessageCounts
  new_chats?: ChatConversation[]
  new_notifications?: Notification[]
}

export type NotificationKind = 'reply' | 'comment' | 'at' | 'admin'

export type Notification = {
  id: number
  author: string
  author_id: number
  html_message: string
  dateline: number
  unread: boolean

  kind?: NotificationKind
  thread_id?: number
  post_id?: number
  subject?: string
  summary?: string
}

export type ChatConversation = {
  conversation_id: number
  unread: boolean
  to_uid: number
  to_username: string
  last_author_id: number
  last_author: string
  last_summary: string
  member_count?: number
  message_count: number
  last_update: number
  last_dateline: number
  create_time: number
  author_id: number
  type: 'personal' | 'group'
  subject: string
}

export type ChatMessage = {
  message_id: number
  author_id: number
  author: string
  dateline: number
  message: string
}

export type ChatMessageList = GenericList<ChatMessage> & {
  chat_list?: ChatConversation[]
}

export type GlobalStat = {
  today_posts: number
  yesterday_posts: number
  total_posts: number
  total_users: number
  new_user?: {
    uid: number
    username: string
  }
  online_users?: number
}

export type TopListKey =
  | 'newreply'
  | 'newthread'
  | 'digest'
  | 'life'
  | 'hotlist'

export type TopListThread = ThreadBasics & { label?: string }
export type TopList = {
  [id in TopListKey]?: TopListThread[]
}

export const kAnnouncementSimple = 1

export type Announcement = {
  kind: number
  title: string
  summary?: string
  href?: string
  start_time?: number
  end_time?: number
  highlight_color?: string
  dark_highlight_color?: string
}

export type IndexData = {
  global_stat?: GlobalStat
  announcement?: Announcement[]
  forum_list?: Forum[]
  top_list?: TopList
}
