import { AxiosInstance } from 'axios'

import { getAuthorizationHeader } from '@/utils/auth_header'

export default (axios: AxiosInstance) =>
  axios.interceptors.request.use((config) => {
    config.headers['Authorization'] = getAuthorizationHeader()
    return config
  })
