import { AxiosInstance } from 'axios'

import { setAuthorizationHeader } from '@/utils/auth_header'
import { authService, commonUrl, kHttpUnauthorized } from '@/utils/request'

let adoptLegacyAttempted = false

let delayFurtherRequestsIInterceptorId: number | null = null
let attempting = false
let pendingPromise: Promise<void> | null = null

export default (axios: AxiosInstance) =>
  axios.interceptors.response.use(null, (error: any) => {
    if (error.response?.status === kHttpUnauthorized) {
      if (adoptLegacyAttempted) {
        return error
      }

      if (!attempting) {
        attempting = true
        pendingPromise = authService
          .post<object, string>(`${commonUrl}/auth/adoptLegacyAuth`)
          .then((authorization) => {
            setAuthorizationHeader(authorization)
            axios(error.response.config)
          })
          .catch(() => error.response)
          .finally(() => {
            axios.interceptors.request.eject(
              delayFurtherRequestsIInterceptorId as number
            )
            delayFurtherRequestsIInterceptorId = null
            attempting = false
            adoptLegacyAttempted = true
          })
        delayFurtherRequestsIInterceptorId = axios.interceptors.request.use(
          async (config) => {
            await pendingPromise?.catch(() => null)
            return config
          }
        )
        return pendingPromise
      }
    }
    return error
  })
