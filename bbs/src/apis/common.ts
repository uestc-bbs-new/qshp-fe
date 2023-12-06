import {
  BBSInfo,
  ForumList,
  Thread,
  ThreadList,
  ThreadTypeMap,
  UserInfo,
  Users,
} from '@/common/interfaces/response'
import request, { authService, commonUrl } from '@/utils/request'

import registerAuthAdoptLegacyInterceptors from './interceptors/auth_adopt_legacy'
import registerAuthHeaderInterceptors from './interceptors/auth_header'
import registerUserInterceptors from './interceptors/user'

registerAuthHeaderInterceptors(request)
registerAuthAdoptLegacyInterceptors(request.axios)
registerUserInterceptors(request)
registerUserInterceptors(authService)

export const getForumList = () => {
  return request.get<null, ForumList>(`${commonUrl}/view/forum/forum-list`)
}

export const getBulletin = (params: object) => {
  return request.get(`${commonUrl}/global/thread/bulletin`, {
    params: params,
  })
}

export const getBBSInfo = () => {
  return request.get<BBSInfo>(`${commonUrl}/view/forum/bbs-info`)
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

export const getThreadList = async (params: object) => {
  const result = await request.get<ThreadList>(
    `${commonUrl}/view/thread/threads`,
    {
      params: params,
    }
  )
  if (result.forum && result.forum.thread_types) {
    result.forum.thread_types_map =
      result.forum.thread_types.reduce<ThreadTypeMap>((map, item) => {
        map[item.type_id] = item
        return map
      }, {})
  }
  return result
}

export const getAnnouncement = () => {
  return request.get<Thread[]>(`${commonUrl}/view/thread/bulletin`)
}

export const signIn = (params: {
  username: string
  password: string
  keep_signed_in: boolean
}) => {
  return authService.post<string>(`${commonUrl}/auth/signin`, {
    ...params,
  })
}

export const signOut = () => {
  return authService.post(`${commonUrl}/auth/signout`)
}
