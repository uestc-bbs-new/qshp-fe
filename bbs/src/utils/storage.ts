import { TopListKey } from '@/common/interfaces/response'
import { Theme } from '@/states'

const setLocalStorage = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value)
    return true
  } catch (_) {
    return false
  }
}

const getLocalStorage = (key: string, defaultValue?: string) => {
  try {
    return localStorage.getItem(key) || defaultValue
  } catch (_) {
    return defaultValue
  }
}

const kAuthorizationKey = 'newbbs_authorization'
const kTheme = 'newbbs_theme'
const kTopListAsideLastTab = 'toplist_aside_last_tab'

export const persistedStates = {
  get topListAsideLastTab(): string | undefined {
    return getLocalStorage(kTopListAsideLastTab)
  },
  set topListAsideLastTab(value: TopListKey) {
    setLocalStorage(kTopListAsideLastTab, value)
  },
  get authorizationHeader(): string | undefined {
    return getLocalStorage(kAuthorizationKey)
  },
  set authorizationHeader(value: string) {
    setLocalStorage(kAuthorizationKey, value)
  },
  get theme() {
    const defaultValue: Theme = matchMedia('(prefers-color-scheme: dark)')
      .matches
      ? 'dark'
      : 'light'
    return getLocalStorage(kTheme, defaultValue) as Theme
  },
  set theme(value: Theme) {
    setLocalStorage(kTheme, value)
  },
}
