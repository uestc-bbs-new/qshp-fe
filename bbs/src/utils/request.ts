import axios, { AxiosResponse } from 'axios'

import { notifyUserCallbacks } from '@/states/user'

const baseUrl = (import.meta.env.PROD ? '' : '/dev') + '/'

const statusCode = {
  tokenExpire: 401,
  responseSuccess: 0,
}

/**
 * 错误处理
 * @param { number } status 状态码
 */
const errorHandle = (status: number, errorTest: string) => {
  switch (status) {
    case statusCode.tokenExpire:
      console.log(errorTest)
      break
    default:
      break
  }
}

/**
 * 创建axios实例
 * 设置请求超时 { timeout }
 */

const commonConfig = {
  baseURL: baseUrl,
}
const commonHeaders = {
  'Content-type': 'application/json',
}
const service = axios.create({
  ...commonConfig,
  headers: {
    ...commonHeaders,
  },
})

const authService = axios.create({
  ...commonConfig,
  headers: {
    ...commonHeaders,
    'X-UESTC-BBS': '1',
  },
})

/**
 * 请求拦截器
 * @param { object } config 请求参数
 */
service.interceptors.request.use(
  (config) => {
    config.headers['Authorization'] = localStorage.getItem(
      'newbbs_authorization'
    )
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

const commonResponseInterceptor = (response: AxiosResponse) => {
  const content = response.data
  notifyUserCallbacks(content.user)
  if (content.errcode === statusCode.responseSuccess) {
    return content.data
  } else {
    return content.data
  }
}

const commonResponseErrorInterceptor = (error: any) => {
  if (error) {
    if (error.response) {
      const httpError = {
        hasError: true,
        status: error.response.status,
        statusText: error.response.statusText,
      }
      errorHandle(httpError.status, httpError.statusText)
    } else {
      // show toast
    }
    return Promise.reject(error)
  } else {
    // show toast
  }
}

// /**
//  * 响应拦截器
//  * @param { object } response 响应参数
//  */
service.interceptors.response.use(
  commonResponseInterceptor,
  commonResponseErrorInterceptor
)
authService.interceptors.response.use(
  commonResponseInterceptor,
  commonResponseErrorInterceptor
)

if (import.meta.env.DEV) {
  interface WindowExtension extends Window {
    api: any
  }
  ;(window as unknown as WindowExtension).api = service
}

export default service
export { authService }
