import { useEffect, useState } from 'react'
import { Params, useLocation, useMatches } from 'react-router-dom'

const useActiveRoute = () => {
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

type SettingsSubPage = 'profile' | 'privacy' | 'password'
type MessagesSubPage = string

const kIdasOrigin = `https://bbs.uestc.edu.cn`
const idasUrlBase = `https://idas.uestc.edu.cn/authserver/login`
const kIdasContinueBase = `${kIdasOrigin}/continue`
export const gotoIdas = () => {
  location.href = `${idasUrlBase}?service=${encodeURIComponent(
    withSearchAndHash(
      kIdasContinueBase,
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

  messages: (subPage?: MessagesSubPage) =>
    `/messages${subPage ? `/${subPage}` : ''}`,

  settings: (subPage?: SettingsSubPage) =>
    `/settings${subPage ? `/${subPage}` : ''}`,
}

export { useActiveRoute, kIdasOrigin }
