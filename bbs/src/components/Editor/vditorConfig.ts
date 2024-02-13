// TODO: How to take the @ user information to request?
import { getUsername } from '@/apis/thread'

import { customRenderers } from '../RichText/renderer'
import { common, commonEmojiPath } from '../RichText/vditorConfig'

const options = ({
  smilyToolbarItem,
  fullscreenToolbarItem,
}: {
  smilyToolbarItem?: IMenuItem
  fullscreenToolbarItem?: IMenuItem
}): IOptions => ({
  ...common,
  luteRenderers: {
    SpinVditorDOM: customRenderers('SpinVditorDOM'),
    SpinVditorIRDOM: customRenderers('SpinVditorIRDOM'),
    SpinVditorSVDOM: customRenderers('SpinVditorSVDOM'),
    Md2VditorDOM: customRenderers('Md2VditorDOM'),
    Md2VditorIRDOM: customRenderers('Md2VditorIRDOM'),
    Md2HTML: customRenderers('Md2HTML'),
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
          const data = await getUsername(key)
          return data?.rows.map((item) => {
            return {
              html: item.username,
              value: `[@${item.username.trim()}](at:${item.user_id})`,
            }
          })
        },
      },
    ],
  },
  upload: {
    accept: 'image/*,.mp3, .wav, .rar',
    token: 'test',
    url: '/dev/star/api/v1/global/upload/files',
    linkToImgUrl: '/api/upload/fetch',
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
})

export default options
