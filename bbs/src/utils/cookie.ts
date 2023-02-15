import dayjs from 'dayjs/esm'

const checkCookie = () => {
  const baseCache = localStorage.getItem('base_cache')

  if (!baseCache) {
    return 0
  }

  const expireTime = JSON.parse(baseCache).expire

  if (dayjs(expireTime).isBefore(dayjs().add(1, 'h'))) {
    refreshCookie()
  }
}

const refreshCookie = () => {
  console.log('refreshCookie')
}

export { checkCookie }
