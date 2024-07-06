import DOMPurify from 'dompurify'

import { customRenderers } from './renderer'
import { RenderMode, VditorContext } from './types'

export const common = {
  cdn: '/third_party/vditor-patched-0.3',
}
export const commonEmojiPath = {
  emojiPath: `${common.cdn}/dist/images/emoji`,
}

const previewCommon = (mode: RenderMode) => ({
  theme: {
    current: mode,
    path: `${common.cdn}/dist/css/content-theme`,
  },
  hljs: {
    lineNumber: true,
  },
})

export const getPreviewThemeOptions = (mode: RenderMode): IPreview => ({
  ...previewCommon(mode),
})

export const getPreviewOptions = (
  mode: RenderMode,
  context: VditorContext
): IPreviewOptions => ({
  ...common,
  mode,
  ...previewCommon(mode),
  ...commonEmojiPath,
  renderers: customRenderers('Preview', context),
  transform: (html) => DOMPurify.sanitize(html),
})
