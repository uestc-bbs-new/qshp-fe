import { GenericList, ThreadInList } from '@/common/interfaces/response'
import { UserReply } from '@/common/interfaces/user'
import request, { commonUrl } from '@/utils/request'

type User = {
  uid?: number
  username?: string
}

type CommonQueryParams = User & {
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
  ...(common.removeVisitLog && { additional: 'removevlog' }),
  ...(common.admin && { a: '1' }),
})

export const getUserThreads = (common: CommonQueryParams, page?: number) =>
  request.get<GenericList<ThreadInList>>(`${getApiBase(common)}/threads`, {
    ...getCommonQueryParams(common),
    params: { page: page || 1 },
  })

export const getUserReplies = (common: CommonQueryParams, page?: number) =>
  request.get<GenericList<UserReply>>(`${getApiBase(common)}/replies`, {
    ...getCommonQueryParams(common),
    params: { page: page || 1 },
  })
