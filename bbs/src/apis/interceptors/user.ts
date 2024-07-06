import { AxiosInstance, AxiosResponse } from 'axios'

import { AxiosWrapper, apiResultCode, kHttpUnauthorized } from '@/apis/request'
import { notifyUserCallbacks } from '@/states/user'

export default (axios: AxiosInstance | AxiosWrapper) =>
  axios.interceptors.response.use(
    (response: AxiosResponse) => {
      if (response.data?.code == apiResultCode.success) {
        notifyUserCallbacks({ user: response.data.user })
      }
      return response
    },
    (error: any) => {
      if (error.response?.status === kHttpUnauthorized) {
        notifyUserCallbacks({ user: undefined })
      }
      return Promise.reject(error)
    }
  )
