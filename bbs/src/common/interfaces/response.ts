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

export interface PostDetails {
  page: number
  pagesize: number
  total: number
  rows: PostFloor[]
}

export interface PostFloor {
  id: number
  plate_id: number
  thread_id: number
  is_first: number
  author: string
  author_id: number
  subject: string
  publish_time: number
  message: string
  is_anonymous: number
  is_markdown: number
  attachment: number
  position: number
  reply: string
  replies: number
  reply_to: number
  ReplyPosts: any
}
