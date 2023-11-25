import {
  PostDetails,
  UserInfos,
  UserNameFind,
} from '@/common/interfaces/response'
import request from '@/utils/request'

/** 获取帖子详情信息 */
export const getThreadsInfo = (thread_id: string, page = 1, threadDetails = false) => {
  return request.get<null, PostDetails>(
    `/star/api/forum/v1/view/post/details`, {
      params: {
        thread_id,
        page,
        thread_details: threadDetails ? 1 : 0,
      },
    }
  )
}

/** 获取帖子详情信息 */
export const replyThreads = (
  thread_id: number,
  message: string,
  post_id?: number
) => {
  return request.post<null, PostDetails>(`/star/api/forum/v1/post/post`, {
    thread_id,
    post_id,
    message,
    format: 2,
  })
}

/** 获取用户信息 */
export const getUserInfo = (uid: number) => {
  return request.get<null, UserInfos>(`/star/api/forum/v1/view/profile/` + uid)
}

/** 模糊查询用户名 */
export const getUsername = (key: string) => {
  return request.get<null, UserNameFind>(
    `/star/api/forum/v1/global/search/at?username=${key}&page=${1}&pagesize=${20}`
  )
}
