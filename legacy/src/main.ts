import 'vditor/dist/index.css'
import Vditor from 'vditor/dist/method.min.js'

import { previewOptions } from '../../markdown-renderer/src/main'
import { Attachment } from '../../markdown-renderer/src/renderer/types'

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
      Vditor.preview(
        content,
        markdown,
        previewOptions({ mode: 'light', attachments })
      )
    }
  }
)
