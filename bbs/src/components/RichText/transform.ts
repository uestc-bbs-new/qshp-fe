import DOMPurify from 'dompurify'

import { FontSizeVariant, mapLegacyFontSize } from '@/utils/bbcode/bbcode'
import { pages } from '@/utils/routes'
import siteRoot from '@/utils/siteRoot'
import { searchParamsExtract } from '@/utils/tools'

const transformLegacyLinks = (url: string) => {
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

const transformLink = (url?: string | null) => {
  if (!url) {
    return
  }
  if (!url.match(/^(?:\/|https?:)/i)) {
    return `${siteRoot}/${url}`
  }
  const match = url.match(
    /^(https?:\/*)(bbs\.uestc\.edu\.cn|bbs\.stuhome\.net|ibm\.anlove\.me|bbs\.anlove\.me|bbs\.auxten\.com|bbs\.qshpan\.com|bbs\.stuhome\.com|bbs\.tangdg\.info|bbs\.germanyt\.com|bbs\.watermen\.net|bbs\.uestc6\.edu\.cn)(\/*.*)/i
  )
  if (match) {
    return `${siteRoot}${match[3]}`
  }
}

export const transformUserHtml = (
  html: string,
  normalizeLegacyFontSize?: boolean,
  sizeVariant?: FontSizeVariant
) => {
  const container = document.createElement('div')
  container.innerHTML = DOMPurify.sanitize(html)
  ;[].forEach.call(
    container.querySelectorAll('img'),
    (img: HTMLImageElement) => {
      const url = transformLink(img.getAttribute('src'))
      if (url) {
        img.src = url
      }
    }
  )
  ;[].forEach.call(container.querySelectorAll('a'), (a: HTMLAnchorElement) => {
    const originalUrl = a.getAttribute('href')
    const url = transformLink(originalUrl) || originalUrl
    if (url) {
      a.href = transformLegacyLinks(url)
    }
  })
  if (normalizeLegacyFontSize) {
    ;[].forEach.call(
      container.querySelectorAll('font'),
      (font: HTMLElement) => {
        const size = font.getAttribute('size')
        if (size) {
          font.removeAttribute('size')
          font.style.fontSize = mapLegacyFontSize(size, sizeVariant)
        }
      }
    )
  }
  return container.innerHTML
}
