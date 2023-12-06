import { AxiosInstance } from 'axios'

import { getAuthorizationHeader } from '@/utils/auth_header'
import { AxiosWrapper } from '@/utils/request'

export default (axios: AxiosInstance | AxiosWrapper) =>
  axios.interceptors.request.use((config) => {
    config.headers['Authorization'] = getAuthorizationHeader()
    return config
  })
