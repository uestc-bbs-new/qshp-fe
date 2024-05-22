import 'vditor/dist/index.css'
import Vditor from 'vditor/dist/method.min.js'

import { previewOptions } from '../../markdown-renderer/src/main'
import { Attachment } from '../../markdown-renderer/src/renderer/types'
import './extra.css'

declare global {
  interface Window {
    zoom: (
      img: HTMLImageElement,
      zimg: string,
      nocover: number,
      pn: number,
      showexif: string
    ) => void
  }
}

const kThumbPrefix = '/thumb'
const kForumAttachmentPrefix = '/data/attachment/forum/'

;[].forEach.call(
  document.querySelectorAll('#postlist table.plhin'),
  (post: Element) => {
    const content = post.querySelector('.post-message-markdown')
    if (!content) {
      return
    }
    const markdown = content.textContent || ''
    if (markdown) {
      const attachData = post.querySelector('.post-message-attachments')
        ?.textContent
      const attachments: Attachment[] = []
      if (attachData) {
        JSON.parse(attachData).map(
          (item: {
            aid: string
            dateline: string
            isimage: string
            attachment: string
            filename: string
            filesize: string
            downloadurl: string
          }) => {
            attachments.push({
              attachment_id: parseInt(item.aid),
              dateline: new Date(item.dateline).getTime() / 1000,
              is_image: parseInt(item.isimage),
              path:
                `${kThumbPrefix}${kForumAttachmentPrefix}` +
                item.attachment +
                '?variant=original',
              thumbnail_url:
                `${kThumbPrefix}${kForumAttachmentPrefix}` + item.attachment,
              raw_url: `${kForumAttachmentPrefix}` + item.attachment,
              download_url: item.downloadurl,
              filename: item.filename,
              size: parseInt(item.filesize),
            })
          }
        )
      }
      content.innerHTML = ''
      const inlineAttachments = new Set<number>()
      Vditor.preview(
        content,
        markdown,
        previewOptions({ mode: 'light', attachments, inlineAttachments })
      ).then(() => {
        inlineAttachments.forEach(
          (aid) => post.querySelector(`dl.tattl[data-aid="${aid}"]`)?.remove()
        )
        ;[].forEach.call(
          post.querySelectorAll('img.post_attachment_image'),
          (img: HTMLImageElement) => {
            img.classList.add('zoom')
            img.addEventListener('click', () =>
              window.zoom(
                img,
                img.getAttribute('data-x-fullsize-path') || img.src,
                0,
                0,
                '0'
              )
            )
          }
        )
      })
    }
  }
)
