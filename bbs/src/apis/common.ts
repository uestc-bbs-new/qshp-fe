import {
  BBSInfo,
  ForumList,
  Thread,
  ThreadList,
  UserInfo,
  Users,
} from '@/common/interfaces/response'
import request from '@/utils/request'

const commonUrl = 'http://222.197.183.89:65342/star/api/forum/v1'

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

export const getThreadList = (params: object) => {
  return request.get<null, ThreadList>(`${commonUrl}/view/thread/threads`, {
    params: params,
  })
}

export const getAnnouncement = () => {
  return request.get<object, Thread[]>(`${commonUrl}/view/thread/bulletin`)
}
