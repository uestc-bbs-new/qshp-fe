import {
  PostDetails,
  UserInfos,
  UserNameFind,
} from '@/common/interfaces/response'
import { unescapeSubject } from '@/utils/htmlEscape'
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
  if (result.thread?.subject) {
    result.thread.subject = unescapeSubject(
      result.thread.subject,
      result.thread.dateline,
      true
    )
  }
  result.rows.forEach((item) => {
    item.subject = unescapeSubject(item.subject, item.dateline, false)
  })
  return result
}

export type PostCommonDetails = {
  subject?: string
  message: string
  is_anonymous?: boolean
}

export type PostThreadDetails = PostCommonDetails & {
  forum_id: number
  type_id?: string
}

export const postThread = (details: PostThreadDetails) => {
  return request.post('/star/api/forum/v1/post/thread', {
    ...details,
  })
}

export type ReplyThreadDetails = PostCommonDetails & {
  thread_id: number
  post_id?: number
}

export const replyThreads = (details: ReplyThreadDetails) => {
  return request.post<PostDetails>(`/star/api/forum/v1/post/post`, {
    ...details,
    format: 2,
  })
}

export const votePost = (params: {
  tid?: number
  pid?: number
  support: boolean
}) => {
  return request.post<boolean>(`/star/api/forum/v1/post/vote`, undefined, {
    params,
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
