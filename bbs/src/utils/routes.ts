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
    if (matches.length > 0) {
      setActiveRoute(matches[matches.length - 1])
    }
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

const thread = (
  thread_id: number,
  query?: URLSearchParams,
  hashValue?: string
) => withSearchAndHash(`/thread/${thread_id}`, query, hashValue)

const forum = (forum_id: number, query?: URLSearchParams) =>
  withSearchAndHash(`/forum/${forum_id}`, query)

const goto = (post_id: number) => `/goto/${post_id}`

export const pages = {
  thread,
  forum,
  goto,
}

export { useActiveRoute }
