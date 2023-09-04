import { BBSInfo, ForumList, Thread, Users, UserInfo } from '@/common/interfaces/response'
import request from '@/utils/request'

//const commonUrl = 'read'

//本地Mock
// 全局
const commonUrl = 'http://127.0.0.1:4523/m1/1045892-0-default/star/api/forum/v1/global'
// 看帖
// const commonUrl_2 = 'http://127.0.0.1:4523/m1/1045892-0-default/star/api/forum/v1/view'
// @用户
const commonUrl_3='http://127.0.0.1:4523/m1/1045892-0-default/forum/api/global/search/at'
// 搜索用户
const commonUrl_4='http://127.0.0.1:4523/m1/1045892-0-default/star/api/forum/v1/global/search/at'
// 查询用户信息
const commonUrl_5='http://127.0.0.1:4523/m1/1045892-0-default/read/user/'
// 热贴
const commonUrl_6='http://127.0.0.1:4523/m1/1045892-0-default/read/thread/hot'

export const getForumList = () => {
  return request.get<null, ForumList>(`${commonUrl}/forum/forum-list`)
}

export const getBulletin = (params: object) => {
  return request.get(`${commonUrl}/thread/bulletin`, { params: params })
}

export const getHotThread = (params: object) => {
  return request.post<object, { threads: Thread[] }>(
    `${commonUrl_6}`,
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

export const searchUsers_at = (params: object) => {
  return request.get<object, {total: number; rows: Users[] }>(
    `${commonUrl_3}`,
     params
    )
}

export const searchUsers = (params: object) =>{
  return request.get<object, {total: number; rows: UserInfo[] }>(
    `${commonUrl_4}`,
     params
    )
}

export const getUserInfo = (params: number) => {
  return request.get<number, UserInfo>(
    `${commonUrl_5}`+params
    )
}
