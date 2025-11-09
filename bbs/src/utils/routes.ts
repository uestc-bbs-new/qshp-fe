import { useEffect, useState } from 'react'
import { Params, useMatches } from 'react-router-dom'

import { ContinueMode } from '@/common/types/idas'

import { isPreviewRelease } from './releaseMode'
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

export type SettingsSubPage = 'profile' | 'privacy' | 'security' | 'blacklist'
export type UserSubPage =
  | 'profile'
  | 'threads'
  | 'replies'
  | 'postcomments'
  | 'friends'
  | 'visitors'
  | 'favorites'
  | 'comments'

export type UserPageParams = {
  uid?: number
  username?: string
  subPage?: UserSubPage
  removeVisitLog?: boolean
  admin?: boolean
}

export const kIdasOrigin = `https://bbs.uestc.edu.cn`
const kIdasServerBase = 'https://idas.uestc.edu.cn/authserver'
const idasUrlBase = `${kIdasServerBase}/login`
const idas2UrlBase = `${kIdasServerBase}/oauth2.0/authorize`
const kIdasClientId = '1191760355037016064'
export const kIdasVersion2 = 2
const kIdasContinueBase = `${kIdasOrigin}/continue`
export const kIdasLogoutUrl = `${kIdasServerBase}/logout`

const xAnniversaryBase = '/anniversary/18'

type IdasLinkOptions = {
  mode?: ContinueMode
  version?: number
  continuePath?: string
}
export const getIdasLink = (options?: IdasLinkOptions) => {
  const version = options?.version ?? kIdasVersion2
  const continueUrl = withSearchAndHash(
    `${kIdasContinueBase}${options?.mode ? `/${options.mode}` : ''}`,
    new URLSearchParams({
      path: options?.continuePath ?? `${location.pathname}${location.search}`,
      ...(version ? { version: version.toString() } : {}),
    })
  )
  return version == 2
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
export const gotoIdas = (options?: IdasLinkOptions) => {
  location.href = getIdasLink(options)
}

export const pages = {
  index: () => `/new`,

  thread: (thread_id: number, query?: URLSearchParams, hashValue?: string) =>
    withSearchAndHash(`/thread/${thread_id}`, query, hashValue),
  threadLastpost: (thread_id: number) =>
    pages.thread(thread_id, new URLSearchParams({ page: '-1' }), 'lastpost'),
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
          ? `name/${encodeURIComponent(params.username)}`
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

  resetPassword: `/resetpassword`,
  resetPasswordByEmail: `/resetpassword/email`,
  renew: `/renew`,
  welcome: '/welcome',

  xAnniversary: (code?: string) =>
    `${xAnniversaryBase}${code ? '?s=' + code : ''}`,
  xAnniversaryVerify: `${xAnniversaryBase}/verify`,
}

export const legacyPages = {
  collection: (collection_id: number) =>
    `${siteRoot}/forum.php?mod=collection&action=view&ctid=${collection_id}`,
}

export const mapMessagesRouteToMessageGroup = (
  route?: { id?: string } | null
) => {
  if (route?.id == 'messages_chat' || route?.id == 'messages_chat_user') {
    return 'chat'
  }
  if (route?.id == 'messages_posts') {
    return 'posts'
  }
  if (route?.id == 'messages_system') {
    return 'system'
  }
  return isPreviewRelease ? 'posts' : 'chat'
}

export const messagesSubPages: { id: MessageGroup; text: string }[] = [
  {
    id: 'chat',
    text: '站内信',
  },
  {
    id: 'posts',
    text: '我的帖子',
  },
  {
    id: 'system',
    text: '系统消息',
  },
]
