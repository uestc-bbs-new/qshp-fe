import { UserState } from '@/states/reducers/stateReducer'

export const getTotalMessages = (user: UserState) =>
  (user.new_notification ?? 0) +
  (user.new_pm_legacy ? 1 : 0) +
  (user.new_grouppm_legacy ? 1 : 0)
