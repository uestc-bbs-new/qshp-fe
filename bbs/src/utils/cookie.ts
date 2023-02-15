import moment from 'moment'
import 'moment/dist/locale/zh-cn'

const checkCookie = () => {
  const baseCache = localStorage.getItem('base_cache')

  if (!baseCache) {
    return 0
  }

  const expireTime = JSON.parse(baseCache).expire

  if (moment(expireTime).isBefore(moment().add(1, 'h'))) {
    refreshCookie()
  }
}

const refreshCookie = () => {
  console.log('refreshCookie')
}

export { checkCookie }
