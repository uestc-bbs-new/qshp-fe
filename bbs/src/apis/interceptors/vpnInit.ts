import { initForVpnPromise } from '@/utils/vpn_cookie'

import { AxiosWrapper } from '../request'

let interceptors: { id: number; axios: AxiosWrapper }[] = []
export default (axios: AxiosWrapper) => {
  interceptors.push({
    axios,
    id: axios.interceptors.request.use(async (config) => {
      await initForVpnPromise
      console.log('vpn init interceptor awaited')
      return config
    }),
  })
}
initForVpnPromise.then(() => {
  interceptors.forEach((item) => item.axios.interceptors.request.eject(item.id))
  interceptors = []
})
