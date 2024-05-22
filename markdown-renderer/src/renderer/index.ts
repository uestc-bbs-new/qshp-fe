import './richtext.css'
import { Attachment, RenderMode } from './types'
import { getPreviewOptions } from './vditorConfig'

export const previewOptions = ({
  mode,
  attachments,
  inlineAttachments,
}: {
  mode: RenderMode
  attachments?: Attachment[]
  inlineAttachments?: Set<number>
}) =>
  getPreviewOptions(mode, {
    attachments: attachments || [],
    inlineAttachments: inlineAttachments || new Set(),
  })
