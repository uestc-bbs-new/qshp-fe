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
  tid: number
  fid: number
  typeid: number
  author: string
  authorid: number
  subject: string
  dateline: number
  lastpost: number
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
  favtimes: number
  sharetimes: number
  cover: number
  replycredit: number
  maxposition: number
  comments: number
}

export type BBSInfo = {
  todayposts: number
  yesterdayposts: number
  forums: Array<Forum>
}

export type ThreadList = {
  total:number
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