import { UserGroupDetails } from './response'

export type SearchSummaryUser = UserGroupDetails & {
  uid: number
  username: string
}

export type SearchSummaryThread = {
  thread_id: number
  forum_id: number
  subject: string
  author: string
  author_id: number
  dateline: number
}

export type SearchSummaryResponse = {
  threads?: SearchSummaryThread[]
  thread_count: number
  users?: SearchSummaryUser[]
  user_count: number
  tid_match?: SearchSummaryThread
  uid_match?: SearchSummaryUser
}
