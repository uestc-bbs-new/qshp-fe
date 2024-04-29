import { AxiosInstance, AxiosResponse } from 'axios'

import { AxiosWrapper, apiResultCode } from '@/apis/request'
import { updateSystemSettingsVersion } from '@/states/settings'

export default (axios: AxiosInstance | AxiosWrapper) =>
  axios.interceptors.response.use((response: AxiosResponse) => {
    if (response.data?.code == apiResultCode.success && response.data.system) {
      if (response.data.system.settings_version) {
        updateSystemSettingsVersion(response.data.system.settings_version)
      }
    }
    return response
  })
