import { BBSInfo, ForumList, Thread, Users } from '@/common/interfaces/response'
import request from '@/utils/request'

//const commonUrl = 'read'

//本地Mock
//全局
const commonUrl = 'http://127.0.0.1:4523/m1/1045892-0-default/star/api/forum/v1/global'
// //看帖
// const commonUrl_2 = 'http://127.0.0.1:4523/m1/1045892-0-default/star/api/forum/v1/view'

export const getForumList = () => {
  return request.get<null, ForumList>(`${commonUrl}/forum/forum-list`)
}

export const getBulletin = (params: object) => {
  return request.get(`${commonUrl}/thread/bulletin`, { params: params })
}

export const getHotThread = (params: object) => {
  return request.post<object, { threads: Thread[] }>(
    `${commonUrl}/thread/hot`,
    params
  )
}

export const getBBSInfo = () => {
  return request.get<null, BBSInfo>(`${commonUrl}/forum/bbs-info`)
}

export const searchThreads = (params: object) => {
  return request.post<object, { resultNum: number; threads: Thread[] }>(
    `${commonUrl}/thread/search`,
    params
  )
}

// export const searchUsers = (params: object) => {
//   return request.get<object, {total: number; rows: Users[] }>(
//     `http://127.0.0.1:4523/m1/1045892-0-default/forum/api/global/search/at`,
//      params
//     )
// }