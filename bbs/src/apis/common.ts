import request from '@/utils/request'

const commonUrl = 'read'

export const getForumList = (params: object): object => {
  return request.get(`${commonUrl}/forum/forum-list`, { params: params })
}

export const getBulletin = (params: object) => {
  return request.get(`${commonUrl}/thread/bulletin`, { params: params })
}

export const getHotThread = (params: object) => {
  return request.post(`${commonUrl}/thread/hot`, params)
}

export const getBBSInfo = () => {
  return request.get(`${commonUrl}/forum/bbs-info`)
}
