import {
  BBSInfo,
  ForumList,
  Thread,
  ThreadList,
  ThreadTypeMap,
  UserInfo,
  Users,
} from '@/common/interfaces/response'
import request, { authService } from '@/utils/request'

const commonUrl = '/star/api/forum/v1'

export const getForumList = () => {
  return request.get<null, ForumList>(`${commonUrl}/view/forum/forum-list`)
}

export const getBulletin = (params: object) => {
  return request.get(`${commonUrl}/global/thread/bulletin`, {
    params: params,
  })
}

export const getBBSInfo = () => {
  return request.get<null, BBSInfo>(`${commonUrl}/view/forum/bbs-info`)
}

export const searchThreads = (params: object) => {
  return request.post<object, { resultNum: number; threads: Thread[] }>(
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
  return request.get<object, { total: number; rows: UserInfo[] }>(
    `${commonUrl}/global/search`,
    { params: params }
  )
}

export const searchUsers_at = (params: object) => {
  return request.get<object, { total: number; rows: Users[] }>(
    `${commonUrl}/global/search/at`,
    { params: params }
  )
}

export const getThreadList = async (params: object) => {
  const result = await request.get<null, ThreadList>(
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
  return request.get<object, Thread[]>(`${commonUrl}/view/thread/bulletin`)
}

export const signIn = (params: {
  username: string
  password: string
  stay_signed_in: boolean
}) => {
  return authService.post<object, string>(`${commonUrl}/auth/signin`, {
    ...params,
  })
}

export const signOut = () => {
  return authService.post(`${commonUrl}/auth/signout`)
}
