import {
  BBSInfo,
  Forum,
  ForumDetails,
  IndexData,
  Thread,
  ThreadList,
  ThreadTypeMap,
  TopList,
  UserInfo,
  Users,
} from '@/common/interfaces/response'
import { unescapeSubject } from '@/utils/htmlEscape'
import request, { authService, commonUrl } from '@/utils/request'

import registerAuthAdoptLegacyInterceptors from './interceptors/authAdoptLegacy'
import registerAuthHeaderInterceptors from './interceptors/authHeader'
import registerUserInterceptors from './interceptors/user'

registerAuthHeaderInterceptors(request)
registerAuthAdoptLegacyInterceptors(request.axios)
registerUserInterceptors(request)
registerUserInterceptors(authService)

export const makeThreadTypesMap = (forum?: ForumDetails) => {
  if (forum && forum.thread_types) {
    forum.thread_types_map = forum.thread_types.reduce<ThreadTypeMap>(
      (map, item) => {
        map[item.type_id] = item
        return map
      },
      {}
    )
  }
}

export const getForumList = () => {
  return request.get<Forum[]>(`${commonUrl}/forum/list`)
}
export const getForumDetails = (forum_id: string) => {
  return request.get<ForumDetails>(`${commonUrl}/forum/details`, {
    params: {
      forum_id,
    },
  })
}

export const getBulletin = (params: object) => {
  return request.get(`${commonUrl}/global/thread/bulletin`, {
    params: params,
  })
}

export const getBBSInfo = () => {
  return request.get<BBSInfo>(`${commonUrl}/view/forum/bbs-info`)
}

const normalizeStringArray = (value: string | string[]) => {
  if (typeof value === 'string') {
    return [value]
  }
  return value
}
export const getTopLists = async (ids: string | string[]) => {
  const result = await request.get<TopList>(`${commonUrl}/forum/toplist`, {
    params: { idlist: normalizeStringArray(ids).join(',') },
  })
  for (const [_, v] of Object.entries(result)) {
    v?.forEach(
      (thread) =>
        (thread.subject = unescapeSubject(
          thread.subject,
          thread.dateline,
          true
        ))
    )
  }
  return result
}

export const getIndexData = ({
  globalStat,
  forumList,
  topList,
}: {
  globalStat?: boolean
  forumList?: boolean
  topList?: string | string[]
}) =>
  request.get<IndexData>(`${commonUrl}/index`, {
    params: {
      ...(globalStat && { global_stat: 1 }),
      ...(forumList && { forum_list: 1 }),
      ...(topList && { top_list: normalizeStringArray(topList).join(',') }),
    },
  })

export const searchThreads = (params: object) => {
  return request.post<{ resultNum: number; threads: Thread[] }>(
    `${commonUrl}/global/search/thread`,
    params,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )
}

export const searchUsers = (params: object) => {
  return request.get<{ total: number; rows: UserInfo[] }>(
    `${commonUrl}/global/search/`,
    { params: params }
  )
}

export const searchUsers_at = (params: object) => {
  return request.get<{ total: number; rows: Users[] }>(
    `${commonUrl}/global/search/at`,
    { params: params }
  )
}

export const getThreadList = async (params: {
  forum_id: number
  page: number
  sort_by?: number
  type_id?: number
  forum_details?: boolean
}) => {
  const result = await request.get<ThreadList>(`${commonUrl}/thread/list`, {
    params: {
      ...params,
      forum_details: params.forum_details ? 1 : 0,
    },
  })
  makeThreadTypesMap(result.forum)
  result.rows.forEach((item) => {
    item.subject = unescapeSubject(item.subject, item.dateline, true)
  })
  return result
}

export const getAnnouncement = () => {
  return request.get<Thread[]>(`${commonUrl}/view/thread/bulletin`)
}
