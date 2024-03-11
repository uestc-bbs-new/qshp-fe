import { ThreadType, ThreadTypeMap } from './thread'

export type ForumBasics = {
  fid: number
  name: string
}

export type ForumCommon = ForumBasics & {
  can_post_thread?: boolean
  can_post_reply?: boolean
}

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
  moderators?: string[]
  children?: Forum[]
}

export type ForumDetails = ForumCommon & {
  threads: number
  todayposts: number
  moderators: string[]
  children: ForumStat[]
  parents: ForumStat[]
  thread_types: ThreadType[]
  thread_types_map?: ThreadTypeMap
  optional_thread_type: boolean
  can_post_anonymously: boolean
  announcement: string
  announcement_format: string
  post_notice_format: 'bbcode' | 'markdown'
  post_notice: PostNotice
}

export type ForumStat = ForumCommon & {
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
