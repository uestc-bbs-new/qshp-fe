type UserSubPage =
  | 'profile'
  | 'threads'
  | 'replies'
  | 'postcomments'
  | 'friends'
  | 'visitors'
  | 'favorites'
  | 'comments'

type UserPageParams = {
  uid?: number
  username?: string
  subPage?: UserSubPage
  removeVisitLog?: boolean
  admin?: boolean
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
}
