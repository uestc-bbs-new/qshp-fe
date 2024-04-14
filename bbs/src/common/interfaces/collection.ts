export type Collection = {
  collection_id: number
  uid: number
  username: string
  name: string
  dateline: number
  follows: number
  threads: number
  comments: number
  description: string
  last_update: number
  average_rate: number
  rates: number
  latest_thread: {
    thread_id: number
    subject: string
    dateline: number
    lastpost_author: string
  }
  last_visit: number
  keyword: string

  is_owner: boolean
}
