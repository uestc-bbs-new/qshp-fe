// TODO: How to take the @ user information to request?
import { uploadAttachment } from '@/apis/common'
import { getAtList } from '@/apis/thread'
import defaultAvatar from '@/assets/avatar-default.png'
import { Attachment, UploadResponse } from '@/common/interfaces/base'
import { middleLink } from '@/utils/avatarLink'
import { html } from '@/utils/html'

import { customRenderers } from '../../../../markdown-renderer/src/renderer/renderer'
import { VditorContext } from '../../../../markdown-renderer/src/renderer/types'
import {
  common,
  commonEmojiPath,
} from '../../../../markdown-renderer/src/renderer/vditorConfig'

const supportedImageExtensions = [
  'jpg',
  'jpeg',
  'jpe',
  'png',
  'gif',
  'heic',
  'heif',
]

const getFileExtension = (fileName: string) =>
  (fileName.match(/\.([0-9a-z]+)$/i) || [])[1]?.toLowerCase()

const isFileImage = (fileName: string) =>
  supportedImageExtensions.includes(getFileExtension(fileName))

const getMarkdownFromAttachment = (item: Attachment) => {
  if (isFileImage(item.filename)) {
    return `![${item.filename}](i:${item.attachment_id})`
  }
  return `[${item.filename}](a:${item.attachment_id})`
}

function options({
  smilyToolbarItem,
  fullscreenToolbarItem,
  context,
}: {
  smilyToolbarItem?: IMenuItem
  fullscreenToolbarItem?: IMenuItem
  context?: VditorContext
}): IOptions {
  return {
    ...common,
    luteRenderers: {
      SpinVditorDOM: customRenderers('SpinVditorDOM', context),
      SpinVditorIRDOM: customRenderers('SpinVditorIRDOM', context),
      SpinVditorSVDOM: customRenderers('SpinVditorSVDOM', context),
      Md2VditorDOM: customRenderers('Md2VditorDOM', context),
      Md2VditorIRDOM: customRenderers('Md2VditorIRDOM', context),
      Md2HTML: customRenderers('Md2HTML', context),
    },
    cache: { enable: false },
    // change the z-index due to the mui base z-index = 1200
    fullscreen: { index: 1202 },
    tab: '\t',
    hint: {
      ...commonEmojiPath,
      extend: [
        {
          key: '@',
          hint: async (key: string) => {
            const result = await getAtList(key)
            const list = [
              ...(result.exact_match ? [result.exact_match] : []),
              ...(result.rows || []),
            ]
            return list.map((item) => {
              return {
                html: html`<div class="editor-at-list-item">
                  <img
                    src="${middleLink(item.uid)}"
                    class="editor-at-list-avatar"
                    onerror="this.src='${defaultAvatar}'"
                  />
                  <span class="editor-at-list-username">${item.username}</span>
                </div>`,
                value: `[@${item.username.trim()}](at:${item.uid})`,
              }
            })
          },
        },
      ],
    },
    upload: {
      accept: [
        'png',
        'jpg',
        'jpe',
        'jpeg',
        'gif',
        'heic',
        'heif',
        'zip',
        'rar',
        'tar',
        'gz',
        'xz',
        'bz2',
        '7z',
        'flv',
        'mp3',
        'mp4',
        'pdf',
        'caj',
        'ppt',
        'pptx',
        'doc',
        'docx',
        'xls',
        'xlsx',
        'txt',
        'apk',
        'ipa',
        'crx',
      ]
        .map((ext) => `.${ext}`)
        .join(','),
      async customUploader(files, _, onProgress) {
        const totalSize =
          files.reduce((totalSize, file) => totalSize + file.size, 0) || 1
        const allResult: UploadResponse = {
          uploaded: [],
          errors: [],
        }
        for (const file of files) {
          try {
            const result = await uploadAttachment(
              'forum',
              isFileImage(file.name) ? 'image' : 'file',
              [file],
              (status) => {
                status.progress &&
                  onProgress((status.progress * file.size) / totalSize)
              }
            )
            if (result.uploaded?.length) {
              allResult.uploaded?.push(...result.uploaded)
            } else if (result.errors?.length) {
              allResult.errors?.push(...result.errors)
            }
          } catch (_) {
            allResult.errors?.push({ filename: file.name, size: file.size })
          }
        }
        return allResult
      },
      customUploaderCompleted(
        data: unknown,
        _: IVditor,
        errorCallback: (html?: string) => void
      ) {
        const response = data as UploadResponse
        if (response.uploaded?.length) {
          context?.attachments?.push(...response.uploaded)
          if (context?.onUpdateAttachments) {
            context.onUpdateAttachments(
              context.attachments ? [...context.attachments] : undefined
            )
          }
          context?.vditor?.insertValue(
            response.uploaded
              .map((item) => getMarkdownFromAttachment(item))
              .join('\n')
          )
        }
        if (response.errors?.length) {
          errorCallback(
            `<ul>${response.errors
              .map((item) => html`<li>${item.filename} 上传失败！</li>`)
              .join('')}</ul>`
          )
        }
      },
      filename(name) {
        return name
          .replace(/[^(a-zA-Z0-9\u4e00-\u9fa5\\.)]/g, '')
          .replace(/[\\?\\/:|<>\\*\\[\]\\(\\)\\$%\\{\\}@~]/g, '')
          .replace('/\\s/g', '')
      },
    },
    counter: {
      enable: true,
      type: 'text',
    },

    toolbar: [
      'headings',
      'bold',
      'italic',
      'strike',
      '|',
      ...(smilyToolbarItem ? [smilyToolbarItem] : ['emoji']),
      'link',
      'upload',
      'quote',
      'code',
      '|',
      'list',
      'ordered-list',
      'check',
      'table',
      'line',
      'outdent',
      'indent',
      'inline-code',
      'insert-after',
      'insert-before',
      '|',
      'undo',
      'redo',
      'outline',
      'edit-mode',
      ...(fullscreenToolbarItem ? [fullscreenToolbarItem] : ['fullscreen']),
    ],
  }
}

export default options
