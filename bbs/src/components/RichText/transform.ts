import DOMPurify from 'dompurify'

import { pages } from '@/utils/routes'
import siteRoot from '@/utils/siteRoot'
import { searchParamsExtract } from '@/utils/tools'

const transformLegacyLinks = (url: string) => {
  if (url.startsWith(`${siteRoot}/`)) {
    const parsed = new URL(url)
    if (parsed.pathname == '/forum.php') {
      switch (parsed.searchParams.get('mod')) {
        case 'viewthread': {
          const tid = parseInt(parsed.searchParams.get('tid') || '')
          if (tid) {
            return pages.thread(
              tid,
              searchParamsExtract(parsed.searchParams, ['page'])
            )
          }
        }
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

export const transformUserHtml = (html: string) => {
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
  return container.innerHTML
}
