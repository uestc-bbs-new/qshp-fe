import DOMPurify from 'dompurify'

import { FontSizeVariant, mapLegacyFontSize } from '@/utils/bbcode/bbcode'

import {
  transformLegacyLinks,
  transformLink,
} from '../../../../markdown-renderer/src/utils/transform'

const kInternalUrlRegEx = /^(?:\/|https?:\/*bbs\.uestc\.edu\.cn)/
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
      const src = img.getAttribute('src')
      const url = transformLink(src, { image: true })
      if (url) {
        img.src = url
      } else if (!src?.match(kInternalUrlRegEx)) {
        img.referrerPolicy = 'no-referrer'
      }
    }
  )
  ;[].forEach.call(container.querySelectorAll('a'), (a: HTMLAnchorElement) => {
    const originalUrl = a.getAttribute('href')
    const url = transformLink(originalUrl) || originalUrl
    if (url) {
      a.href = transformLegacyLinks(url)
      if (!url.match(kInternalUrlRegEx)) {
        a.target = '_blank'
        a.rel = 'noopener'
      }
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
