import './richtext.css'
import { Attachment, RenderMode } from './types'
import { getPreviewOptions } from './vditorConfig'

export const previewOptions = ({
  mode,
  attachments,
}: {
  mode: RenderMode
  attachments?: Attachment[]
}) =>
  getPreviewOptions(mode, {
    attachments: attachments || [],
  })
