import request, { commonUrl } from '@/apis/request'
import { User } from '@/common/interfaces/base'
import { ThreadInList } from '@/common/interfaces/response'
import {
  CommonUserQueryRpsoense,
  UserComment,
  UserCommonList,
  UserFavoritesList,
  UserFriend,
  UserPostComment,
  UserProfile,
  UserReply,
} from '@/common/interfaces/user'
import { unescapeSubject } from '@/utils/htmlEscape'

export type CommonQueryParams = Partial<User> & {
  /** 是否获取用户概况（用户空间顶部显示的内容） */
  getUserSummary?: boolean
  /** 是否最近访客（用户空间右侧显示的内容） */
  getRecentVisitors?: boolean
  /** 是否删除访问记录 */
  removeVisitLog?: boolean
  admin?: boolean
}

export type UserThreadsFilter = {
  fid?: number
}

const userApiBase = `${commonUrl}/user`

const getApiBase = (user: Partial<User>) => {
  if (user.uid) {
    return `${userApiBase}/${user.uid}`
  }
  if (user.username) {
    return `${userApiBase}/name/${user.username}`
  }
  return `${userApiBase}/me`
}

const getCommonQueryParams = (common: CommonQueryParams) => ({
  ...(common.getUserSummary && { user_summary: '1' }),
  ...(common.getRecentVisitors && { visitors: '1' }),
  ...(common.removeVisitLog && { additional: 'removevlog' }),
  ...(common.admin && { a: '1' }),
})

export const getUserProfile = (common: CommonQueryParams) =>
  request.get<CommonUserQueryRpsoense & UserProfile>(
    `${getApiBase(common)}/profile`,
    { params: { ...getCommonQueryParams(common) } }
  )

export const getUserThreads = async (
  common: CommonQueryParams,
  page?: number,
  extra?: UserThreadsFilter
) => {
  const result = await request.get<UserCommonList<ThreadInList>>(
    `${getApiBase(common)}/threads`,
    {
      params: { ...getCommonQueryParams(common), page: page || 1, ...extra },
    }
  )
  result.rows.forEach(
    (thread) =>
      (thread.subject = unescapeSubject(thread.subject, thread.dateline, true))
  )
  return result
}

export const getUserReplies = async (
  common: CommonQueryParams,
  page?: number,
  extra?: UserThreadsFilter
) => {
  const result = await request.get<UserCommonList<UserReply>>(
    `${getApiBase(common)}/replies`,
    {
      params: { ...getCommonQueryParams(common), page: page || 1, ...extra },
    }
  )
  result.rows.forEach(
    (thread) =>
      (thread.subject = unescapeSubject(thread.subject, thread.dateline, true))
  )
  return result
}
export const getUserPostComments = async (
  common: CommonQueryParams,
  page?: number,
  extra?: UserThreadsFilter
) => {
  const result = await request.get<UserCommonList<UserPostComment>>(
    `${getApiBase(common)}/postcomments`,
    {
      params: {
        ...getCommonQueryParams(common),
        page: page || 1,
        ...extra,
      },
    }
  )
  result.rows.forEach(
    (thread) =>
      (thread.subject = unescapeSubject(thread.subject, thread.dateline, true))
  )
  return result
}
export const getUserComments = (common: CommonQueryParams, page?: number) =>
  request.get<UserCommonList<UserComment>>(`${getApiBase(common)}/comments`, {
    params: { ...getCommonQueryParams(common), page: page || 1 },
  })
export const addComment = (params: { uid: number; message: string }) =>
  request.post(`${userApiBase}/comment`, params)
export const editComment = (comment_id: number, params: { message: string }) =>
  request.patch(`${userApiBase}/comment/${comment_id}`, params)
export const deleteComment = (comment_id: number) =>
  request.delete(`${userApiBase}/comment/${comment_id}`)

export const getUserFriends = async (
  common: CommonQueryParams,
  page?: number,
  query?: string | null
) => {
  const result = await request.get<UserCommonList<UserFriend>>(
    `${getApiBase(common)}/friends`,
    {
      params: {
        ...getCommonQueryParams(common),
        page: page || 1,
        ...(query && { query }),
      },
    }
  )
  result.rows.forEach(
    (friend) =>
      friend.latest_thread &&
      (friend.latest_thread.subject = unescapeSubject(
        friend.latest_thread.subject,
        friend.latest_thread.dateline,
        true
      ))
  )
  return result
}
export const addFriend = (params: { uid: number; message?: string }) =>
  request.put(`${userApiBase}/friend`, params)
export const editFriend = (uid: number, params: { note: string }) =>
  request.patch(`${userApiBase}/friend/${uid}`, params)
export const deleteFriend = (uid: number) =>
  request.delete(`${userApiBase}/friend/${uid}`)

export const getUserFavorites = async (
  common: CommonQueryParams,
  page?: number,
  getCollections?: boolean
) => {
  const result = await request.get<UserFavoritesList>(
    `${getApiBase(common)}/favorites`,
    {
      params: {
        ...getCommonQueryParams(common),
        page: page || 1,
        collections: getCollections ? 1 : 0,
      },
    }
  )
  result.collections?.forEach(
    (collection) =>
      (collection.latest_thread.subject = unescapeSubject(
        collection.latest_thread.subject,
        collection.latest_thread.dateline,
        true
      ))
  )
  result.rows?.forEach(
    (favorite) =>
      favorite.thread_details &&
      (favorite.thread_details.subject = unescapeSubject(
        favorite.thread_details.subject,
        favorite.thread_details.dateline,
        true
      ))
  )
  return result
}
