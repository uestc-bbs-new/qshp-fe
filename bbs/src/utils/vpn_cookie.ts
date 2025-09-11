import { isVpnProxy } from './siteRoot'

const kIdbName = 'newbbs_webvpn_cookie_tjufo823'
const kAesKey = 'tsn/0[9)8g6%PpuhRSG&ypTCCNS*LyGT'
const kAesIv = 'nni.u/0ip0,.90p9'
const kOldAuth = 'v3hW_2132_auth'
const kNewAuth = 'newbbs_auth'
const kWellknownCookies = [kNewAuth, kOldAuth, 'v3hW_2132_saltkey']
const kIndicationCookie = 'webvpn_auth_time'
const kIdbStore = 'kv'
const kIdbKey = 'cookies'

let idb: IDBDatabase
const initKv = () =>
  new Promise<void>((resolve, reject) => {
    const openReq = indexedDB.open(kIdbName, 1)
    openReq.onupgradeneeded = (_) => {
      idb = openReq.result
      idb.createObjectStore('kv')
    }
    openReq.onsuccess = (_) => {
      idb = openReq.result
      resolve()
    }
    openReq.onerror = (e) => reject(e)
  })
const kvGet = (k: string) =>
  new Promise((resolve, reject) => {
    const req = idb.transaction(kIdbStore).objectStore(kIdbStore).get(k)
    req.onsuccess = (e) => resolve(req.result)
    req.onerror = (e) => reject(e)
  })
const kvSet = (k: string, v: any) =>
  new Promise((resolve, reject) => {
    const req = idb
      .transaction(kIdbStore, 'readwrite')
      .objectStore(kIdbStore)
      .put(v, k)
    req.onsuccess = (_) => resolve(req.result)
    req.onerror = (e) => reject(e)
  })
const kvDel = (k: string) =>
  new Promise((resolve, reject) => {
    const req = idb
      .transaction(kIdbStore, 'readwrite')
      .objectStore(kIdbStore)
      .delete(k)
    req.onsuccess = (_) => resolve(req.result)
    req.onerror = (e) => reject(e)
  })

let key: CryptoKey
const enc = new TextEncoder()
const initCrypto = async () => {
  key = await crypto.subtle.importKey(
    'raw',
    enc.encode(kAesKey),
    { name: 'AES-CBC' },
    true,
    ['encrypt', 'decrypt']
  )
}
const encrypt = async (value: string) => {
  return btoa(
    String.fromCharCode(
      ...new Uint8Array(
        await crypto.subtle.encrypt(
          {
            name: 'AES-CBC',
            iv: enc.encode(kAesIv),
          },
          key,
          enc.encode(value)
        )
      )
    )
  )
}
const decrypt = async (value: string) => {
  const binary = atob(value)
  const data = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; ++i) {
    data[i] = binary.charCodeAt(i)
  }
  return new TextDecoder().decode(
    await crypto.subtle.decrypt(
      { name: 'AES-CBC', iv: enc.encode(kAesIv) },
      key,
      data
    )
  )
}

type SavedCookies = { expiration: number; data: string }

const getCookies = () => {
  const cookies = Object.fromEntries(
    document.cookie
      .split(/;\s*/)
      .map((x) => x.split('=', 2).map((x) => decodeURIComponent(x)))
  )
  const wellknownCookies = Object.fromEntries(
    Object.entries(cookies).filter((x) => kWellknownCookies.includes(x[0]))
  )
  return { cookies, wellknownCookies }
}

const initForVpn = async () => {
  indexedDB.deleteDatabase(kIdbName)
}
const initForVpnReal = async () => {
  await Promise.all([initCrypto(), initKv()])
  let savedCookies: SavedCookies | undefined = undefined
  try {
    const value = (await kvGet(kIdbKey)) as SavedCookies
    if (value) {
      savedCookies = Object.assign({}, value, {
        data: await decrypt(value.data),
      })
    }
  } catch (_) {
    console.log(_)
  }
  if (savedCookies) {
    if (savedCookies.expiration > Date.now() && savedCookies.data) {
      const { wellknownCookies } = getCookies()
      Object.entries(JSON.parse(savedCookies.data)).forEach(
        ([k, v]) =>
          (document.cookie =
            encodeURIComponent(k) +
            '=' +
            encodeURIComponent(v as string) +
            '; path=/')
      )
      if (!wellknownCookies[kOldAuth] && !wellknownCookies[kNewAuth]) {
        // do a ping request to refresh user
      }
    } else {
      await kvDel(kIdbKey)
    }
  }
  console.log('vpn init done')
}

export const initForVpnPromise = initForVpn()

export const saveCookiesForVpn = async () => {
  const { cookies, wellknownCookies } = getCookies()
  const indicationCookie = cookies[kIndicationCookie]
  if (indicationCookie) {
    const expiration = parseInt(indicationCookie)
    if (expiration == -1) {
      await kvDel(kIdbKey)
    } else {
      await kvSet(kIdbKey, {
        data: await encrypt(JSON.stringify(wellknownCookies)),
        expiration: Date.now() + expiration * 1000,
      })
    }
    document.cookie =
      kIndicationCookie + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/'
  }
}

export const clearSavedCookiesForVpn = async () => {
  await kvDel(kIdbKey)
}
