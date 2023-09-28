import { BBSInfo, ForumList, Thread, Users, UserInfo, ThreadList } from '@/common/interfaces/response'
import request from '@/utils/request'

// const commonUrl = 'http://222.197.183.89:65342'
const commonUrl = ''

export const getForumList = () => {
  return request.get<null, ForumList>(`${commonUrl}/star/api/forum/v1/view/forum/forum-list`)
}

export const getBulletin = (params: object) => {
  return request.get(`${commonUrl}/star/api/forum/v1/global/thread/bulletin`, { params: params })
}

export const getBBSInfo = () => {
  return request.get<null, BBSInfo>(`${commonUrl}/star/api/forum/v1/view/forum/bbs-info`)
}

export const searchThreads = (params: object) => {
  return request.post<object, { resultNum: number; threads: Thread[] }>(
    `${commonUrl}/star/api/forum/v1/global`,
    {params: params}
  )
}

export const searchUsers = (params: object) =>{
  return request.get<object, {total: number; rows: UserInfo[] }>(
    `${commonUrl}/star/api/forum/v1/global/search`,
     {params: params}
    )
}

export const searchUsers_at = (params: object) => {
  console.log(params)
  return request.get<object, {total: number; rows: Users[] }>(
    `${commonUrl}/star/api/forum/v1/global/search/at`,
     {params: params}
    )
}

export const getThreadList = (params: object) => {
  return request.get<null, ThreadList>(
    `${commonUrl}/star/api/forum/v1/view/thread/threads`,
    { params: params}
  )
};
