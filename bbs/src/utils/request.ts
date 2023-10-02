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
    Authorization:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyMDY5MjUsInVzZXJuYW1lIjoiQWJyYUMiLCJ1c2VyX2dyb3VwIjoyNiwiYWRtaW5fZ3JvdXAiOjMsImV4dGVuZGVkX2dyb3VwcyI6WzI2LDNdLCJ2aWV3X2F1dGhvcml0aWVzIjpbMiwxNywyNSw0NSw0Niw1NSw2MSw2Niw3MCw3NCwxMTEsMTE0LDExNSwxMTgsMTIxLDEyOCwxMzgsMTQwLDE0OSwxNTIsMTU0LDE4MywxOTksMjA4LDIyNSwyMjksMjMzLDIzNiwyMzcsMjUyLDI1NSwzMDUsMzA5LDMxMiwzMjYsMzcwLDM4MiwzOTEsNDAzXSwiYXVkIjoid2ViIiwiZXhwIjoxNjk1NjI4MjU3LCJqdGkiOiIzMDA1MzEyMzU5MDQ1NTI5NyIsImlhdCI6MTY5MDQ0NDI1NywiaXNzIjoi5riF5rC05rKz55WU4oCU4oCU55S15a2Q56eR5oqA5aSn5a2m5a6Y5pa56K665Z2bIiwic3ViIjoiYWNjZXNzX3Rva2VuIn0.ozcDENGOCKW4yps8v7g6GSfmAHb22yzW-doUCd-Ec_g',
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
