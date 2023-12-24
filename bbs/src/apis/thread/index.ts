import {
  PostDetails,
  PostDetailsByPostId,
  PostPosition,
  UserInfos,
  UserNameFind,
} from '@/common/interfaces/response'
import { unescapeSubject } from '@/utils/htmlEscape'
import request, { commonUrl } from '@/utils/request'

import { makeThreadTypesMap } from '../common'

export const kPostPageSize = 20

/** 获取帖子详情信息 */
export const getThreadsInfo = async ({
  thread_id,
  page,
  author_id,
  order_type,
  thread_details,
  forum_details,
}: {
  thread_id: string
  page?: number
  author_id?: number
  order_type?: string
  thread_details?: boolean
  forum_details?: boolean
}) => {
  const result = await request.get<PostDetails>(
    `${commonUrl}/view/post/details`,
    {
      params: {
        thread_id: thread_id,
        page: page || 1,
        author_id: author_id,
        order_type:
          order_type == 'reverse' ? 1 : order_type == 'forward' ? 2 : null,
        thread_details: thread_details ? 1 : 0,
        forum_details: forum_details ? 1 : 0,
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
  return request.post(`${commonUrl}/post/thread`, {
    ...details,
  })
}

export type ReplyThreadDetails = PostCommonDetails & {
  thread_id: number
  post_id?: number
}

export const replyThreads = (details: ReplyThreadDetails) => {
  return request.post<PostDetails>(`${commonUrl}/post/post`, {
    ...details,
    format: 2,
  })
}

export const getPostDetails = (params: {
  commentPids?: number[]
  ratePids?: number[]
  page?: number
}) => {
  return request.get<PostDetailsByPostId>(`${commonUrl}/post/details`, {
    params: {
      comment_pids: (params.commentPids || []).join(','),
      rate_pids: (params.ratePids || []).join(','),
      page: params.page,
    },
  })
}

export const votePost = (params: {
  tid?: number
  pid?: number
  support: boolean
}) => {
  return request.post<boolean>(`${commonUrl}/post/vote`, undefined, {
    params,
  })
}

export const findPost = (post_id: string, thread_id?: string) => {
  return request.get<PostPosition>(`${commonUrl}/post/find`, {
    params: {
      tid: thread_id,
      pid: post_id,
    },
  })
}

/** 获取用户信息 */
export const getUserInfo = (uid: number) => {
  return request.get<UserInfos>(`${commonUrl}/view/profile/` + uid)
}

/** 模糊查询用户名 */
export const getUsername = (key: string) => {
  return request.get<UserNameFind>(
    `${commonUrl}/global/search/at?username=${key}&page=${1}&pagesize=${20}`
  )
}
