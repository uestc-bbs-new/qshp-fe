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
  forums?: Array<Forum>
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
  name: string
  subject: string
  dateline: number
  last_post: number
  last_poster: string
  views: number
  replies: number
  dis_playorder: number
  is_highlight: number
  is_digest: number
  is_rate: number
  special: boolean
  attachment: number
  is_moderated: boolean
  is_closed: boolean
  is_stick_reply: boolean
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
  rows: Array<Thread2>
}

export type Thread2 = {
  thread_id: string
  forum_id: string
  post_id: string
  type_id: string
  sort_id: string
  author: string
  author_id: number
  subject: string
  dateline: number
  last_post: number
  last_poster: string
  views: string
  replies: string
  display_order: string
  is_highlight: string
  is_digest: string
  is_rate: string
  special: string
  attachment: string
  is_moderated: string
  is_closed: string
  is_stick_reply: string
  recommends: string
  recommend_add: string
  recommend_sub: string
  heats: string
  status: string
  favorite_times: string
  share_times: string
}

export interface PostDetails {
  page: number
  pagesize: number
  total: number
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
  is_markdown: number
  replies: number
  reply_to: number
  is_edited: number
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
