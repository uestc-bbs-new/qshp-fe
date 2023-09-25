import { BBSInfo, ForumList, Thread, Users, UserInfo } from '@/common/interfaces/response'
import request from '@/utils/request'

// const commonUrl = 'http://222.197.183.89:65342'
const commonUrl = 'http://127.0.0.1:4523/m1/1045892-0-default'
//本地Mock
// 全局
const commonUrl_1 = `${commonUrl}/star/api/forum/v1/global`
// 看帖
// const commonUrl_2 = 'http://127.0.0.1:4523/m1/1045892-0-default/star/api/forum/v1/view'
// 搜索用户
const commonUrl_3=`${commonUrl}/star/api/forum/v1/global/search`
// 搜索用户@
const commonUrl_4=`${commonUrl}/star/api/forum/v1/global/search/at`
// 查询用户信息
const commonUrl_5=`${commonUrl}/read/user/`
// // 热贴
// const commonUrl_6=`${commonUrl}/read/thread/hot`
//论坛活跃情况
const commonUrl_7=`${commonUrl}/star/api/forum/v1/view/forum/bbs-info`


export const getForumList = () => {
  return request.get<null, ForumList>(`${commonUrl}/star/api/forum/v1/view/forum/forum-list`)
}

export const getBulletin = (params: object) => {
  return request.get(`${commonUrl_1}/thread/bulletin`, { params: params })
}

export const getBBSInfo = () => {
  return request.get<null, BBSInfo>(`${commonUrl_7}`)
}

export const searchThreads = (params: object) => {
  return request.post<object, { resultNum: number; threads: Thread[] }>(
    `${commonUrl_1}/thread/search`,
    {params: params}
  )
}

export const searchUsers = (params: object) =>{
  return request.get<object, {total: number; rows: UserInfo[] }>(
    `${commonUrl_3}`,
     {params: params}
    )
}

export const searchUsers_at = (params: object) => {
  console.log(params)
  return request.get<object, {total: number; rows: Users[] }>(
    `${commonUrl_4}`,
     {params: params}
    )
}

// export const getUserInfo = (params: number) => {
//   return request.get<number, UserInfo>(
//     `${commonUrl_5}`+params
//     )
// }

// export const getHotThread = (params: object) => {
//   return request.post<object, { threads: Thread[] }>(
//     `${commonUrl_6}`,
//     params
//   )
// }