import { CommonQueryParams } from '@/apis/user'
import { User } from '@/common/interfaces/base'
import { CommonUserQueryRpsoense } from '@/common/interfaces/user'

export type UserQuery = Partial<User> &
  Pick<CommonQueryParams, 'removeVisitLog' | 'admin'>
export type AdditionalQueryOptions = Pick<
  CommonQueryParams,
  'getUserSummary' | 'getRecentVisitors'
>

export type SubPageCommonProps = {
  userQuery: UserQuery
  queryOptions: AdditionalQueryOptions
  onLoad?: (data: CommonUserQueryRpsoense) => void
  onError?: (e: any) => void
}

export type FriendUser = User & {
  note?: string
}
