import { useEffect, useState } from 'react'
import { Params, useMatches } from 'react-router-dom'

import { ContinueMode } from '@/common/types/idas'

import siteRoot from './siteRoot'

export const useActiveRoute = () => {
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
  }, [matches])
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

export type SettingsSubPage = 'profile' | 'privacy' | 'password' | 'blacklist'

export type UserPageParams = {
  uid?: number
  username?: string
  subPage?: string
  removeVisitLog?: boolean
  admin?: boolean
}

export const kIdasOrigin =
  // @ts-expect-error preserve code as is
  window[['L'.toLowerCase(), 'ocation'].join('')].hostname ==
  `bbs-uestc-edu-cn-s.vpn.uestc.edu.cn`
    ? // @ts-expect-error preserve code as is
      window[['L'.toLowerCase(), 'ocation'].join('')].origin
    : `https://bbs.uestc.edu.cn`
const idasUrlBase = `https://idas.uestc.edu.cn/authserver/login`
const idas2UrlBase = `https://idas.uestc.edu.cn/authserver/oauth2.0/authorize`
const kIdasClientId = '1191760355037016064'
export const kIdasVersion2 = 2
const kIdasContinueBase = `${kIdasOrigin}/continue`
export const gotoIdas = (options?: {
  mode?: ContinueMode
  version?: number
  continuePath?: string
}) => {
  const version = options?.version ?? kIdasVersion2
  const continueUrl = withSearchAndHash(
    `${kIdasContinueBase}${options?.mode ? `/${options.mode}` : ''}`,
    new URLSearchParams({
      path: options?.continuePath ?? `${location.pathname}${location.search}`,
      ...(version ? { version: version.toString() } : {}),
    })
  )
  // @ts-expect-error preserve code as is
  window[['L'.toLowerCase(), 'ocation'].join('')].href =
    version == 2
      ? withSearchAndHash(
          idas2UrlBase,
          new URLSearchParams({
            response_type: 'code',
            client_id: kIdasClientId,
            redirect_uri: continueUrl,
            state: '1',
          })
        )
      : `${idasUrlBase}?service=${encodeURIComponent(continueUrl)}`
}

export const pages = {
  index: () => `/new`,

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
      })
    ),

  searchUsers: (params: { keyword: string }) =>
    withSearchAndHash(
      `/search/user`,
      new URLSearchParams({ q: params.keyword })
    ),
}

export const legacyPages = {
  collection: (collection_id: number) =>
    `${siteRoot}/forum.php?mod=collection&action=view&ctid=${collection_id}`,
}
