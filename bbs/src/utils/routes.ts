import { useEffect, useState } from 'react'
import { Params, useLocation, useMatches } from 'react-router-dom'

import { ContinueMode } from '@/common/types/idas'

import siteRoot from './siteRoot'

export const useActiveRoute = () => {
  const location = useLocation()
  const matches = useMatches()
  const [activeRoute, setActiveRoute] = useState<{
    id: string
    pathname: string
    params: Params<string>
    data: unknown
    handle: unknown
  } | null>(null)
  useEffect(() => {
    setActiveRoute(matches.length > 0 ? matches[matches.length - 1] : null)
  }, [location])
  return activeRoute
}

const withSearchAndHash = (
  baseUrl: string,
  query?: URLSearchParams,
  hashValue?: string
) => {
  if (query) {
    const str = query.toString()
    if (str) {
      baseUrl += `?${str}`
    }
  }
  if (hashValue) {
    baseUrl += `#${hashValue}`
  }
  return baseUrl
}

type SettingsSubPage = 'profile' | 'privacy' | 'password' | 'blacklist'

export type UserPageParams = {
  uid?: number
  username?: string
  subPage?: string
  removeVisitLog?: boolean
  admin?: boolean
}

export const kIdasOrigin = `https://bbs.uestc.edu.cn`
const idasUrlBase = `https://idas.uestc.edu.cn/authserver/login`
const kIdasContinueBase = `${kIdasOrigin}/continue`
export const gotoIdas = (options?: { mode?: ContinueMode }) => {
  location.href = `${idasUrlBase}?service=${encodeURIComponent(
    withSearchAndHash(
      `${kIdasContinueBase}${options?.mode ? `/${options.mode}` : ''}`,
      new URLSearchParams({
        path: `${location.pathname}${location.search}`,
      })
    )
  )}`
}

export const pages = {
  index: () => `/`,

  thread: (thread_id: number, query?: URLSearchParams, hashValue?: string) =>
    withSearchAndHash(`/thread/${thread_id}`, query, hashValue),
  forum: (forum_id: number, query?: URLSearchParams) =>
    withSearchAndHash(`/forum/${forum_id}`, query),
  goto: (post_id: number) => `/goto/${post_id}`,
  post: (forum_id?: number) => `/post${forum_id ? `/${forum_id}` : ''}`,

  messages: (subPage?: MessageGroup) =>
    `/messages${subPage ? `/${subPage}` : ''}`,
  notifications: (group: NotificationGroup, kind: string) =>
    `/messages/${group}/${kind}`,
  chat: (conversationId?: number) =>
    `/messages/chat${conversationId ? `/${conversationId}` : ''}`,

  settings: (subPage?: SettingsSubPage) =>
    `/settings${subPage ? `/${subPage}` : ''}`,

  user: (params?: UserPageParams) =>
    withSearchAndHash(
      `/user/${
        params?.username
          ? `name/${params.username}`
          : params?.uid
            ? params.uid
            : 'me'
      }${params?.subPage ? `/${params.subPage}` : ''}`,
      params?.removeVisitLog || params?.admin
        ? new URLSearchParams({
            ...(params?.removeVisitLog && { additional: 'removevlog' }),
            ...(params?.admin && { a: '1' }),
          })
        : undefined
    ),

  searchThreads: (params?: {
    keyword?: string
    author?: string
    digest?: boolean
  }) =>
    withSearchAndHash(
      `/search`,
      new URLSearchParams({
        ...(params?.keyword && { q: params.keyword }),
        ...(params?.author && { author: params.author }),
        ...(params?.digest && { digest: '1' }),
        type: 'post',
      })
    ),
}

export const legacyPages = {
  collection: (collection_id: number) =>
    `${siteRoot}/forum.php?mod=collection&action=view&ctid=${collection_id}`,
}
