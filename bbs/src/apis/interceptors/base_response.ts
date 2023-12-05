import { AxiosInstance, AxiosResponse } from 'axios'

import { apiResultCode } from '@/utils/request'

const registerFulfilledInterceptors = (axios: AxiosInstance) =>
  axios.interceptors.response.use((response: AxiosResponse) => {
    if (response.data?.code === apiResultCode.success) {
      return response.data.data
    } else {
      return Promise.reject({
        type: 'api',
        code: response.data.code,
        message: response.data.message,
        details: response.data,
      })
    }
  })
const registerRejectedInterceptors = (axios: AxiosInstance) =>
  axios.interceptors.response.use(null, (error: any) => {
    if (error) {
      if (error.response) {
        // HTTP 4xx/5xx status codes
        console.log('HTTP error from API', error)
        return Promise.reject({
          type: 'http',
          status: error.response.status,
          statusText: error.response.statusText,
          details: error,
        })
      } else {
        return Promise.reject({
          type: 'network',
          details: error,
        })
        // show toast
      }
    } else {
      console.error('Invalid API request', error)
      return Promise.reject({
        type: 'invalid',
        details: error,
      })
    }
  })

export { registerFulfilledInterceptors, registerRejectedInterceptors }
