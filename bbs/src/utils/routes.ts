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

const thread = (
  thread_id: number,
  query?: URLSearchParams,
  hashValue?: string
) => {
  let href = `/thread/${thread_id}`
  if (query) {
    const str = query.toString()
    if (str) {
      href += `?${str}`
    }
  }
  if (hashValue) {
    href += `#${hashValue}`
  }
  return href
}

const goto = (post_id: number) => `/goto/${post_id}`

export const pages = {
  thread,
  goto,
}

export { useActiveRoute }
