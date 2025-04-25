import DOMPurify from 'dompurify'

import { FontSizeVariant, mapLegacyFontSize } from '@/utils/bbcode/bbcode'

import {
  transformLegacyLinks,
  transformLink,
} from '../../../../markdown-renderer/src/utils/transform'

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
      const url = transformLink(img.getAttribute('src'), { image: true })
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
      if (!url.match(/^(?:\/|https?:\/*bbs\.uestc\.edu\.cn)/)) {
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
