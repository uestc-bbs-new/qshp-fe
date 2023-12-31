import {
  BBSInfo,
  Forum,
  ForumDetails,
  Thread,
  ThreadBasics,
  ThreadList,
  ThreadTypeMap,
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
  return request.get<Forum[]>(`${commonUrl}//forum/list`)
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

export const getTopLists = async (ids: string | string[]) => {
  if (typeof ids === 'string') {
    ids = [ids]
  }
  const result = await request.get<{
    [id: string]: ThreadBasics[] | undefined
  }>(`${commonUrl}/view/thread/toplist`, {
    params: { idlist: ids.join(',') },
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
    `${commonUrl}/global/search`,
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
  const result = await request.get<ThreadList>(
    `${commonUrl}/view/thread/threads`,
    {
      params: {
        ...params,
        forum_details: params.forum_details ? 1 : 0,
      },
    }
  )
  makeThreadTypesMap(result.forum)
  result.rows.forEach((item) => {
    item.subject = unescapeSubject(item.subject, item.dateline, true)
  })
  return result
}

export const getAnnouncement = () => {
  return request.get<Thread[]>(`${commonUrl}/view/thread/bulletin`)
}

export const signIn = (params: {
  username: string
  password: string
  keep_signed_in: boolean
  captcha_value: string
}) => {
  return authService.post<string>(
    `${commonUrl}/auth/signin`,
    {
      username: params.username,
      password: params.password,
      keep_signed_in: params.keep_signed_in,
    },
    { headers: { 'X-UESTC-BBS-Captcha': params.captcha_value } }
  )
}

export const signOut = () => {
  return authService.post(`${commonUrl}/auth/signout`)
}
