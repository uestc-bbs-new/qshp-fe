import { useQuery } from '@tanstack/react-query'
import { createStore, del, get, set } from 'idb-keyval'

import { useEffect, useRef } from 'react'

import { getSystemSettings } from '@/apis/system'
import { UserFrontendSettings } from '@/apis/types/user'
import {
  Medal,
  SystemSettings,
  SystemSettingsKey,
} from '@/common/interfaces/system'

import { globalCache } from '.'

const store = createStore('newbbs-cached-settings', 'cache')

const kSystemSettingsVersion = '_version'

let currentVersion: number | undefined

let isDeveloperFlag = import.meta.env.DEV
export const setDeveloper = () => (isDeveloperFlag = true)
export const isDeveloper = () => isDeveloperFlag

export const updateSystemSettingsVersion = async (version: number) => {
  if (version != currentVersion) {
    await set(kSystemSettingsVersion, version, store)
    currentVersion = version
  }
}

type CachedValue = {
  _systemVersion?: number
  _version?: number
  value: any
}

const fetchPromise: { [key in SystemSettingsKey]?: Promise<SystemSettings> } =
  {}

const getFromCache = async (key: SystemSettingsKey) => {
  const cachedValue = await get<CachedValue>(key, store)
  if (cachedValue && cachedValue._systemVersion == currentVersion) {
    return cachedValue.value
  }
  let result = undefined
  if (!fetchPromise[key]) {
    fetchPromise[key] = getSystemSettings(key, cachedValue?._version)
  }
  result = await fetchPromise[key]
  if (result && result[key]) {
    const newValue = {
      _systemVersion: currentVersion,
      _version: result[key]?.version,
      value: result[key]?.value,
    }
    await set(key, newValue, store)
  }
  return (result && result[key]?.value) || cachedValue?.value
}

export const getMedals = async () => {
  return ((await getFromCache('medals')) || []) as Medal[]
}

export const useMedals = () => {
  const previousVersion = useRef(currentVersion)
  const { data, refetch } = useQuery({
    queryKey: ['medalList'],
    queryFn: async () => {
      const medalList = await getMedals()
      previousVersion.current = currentVersion
      if (medalList) {
        globalCache.medalMap = Object.fromEntries(
          medalList.map((medal) => [medal.id, medal])
        )
        globalCache.medalList = medalList
      }
      return {
        medalList: globalCache.medalList,
        medalMap: globalCache.medalMap,
      }
    },
    initialData: {
      medalList: globalCache.medalList,
      medalMap: globalCache.medalMap,
    },
    staleTime: Infinity,
    enabled: !globalCache.medalList,
  })
  useEffect(() => {
    if (previousVersion.current != currentVersion || !globalCache.medalList) {
      refetch()
    }
  }, [currentVersion])
  return data
}

const kUserFrontendCache = '_user_frontend'
type UserFrontendCache = {
  _version: number
  _uid: number
  value: UserFrontendSettings
}
let currentUserFrontendCache: UserFrontendCache | undefined
let userFrontendCacheInitialized = false

export const initUserFrontendCache = async () => {
  if (!userFrontendCacheInitialized) {
    const result = await get<UserFrontendCache>(kUserFrontendCache, store)
    userFrontendCacheInitialized = true
    return result
  }
}
initUserFrontendCache()
export const getCachedUserFrontendSettings = (uid: number) => {
  if (currentUserFrontendCache?._uid == uid) {
    return currentUserFrontendCache
  }
}
export const getUserFrontendCache = async (uid: number) => {
  if (userFrontendCacheInitialized) {
    return getCachedUserFrontendSettings(uid)
  } else {
    const result = await initUserFrontendCache()
    if (uid == result?._uid) {
      currentUserFrontendCache = result
      return result
    }
  }
}
export const updateUserFrontendCache = async (
  uid: number,
  version: number,
  value: UserFrontendSettings
) => {
  const cachedValue = {
    _version: version,
    _uid: uid,
    value,
  }
  await set(kUserFrontendCache, cachedValue, store)
  currentUserFrontendCache = cachedValue
}
export const deleteUserFrontendCache = async () => {
  await del(kUserFrontendCache, store)
  currentUserFrontendCache = undefined
}

const init = async () => {
  const version = await get(kSystemSettingsVersion, store)
  if (version) {
    currentVersion = version
  }
}
init()
