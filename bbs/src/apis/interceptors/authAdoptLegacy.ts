import { AxiosInstance, AxiosResponse } from 'axios'

import {
  apiResultCode,
  authServiceWithUser,
  commonUrl,
  kHttpUnauthorized,
} from '@/apis/request'
import { notifyUserCallbacks } from '@/states/user'
import { persistedStates } from '@/utils/storage'

let adoptLegacyAttempted = false

let delayFurtherRequestsIInterceptorId: number | null = null
let attempting = false
let pendingPromise: Promise<void> | null = null

const adoptLegacyAuth = (axios: AxiosInstance) => {
  if (adoptLegacyAttempted) {
    return Promise.reject()
  }

  if (!attempting) {
    attempting = true
    pendingPromise = authServiceWithUser
      .post<string>(`${commonUrl}/auth/adoptLegacyAuth`)
      .then((authorization) => {
        persistedStates.authorizationHeader = authorization
      })
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
    return pendingPromise.catch(() => Promise.reject())
  }
  return Promise.reject()
}

export default (axios: AxiosInstance) =>
  axios.interceptors.response.use(
    (response: AxiosResponse) => {
      if (
        response.data?.code == apiResultCode.success &&
        !response.data?.user
      ) {
        return adoptLegacyAuth(axios).then(
          () => axios(response.config),
          () => response
        )
      }
      return response
    },
    (error: any) => {
      if (error.response?.status === kHttpUnauthorized) {
        return adoptLegacyAuth(axios)
          .catch(() => {
            notifyUserCallbacks({ requireSignIn: true })
            return Promise.reject(error)
          })
          .then(() => axios(error.response.config))
      }
      return Promise.reject(error)
    }
  )
