type ForumLastestThread = {
  thread_id: number
  subject: string
  lastpost_time: number
  lastpost_author: string
  lastpost_authorid: number
}
export type Forum = ForumCommon & {
  todayposts?: number
  latest_thread?: ForumLastestThread
  moderators?: Array<string>
  children?: Array<Forum>
}

export type ForumAside = {
  fid: number
  fup: number
  type: string
  name: string
  status: boolean
  threads: number
  posts: number
  todayposts: number
  yesterdayposts: number
  autoclose: number
  modworks: number
  favtimes: number
  sharetimes: number
}

export type ForumList = {
  group: Array<{
    fid: number
    fup: number
    type: string
    name: string
    threads: number
    posts: number
    todayposts: number
    yesterdayposts: number
    moderators: Array<string>
    forums: Array<Forum>
    autoclose: number
    modworks: number
    favtimes: number
    sharetimes: number
  }>
}

export type ThreadBasics = {
  thread_id: number
  forum_id: number
  author: string
  author_id: number
  subject: string
  dateline: number
  last_post: number
  summary: string
  views: number
  replies: number
}

export type Thread = ThreadBasics & {
  post_id: number
  type_id: number
  sort_id: number
  last_poster: string
  dis_playorder: number
  highlight_color?: string
  highlight_bgcolor?: string
  highlight_bold?: boolean
  highlight_italic?: boolean
  highlight_underline?: boolean
  digest: number
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
  reply_credit: number
  max_position: number
  comments: number
  reverse_replies: boolean
  can_reply: boolean
  poll?: ThreadPollDetails
}

export type ThreadPollDetails = {
  options: ThreadPollOption[]
  selected_options: number[]
  show_voters: boolean
  multiple: boolean
  visible: boolean
  max_choices: number
  is_image: boolean
  expiration: number
  voter_count: number
}

export type ThreadPollOption = {
  id: number
  text: string
  votes?: number
  voters?: number[]
}

export type BBSInfo = {
  todayposts: number
  yesterdayposts: number
  threads: Array<Thread>
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

export type ThreadList = {
  total: number
  rows: Array<Thread>
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

export interface PostFloor {
  post_id: number
  forum_id: number
  thread_id: number
  position: number
  is_first: number
  subject: string
  support: number
  oppose: number
  message: string
  dateline: number
  is_anonymous: number
  usesig: number
  format: number
  smileyoff: number
  parseurloff: number
  lastedit_id: number
  author: string
  author_id: number
  user_group: number
  admin_group: number
  credits: number
  droplets: number
  prestiges: number
  essences: number
  medals: number[]
  friends: number
  sign: string
  title: string
  online_time: number
  registered_at: number
  last_login_at: number
  pinned?: boolean
  blocked?: boolean
  warned?: boolean
  hidden_reply?: boolean
  password?: boolean
  has_comment?: boolean
  has_rate?: boolean
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

export interface PostPosition {
  thread_id: number
  position: number
}

export interface UserInfos {
  views: number
  emailstatus: boolean
  videophotostatus: boolean
  title: string
  sign: string
  bio: string
  friends: number
  threads: number
  albums: number
  sharings: number
  doings: number
  posts: number
  gender: boolean
  birthday: string
  education: string
  birthprovince: string
  birthcity: string
  resideprovince: string
  residecity: string
  medals: string
  admin_group: number
  user_group: number
  online_time: number
  registered_at: number
  last_login_at: number
  lastactivity: number
  lastpost: number
  zone: number
  credits: number
  droplets: number
  prestiges: number
}

export type ForumCommon = {
  fid: number
  name: string
  can_post_thread?: boolean
  can_post_reply?: boolean
}

export type PostNotice = {
  newthread: string
  newthread_mobile: string
  newthread_quick: string
  reply: string
  reply_mobile: string
  reply_quick: string
  reply_quick_mobile: string
  editthread: string
  editthread_mobile: string
  poll: string
}

export type ForumDetails = ForumCommon & {
  threads: number
  todayposts: number
  moderators: Array<string>
  children: Array<ForumType>
  parents: Array<ForumType>
  thread_types: Array<ThreadType>
  thread_types_map?: ThreadTypeMap
  optional_thread_type: boolean
  can_post_anonymously: boolean
  announcement: string
  announcement_format: string
  post_notice_format: 'bbcode' | 'markdown'
  post_notice: PostNotice
}

export type ForumType = ForumCommon & {
  threads: number
  posts: number
  todayposts: number
  yesterdayposts: number
  latest_thread: {
    thread_id: number
    subject: string
    lastpost_time: number
    lastpost_author: string
    lastpost_authorid: number
  }
}

export type ThreadType = {
  type_id: number
  name: string
  moderators_only: boolean
}

export type ThreadTypeMap = { [type_id: number]: ThreadType }

export interface UserName {
  user_id: number
  username: string
}

export interface UserNameFind {
  total: number
  rows: UserName[]
}

export type IdasAuthResult = {
  authorization?: string
  new_user?: boolean
  users?: {
    uid: number
    username: string
  }[]
  ephemeral_authorization: string
  remaining_registers?: number
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

export type NotificationKind = 'reply' | 'comment' | 'admin'

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
