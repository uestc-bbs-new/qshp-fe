import { searchParamsExtract } from './misc'
import { pages } from './routes'
import siteRoot from './siteRoot'

export const transformLegacyLinks = (url: string) => {
  if (url.startsWith(`${siteRoot}/`)) {
    let parsed: URL
    try {
      parsed = new URL(url, location.origin)
    } catch (_) {
      return url
    }
    if (parsed.pathname == '/forum.php') {
      switch (parsed.searchParams.get('mod')) {
        case 'viewthread':
          {
            const tid = parseInt(parsed.searchParams.get('tid') || '')
            if (tid) {
              return pages.thread(
                tid,
                searchParamsExtract(parsed.searchParams, ['page'])
              )
            }
          }
          break
        case 'redirect':
          {
            const tid = parseInt(parsed.searchParams.get('ptid') || '')
            const pid = parseInt(parsed.searchParams.get('pid') || '')
            if (pid) {
              return pages.goto(pid)
            }
            if (tid) {
              return pages.thread(tid)
            }
          }
          break
        case 'forumdisplay':
          {
            const fid = parseInt(parsed.searchParams.get('fid') || '')
            let page = parseInt(parsed.searchParams.get('page') || '') || 1
            if (fid) {
              const q = new URLSearchParams()
              if (page > 1) {
                page = (page - 1) * 6 + 1
                q.set('page', page.toString())
              }
              return pages.forum(fid, q)
            }
          }
          break
      }
    }
    if (parsed.pathname == '/read.php') {
      const tid = parseInt(parsed.searchParams.get('tid') || '')
      if (tid) {
        return pages.thread(
          tid,
          searchParamsExtract(parsed.searchParams, ['page'])
        )
      }
    }
    if (parsed.pathname == '/home.php') {
      switch (parsed.searchParams.get('mod')) {
        case 'space':
          {
            const uid = parseInt(parsed.searchParams.get('uid') || '')
            const username = parsed.searchParams.get('username') || undefined
            if (uid || username) {
              return pages.user({ uid, username })
            }
          }
          break
      }
    }
  }
  return url
}

export const transformLink = (
  url?: string | null,
  options?: { image?: boolean }
) => {
  if (!url) {
    return
  }
  const regex = options?.image
    ? /^(?:\/|https?:|data:)/i
    : /^(?:\/|https?:|mailto:|tel:)/i
  if (!url.match(regex)) {
    return `${siteRoot}/${url}`
  }
  const match = url.match(
    /^(https?:\/*)(bbs\.uestc\.edu\.cn|bbs-uestc-edu-cn-s\.vpn\.uestc\.edu\.cn(?::8118)?|bbs\.stuhome\.net|ibm\.anlove\.me|bbs\.anlove\.me|bbs\.auxten\.com|bbs\.qshpan\.com|bbs\.stuhome\.com|bbs\.tangdg\.info|bbs\.germanyt\.com|bbs\.watermen\.net|bbs\.uestc6\.edu\.cn)(\/*.*)/i
  )
  if (match) {
    return `${siteRoot}${match[3]}`
  }
}
