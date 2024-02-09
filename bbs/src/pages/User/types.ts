import { CommonQueryParams, User } from '@/apis/user'
import { CommonUserQueryRpsoense } from '@/common/interfaces/user'

export type UserQuery = User &
  Pick<CommonQueryParams, 'removeVisitLog' | 'admin'>
export type AdditionalQueryOptions = Pick<
  CommonQueryParams,
  'getUserSummary' | 'getRecentVisitors'
>

export type SubPageCommonProps = {
  userQuery: UserQuery
  queryOptions: AdditionalQueryOptions
  onLoad?: (data: CommonUserQueryRpsoense) => void
}

export type FriendUser = Required<User> & {
  note?: string
}
