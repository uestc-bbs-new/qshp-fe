type ForumLastestThread = {
  thread_id: number
  subject: string
  lastpost_time: number
  lastpost_author: string
  lastpost_authorid: number
}
export type Forum = {
  fid: number
  fup: number
  type: string
  name: string
  threads: number
  posts: number
  todayposts: number
  yesterdayposts: number
  autoclose: number
  modworks: number
  favtimes: number
  sharetimes: number
  tid: number
  typeid: number
  author: string
  authorid: number
  subject: string
  dateline: number
  lastpost: string
  lastposter: string
  views: number
  replies: number
  highlight: number
  digest: number
  rate: number
  special: boolean
  attachment: number
  moderated: boolean
  closed: boolean
  stickreply: boolean
  recommends: number
  recommend_add: number
  recommend_sub: number
  heats: number
  cover: number
  replycredit: number
  maxposition: number
  comments: number
  latest_thread: ForumLastestThread
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

export type Thread = {
  thread_id: number
  forum_id: number
  post_id: number
  type_id: number
  sort_id: number
  author: string
  author_id: number
  subject: string
  dateline: number
  last_post: number
  last_poster: string
  views: number
  replies: number
  dis_playorder: number
  highlight: number
  digest: number
  is_rate: number
  special: boolean
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
  message: string
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

export interface ThreadDetails {
  subject: string
}

export interface PostDetails {
  page: number
  pagesize: number
  total: number
  thread?: ThreadDetails
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

export type ForumDetails = {
  fid: number
  name: string
  threads: number
  todayposts: number
  moderators: Array<string>
  children: Array<ForumType>
  parents: Array<ForumType>
  thread_types: Array<ThreadType>
  thread_types_map?: ThreadTypeMap
  announcement: string
  announcement_format: string
  post_notice_format: string
}

export type ForumType = {
  fid: number
  fup: number
  type: string
  name: string
  threads: number
  posts: number
  todayposts: number
  yesterdayposts: number
  latest_thread: Array<{
    thread_id: number
    subject: string
    lastpost_time: number
    lastpost_author: string
    lastpost_authorid: number
  }>
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
