import { CommonQueryParams, User } from '@/apis/user'

export type UserQuery = User &
  Pick<CommonQueryParams, 'removeVisitLog' | 'admin'>
export type AdditionalQueryOptions = Pick<
  CommonQueryParams,
  'getUserSummary' | 'getRecentVisitors'
>
