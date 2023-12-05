import { AxiosInstance, AxiosResponse } from 'axios'

import { notifyUserCallbacks } from '@/states/user'
import { apiResultCode } from '@/utils/request'

export default (axios: AxiosInstance) =>
  axios.interceptors.response.use((response: AxiosResponse) => {
    if (response.data && response.data.code == apiResultCode.success) {
      notifyUserCallbacks(response.data.user)
    }
    return response
  })
