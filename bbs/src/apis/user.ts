import { ThreadInList } from '@/common/interfaces/response'
import {
  UserCommonList,
  UserPostComment,
  UserReply,
} from '@/common/interfaces/user'
import request, { commonUrl } from '@/utils/request'

type User = {
  uid?: number
  username?: string
}

type CommonQueryParams = User & {
  /** 是否获取用户概况（用户空间顶部显示的内容） */
  getUserSummary?: boolean
  /** 是否最近访客（用户空间右侧显示的内容） */
  getRecentVisitors?: boolean
  /** 是否删除访问记录 */
  removeVisitLog?: boolean
  admin?: boolean
}

const getApiBase = (user: User) => {
  if (user.uid) {
    return `${commonUrl}/user/${user.uid}`
  }
  if (user.username) {
    return `${commonUrl}/user/name/${user.uid}`
  }
  return `${commonUrl}/user/me`
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
