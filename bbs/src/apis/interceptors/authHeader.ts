import { AxiosInstance } from 'axios'

import { AxiosWrapper } from '@/apis/request'
import { persistedStates } from '@/utils/storage'

export default (axios: AxiosInstance | AxiosWrapper) =>
  axios.interceptors.request.use((config) => {
    config.headers['Authorization'] = persistedStates.authorizationHeader
    return config
  })
