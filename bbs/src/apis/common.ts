import request from '@/utils/request'

import { ForumList, Thread, BBSInfo } from '@/common/interfaces/response'

const commonUrl = 'read'

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
