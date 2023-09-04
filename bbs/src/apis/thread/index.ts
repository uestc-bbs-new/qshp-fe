import { PostDetails } from '@/common/interfaces/response'
import request from '@/utils/request'

/** 获取帖子详情信息 */
export const getThreadsInfo = (thread_id: string, page = 1) => {
  return request.get<null, PostDetails>(
    `/star/api/forum/v1/view/post/details?thread_id=${thread_id}&page=${page}`
  )
}

// /** 获取帖子详情信息 */
// export const getThreadsInfo = (thread_id: string, page = 1) => {
//   return request.get<null, PostDetails>(
//     `/star/api/forum/v1/post/post`,
//   )
// }
