import axios, {
  AxiosDefaults,
  AxiosInstance,
  AxiosInterceptorManager,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'

import registerAuthAdoptLegacyInterceptors from './interceptors/authAdoptLegacy'
import registerAuthHeaderInterceptors from './interceptors/authHeader'
import registerSystemInterceptors from './interceptors/system'
import registerUserInterceptors from './interceptors/user'

const baseUrl = (import.meta.env.PROD ? '' : '/dev') + '/'
const commonUrl = '/star/api/v1'

const apiResultCode = {
  success: 0,
}
const kHttpUnauthorized = 401

interface CommonResponse {
  code: number
  message: string
  data: any
}

function transformAxiosResponse<T = any, D = any>(
  response: Promise<AxiosResponse<T, D>>
): Promise<T> {
  return response
    .catch((error: any) => {
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
    .then((response: AxiosResponse<T, D>) => {
      const data = response.data as CommonResponse | undefined
      if (data?.code === apiResultCode.success) {
        return data.data
      } else {
        return Promise.reject({
          type: 'api',
          code: data?.code,
          message: data?.message,
          details: data,
        })
      }
    })
}

class AxiosWrapper {
  axios: AxiosInstance
  defaults: AxiosDefaults
  interceptors: {
    request: AxiosInterceptorManager<InternalAxiosRequestConfig>
    response: AxiosInterceptorManager<AxiosResponse>
  }
  constructor(axios: AxiosInstance) {
    this.axios = axios
    this.defaults = axios.defaults
    this.interceptors = axios.interceptors
  }
  getUri(config?: AxiosRequestConfig): string {
    return this.axios.getUri(config)
  }
  request<T = any, D = any>(config: AxiosRequestConfig<D>): Promise<T> {
    return transformAxiosResponse<T, D>(
      this.axios.request<T, AxiosResponse<T, D>, D>(config)
    )
  }
  get<T = any, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>
  ): Promise<T> {
    return transformAxiosResponse<T, D>(
      this.axios.get<T, AxiosResponse<T, D>>(url, config)
    )
  }
  delete<T = any, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>
  ): Promise<T> {
    return transformAxiosResponse<T, D>(
      this.axios.delete<T, AxiosResponse<T, D>>(url, config)
    )
  }
  head<T = any, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>
  ): Promise<T> {
    return transformAxiosResponse<T, D>(
      this.axios.head<T, AxiosResponse<T, D>>(url, config)
    )
  }
  options<T = any, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>
  ): Promise<T> {
    return transformAxiosResponse<T, D>(
      this.axios.options<T, AxiosResponse<T, D>>(url, config)
    )
  }
  post<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<T> {
    return transformAxiosResponse<T, D>(
      this.axios.post<T, AxiosResponse<T, D>>(url, data, config)
    )
  }
  put<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<T> {
    return transformAxiosResponse<T, D>(
      this.axios.put<T, AxiosResponse<T, D>>(url, data, config)
    )
  }
  patch<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<T> {
    return transformAxiosResponse<T, D>(
      this.axios.patch<T, AxiosResponse<T, D>>(url, data, config)
    )
  }
  postForm<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<T> {
    return transformAxiosResponse<T, D>(
      this.axios.postForm<T, AxiosResponse<T, D>>(url, data, config)
    )
  }
  putForm<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<T> {
    return transformAxiosResponse<T, D>(
      this.axios.putForm<T, AxiosResponse<T, D>>(url, data, config)
    )
  }
  patchForm<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<T> {
    return transformAxiosResponse<T, D>(
      this.axios.patchForm<T, AxiosResponse<T, D>>(url, data, config)
    )
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
const service = new AxiosWrapper(
  axios.create({
    ...commonConfig,
    headers: {
      ...commonHeaders,
    },
  })
)

const authConfig = {
  ...commonConfig,
  headers: {
    ...commonHeaders,
    'X-UESTC-BBS': '1',
  },
}

const authService = new AxiosWrapper(axios.create(authConfig))
const authServiceWithUser = new AxiosWrapper(axios.create(authConfig))

registerAuthHeaderInterceptors(service)
registerAuthAdoptLegacyInterceptors(service.axios)
registerUserInterceptors(service)
registerUserInterceptors(authServiceWithUser)
registerSystemInterceptors(service)
registerSystemInterceptors(authServiceWithUser)

// Export window.api for easier testing in development
if (import.meta.env.DEV) {
  interface WindowExtension extends Window {
    api: any
  }
  ;(window as unknown as WindowExtension).api = service
}

export default service
export {
  authService,
  authServiceWithUser,
  apiResultCode,
  kHttpUnauthorized,
  commonUrl,
  AxiosWrapper,
}
