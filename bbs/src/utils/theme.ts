import { useEffect } from 'react'

import { Theme } from '@/states'

import { persistedStates } from './storage'

export const getRenderedTheme = () => {
  const setting = persistedStates.theme
  if (setting == 'light' || setting == 'dark') {
    return setting
  }
  return getSystemTheme()
}

export const getSystemTheme = () => {
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export const getTextFromThemeSetting = (setting: Theme | 'auto') => {
  if (setting == 'light') {
    return '浅色模式'
  }
  if (setting == 'dark') {
    return '深色模式'
  }
  return '跟随系统'
}

export const useSystemThemeChange = (
  callback: (theme: 'light' | 'dark') => void
) => {
  useEffect(() => {
    const match = matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      callback(e.matches ? 'dark' : 'light')
    }
    match.addEventListener('change', handler)
    return () => match.removeEventListener('change', handler)
  }, [])
}
