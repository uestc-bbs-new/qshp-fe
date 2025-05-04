import { User } from '@/common/interfaces/base'

import request, { commonUrl } from './request'

export type SecuritySettings = {
  email: string
  bind_status: number
  bind_users?: User[]
}

export const kStatusUnbound = 0
export const kStatusBindNormal = 1
export const kStatusBindMustRenew = 2

export const getSecuritySettings = () =>
  request.get<SecuritySettings>(`${commonUrl}/user/security`)
