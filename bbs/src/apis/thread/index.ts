import { PostDetails } from '@/common/interfaces/response'
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
  post_id = 1,
  message: string
) => {
  return request.post<null, PostDetails>(`/star/api/forum/v1/post/post`, {
    thread_id,
    post_id,
    message,
    is_markdown: 1,
  })
}
