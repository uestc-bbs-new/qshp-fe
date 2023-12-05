import axios from 'axios'

const baseUrl = (import.meta.env.PROD ? '' : '/dev') + '/'
const commonUrl = '/star/api/forum/v1'

const apiResultCode = {
  success: 0,
}
const kHttpUnauthorized = 401

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

// Export window.api for easier testing in development
if (import.meta.env.DEV) {
  interface WindowExtension extends Window {
    api: any
  }
  ;(window as unknown as WindowExtension).api = service
}

export default service
export { authService, apiResultCode, kHttpUnauthorized, commonUrl }
