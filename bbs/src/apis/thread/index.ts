import { PostDetails, UserInfos } from '@/common/interfaces/response'
import request from '@/utils/request'

/** 获取帖子详情信息 */
export const getThreadsInfo = (thread_id: string, page = 1) => {
  return request.get<null, PostDetails>(
    `/star/api/forum/v1/view/post/details?thread_id=${thread_id}&page=${page}`
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
    is_markdown: 1,
  })
}

/** 获取用户信息 */
export const getUserInfo = (uid: number) => {
  return request.get<null, UserInfos>(`/star/api/forum/v1/view/profile/` + uid)
}
