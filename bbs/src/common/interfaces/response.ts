export interface Forum {
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
  closed: number
  stickreply: boolean
  recommends: number
  recommend_add: number
  recommend_sub: number
  heats: number
  cover: number
  replycredit: number
  maxposition: number
  comments: number
}

export interface ForumList {
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
