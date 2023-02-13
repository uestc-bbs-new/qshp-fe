import axios from 'axios'

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
const service = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-type': 'application/json',
  },
})

// /**
//  * 请求拦截器
//  * @param { object } config 请求参数
//  */
//  service.interceptors.request.use((config) => {
//     config.headers['access-token'] = sessionStorage.getItem('token')
//     return config
//   }, function (error) {
//     return Promise.reject(error)
//   })

// /**
//  * 响应拦截器
//  * @param { object } response 响应参数
//  */
service.interceptors.response.use(
  (response) => {
    const content = response.data
    if (content.errcode === statusCode.responseSuccess) {
      return content.data
    } else {
      return content.data
    }
  },
  (error) => {
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
)

export default service
