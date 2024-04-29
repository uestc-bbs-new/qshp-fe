import request, { commonUrl } from '@/apis/request'
import { SystemSettings, SystemSettingsKey } from '@/common/interfaces/system'

export const getSystemSettings = (
  key: SystemSettingsKey | 'all',
  version?: number
) =>
  request.get<SystemSettings>(
    `${commonUrl}/system/settings/${key}${version ? '/' + version : ''}`
  )
