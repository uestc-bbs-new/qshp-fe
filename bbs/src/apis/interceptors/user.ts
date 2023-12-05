import { AxiosInstance, AxiosResponse } from 'axios'

import { notifyUserCallbacks } from '@/states/user'
import { apiResultCode, kHttpUnauthorized } from '@/utils/request'

export default (axios: AxiosInstance) =>
  axios.interceptors.response.use(
    (response: AxiosResponse) => {
      if (response.data?.code == apiResultCode.success) {
        notifyUserCallbacks(response.data.user)
      }
      return response
    },
    (error: any) => {
      if (error.response?.status === kHttpUnauthorized) {
        notifyUserCallbacks(undefined)
      }
      return Promise.reject(error)
    }
  )
