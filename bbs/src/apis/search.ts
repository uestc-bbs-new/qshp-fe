import { GenericList, ThreadInList } from '@/common/interfaces/response'
import {
  SearchSummaryResponse,
  SearchSummaryUser,
} from '@/common/interfaces/search'
import { unescapeSubject } from '@/utils/htmlEscape'
import request, { commonUrl } from '@/utils/request'

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

export const searchThreads = ({
  keyword,
  author,
  digest,
  page,
}: {
  keyword?: string | null
  author?: string | null
  digest?: boolean
  page?: number
}) => {
  return request.get<GenericList<ThreadInList>>(`${commonUrl}/search/threads`, {
    params: {
      ...(keyword && { q: keyword }),
      ...(author && { author }),
      ...(digest && { digest: 1 }),
      ...(page && { page }),
    },
  })
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
