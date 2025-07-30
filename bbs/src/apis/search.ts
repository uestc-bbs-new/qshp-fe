import request, { commonUrl } from '@/apis/request'
import { GenericList, ThreadInList } from '@/common/interfaces/response'
import {
  SearchSummaryResponse,
  SearchSummaryUser,
} from '@/common/interfaces/search'
import { unescapeSubject } from '@/utils/htmlEscape'

export const searchSummary = async (query: string) => {
  const result = await request.get<SearchSummaryResponse>(
    `${commonUrl}/search/summary`,
    {
      params: { q: query },
    }
  )
  result.threads?.forEach(
    (item) =>
      (item.subject = unescapeSubject(item.subject, item.dateline, true))
  )
  if (result.tid_match) {
    result.tid_match.subject = unescapeSubject(
      result.tid_match.subject,
      result.tid_match.dateline,
      true
    )
  }
  return result
}

export const searchThreads = async ({
  keyword,
  author,
  fids,
  digest,
  page,
}: {
  keyword?: string | null
  author?: string | null
  fids?: string | null
  digest?: boolean
  page?: number
}) => {
  const result = await request.get<GenericList<ThreadInList>>(
    `${commonUrl}/search/threads`,
    {
      params: {
        ...(keyword && { q: keyword }),
        ...(author && { author }),
        ...(fids && { fids }),
        ...(digest && { digest: 1 }),
        ...(page && { page }),
      },
    }
  )
  result.rows?.forEach(
    (item) =>
      (item.subject = unescapeSubject(item.subject, item.dateline, true))
  )
  return result
}

export const searchUsers = ({
  query,
  withFriends,
  page,
}: {
  query?: string | null
  withFriends?: boolean
  page?: number
}) => {
  return request.get<GenericList<SearchSummaryUser>>(
    `${commonUrl}/search/users`,
    {
      params: {
        ...(query && { q: query }),
        ...(withFriends && { with_friends: 1 }),
        ...(page && { page }),
      },
    }
  )
}
