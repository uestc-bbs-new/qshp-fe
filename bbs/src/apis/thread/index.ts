import {
  PostDetails,
  UserInfos,
  UserNameFind,
} from '@/common/interfaces/response'
import request from '@/utils/request'

import { makeThreadTypesMap } from '../common'

/** 获取帖子详情信息 */
export const getThreadsInfo = async (
  thread_id: string,
  page = 1,
  threadDetails = false,
  forumDetails = false
) => {
  const result = await request.get<PostDetails>(
    `/star/api/forum/v1/view/post/details`,
    {
      params: {
        thread_id,
        page,
        thread_details: threadDetails ? 1 : 0,
        forum_details: forumDetails ? 1 : 0,
      },
    }
  )
  makeThreadTypesMap(result.forum)
  return result
}

export type PostThreadDetails = {
  forum_id: number
  type_id?: string
  subject: string
  message: string
}

export const postThread = (details: PostThreadDetails) => {
  return request.post('/star/api/forum/v1/post/thread', {
    ...details,
  })
}

export const replyThreads = (
  thread_id: number,
  message: string,
  post_id?: number
) => {
  return request.post<PostDetails>(`/star/api/forum/v1/post/post`, {
    thread_id,
    post_id,
    message,
    format: 2,
  })
}

/** 获取用户信息 */
export const getUserInfo = (uid: number) => {
  return request.get<UserInfos>(`/star/api/forum/v1/view/profile/` + uid)
}

/** 模糊查询用户名 */
export const getUsername = (key: string) => {
  return request.get<UserNameFind>(
    `/star/api/forum/v1/global/search/at?username=${key}&page=${1}&pagesize=${20}`
  )
}
