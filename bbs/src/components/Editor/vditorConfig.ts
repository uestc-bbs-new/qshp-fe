// TODO: How to take the @ user information to request?
import { getAtList } from '@/apis/thread'
import { middleLink } from '@/utils/avatarLink'
import { html } from '@/utils/html'
import { persistedStates } from '@/utils/storage'

import { customRenderers } from '../RichText/renderer'
import { VditorContext } from '../RichText/types'
import { common, commonEmojiPath } from '../RichText/vditorConfig'

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
      accept: 'image/*,.mp3, .wav, .rar',
      url: '/dev/star/api/v1/attachment/upload',
      fieldName: 'files[]',
      extraData: {
        kind: 'forum',
        type: 'image',
      },
      setHeaders() {
        return {
          Authorization: persistedStates.authorizationHeader || '',
        }
      },
      customUploaderCompleted(
        response: unknown,
        vditor: IVditor,
        errorCallback: (html?: string) => void
      ) {
        response = JSON.parse(response as string)
        const item = response.data[0]
        context?.attachments?.push(item)
        context?.vditor?.insertValue(
          `![${item.filename}](a:${item.attachment_id})`
        )
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

    // toolbar display config
    toolbar: [
      'edit-mode',
      'outline',
      '|',
      ...(smilyToolbarItem ? [smilyToolbarItem] : ['emoji']),
      'headings',
      'bold',
      'italic',
      'strike',
      '|',
      'line',
      'quote',
      'table',
      'list',
      'ordered-list',
      'check',
      'outdent',
      'indent',
      'code',
      'inline-code',
      'insert-after',
      'insert-before',
      '|',
      'link',
      'upload',
      // TODO: reveal later
      // 'record',
      'preview',
      '|',
      'undo',
      'redo',
      ...(fullscreenToolbarItem ? [fullscreenToolbarItem] : ['fullscreen']),
    ],
  }
}

export default options
