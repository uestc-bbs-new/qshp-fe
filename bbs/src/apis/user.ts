import { ThreadInList } from '@/common/interfaces/response'
import {
  UserComment,
  UserCommonList,
  UserFriend,
  UserPostComment,
  UserReply,
} from '@/common/interfaces/user'
import request, { commonUrl } from '@/utils/request'

type User = {
  uid?: number
  username?: string
}

export type CommonQueryParams = User & {
  /** 是否获取用户概况（用户空间顶部显示的内容） */
  getUserSummary?: boolean
  /** 是否最近访客（用户空间右侧显示的内容） */
  getRecentVisitors?: boolean
  /** 是否删除访问记录 */
  removeVisitLog?: boolean
  admin?: boolean
}

const userApiBase = `${commonUrl}/user`

const getApiBase = (user: User) => {
  if (user.uid) {
    return `${userApiBase}/${user.uid}`
  }
  if (user.username) {
    return `${userApiBase}/name/${user.uid}`
  }
  return `${userApiBase}/me`
}

const getCommonQueryParams = (common: CommonQueryParams) => ({
  ...(common.getUserSummary && { user_summary: '1' }),
  ...(common.getRecentVisitors && { visitors: '1' }),
  ...(common.removeVisitLog && { additional: 'removevlog' }),
  ...(common.admin && { a: '1' }),
})

export const getUserThreads = (common: CommonQueryParams, page?: number) =>
  request.get<UserCommonList<ThreadInList>>(`${getApiBase(common)}/threads`, {
    ...getCommonQueryParams(common),
    params: { page: page || 1 },
  })

export const getUserReplies = (common: CommonQueryParams, page?: number) =>
  request.get<UserCommonList<UserReply>>(`${getApiBase(common)}/replies`, {
    ...getCommonQueryParams(common),
    params: { page: page || 1 },
  })

export const getUserPostComments = (common: CommonQueryParams, page?: number) =>
  request.get<UserCommonList<UserPostComment>>(
    `${getApiBase(common)}/postcomments`,
    {
      ...getCommonQueryParams(common),
      params: { page: page || 1 },
    }
  )

export const getUserComments = (common: CommonQueryParams, page?: number) =>
  request.get<UserCommonList<UserComment>>(`${getApiBase(common)}/comments`, {
    ...getCommonQueryParams(common),
    params: { page: page || 1 },
  })
export const addComment = (params: { uid: number; message: string }) =>
  request.post(`${userApiBase}/comment`, params)
export const editComment = (comment_id: number, params: { message: string }) =>
  request.patch(`${userApiBase}/comment/${comment_id}`, params)
export const deleteComment = (comment_id: number) =>
  request.delete(`${userApiBase}/comment/${comment_id}`)

export const getUserFriends = (common: CommonQueryParams, page?: number) =>
  request.get<UserCommonList<UserFriend>>(`${getApiBase(common)}/friends`, {
    ...getCommonQueryParams(common),
    params: { page: page || 1 },
  })
export const addFriend = (params: { uid: number; message: string }) =>
  request.put(`${userApiBase}/friend`, params)
export const editFriend = (uid: number, params: { note: string }) =>
  request.patch(`${userApiBase}/friend/${uid}`, params)
export const deleteFriend = (uid: number) =>
  request.delete(`${userApiBase}/friend/${uid}`)
