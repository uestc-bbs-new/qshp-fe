// TODO: How to take the @ user information to request?
import { getUsername } from '@/apis/thread'

import { customRenderers } from './renderer'

const common = {
  cdn: '/third_party/vditor',
}
const commonEmojiPath = {
  emojiPath: `${common.cdn}/dist/images/emoji`,
}

type Mode = 'light' | 'dark'

const previewCommon = (mode: Mode) => ({
  theme: {
    current: mode,
    path: `${common.cdn}/dist/css/content-theme`,
  },
})

export const getPreviewThemeOptions = (mode: Mode): IPreview => ({
  ...previewCommon(mode),
})

export const getPreviewOptions = (mode: Mode): IPreviewOptions => ({
  ...common,
  mode,
  ...previewCommon(mode),
  ...commonEmojiPath,
  renderers: customRenderers('Preview'),
})

const options = ({
  smilyToolbarItem,
}: {
  smilyToolbarItem?: IMenuItem
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
              value: `@${item.username}`,
            }
          })
        },
      },
    ],
  },
  upload: {
    accept: 'image/*,.mp3, .wav, .rar',
    token: 'test',
    url: '/dev/star/api/forum/v1/global/upload/files',
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
    'fullscreen',
  ],
})

export default options
