import { SystemSettings, SystemSettingsKey } from '@/common/interfaces/system'
import request, { commonUrl } from '@/utils/request'

export const getSystemSettings = (
  key: SystemSettingsKey | 'all',
  version?: number
) =>
  request.get<SystemSettings>(
    `${commonUrl}/system/settings/${key}${version ? '/' + version : ''}`
  )
