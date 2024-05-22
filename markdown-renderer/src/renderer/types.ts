import Vditor from 'vditor'

type FileInfo = {
  filename: string
  size: number
}

export type Attachment = FileInfo & {
  attachment_id: number
  dateline: number
  is_image: number
  path: string
  download_url?: string
  thumbnail_url?: string
  raw_url?: string
}

export type VditorContext = {
  vditor?: Vditor
  attachments: Attachment[]
  inlineAttachments?: Set<number>
}

export type RenderMode = 'light' | 'dark'
