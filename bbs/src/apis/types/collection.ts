import { User } from '@/common/interfaces/base'
import { PaginationParams, ThreadInList } from '@/common/interfaces/response'

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

export type CollectionDetails = Collection & {
  collaborators?: User[]
  other_collections?: Collection[]
}

export type CollectionQueryResponse = PaginationParams & {
  threads?: ThreadInList[]
  collection?: CollectionDetails
}
