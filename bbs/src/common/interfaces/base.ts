export type User = {
  uid: number
  username: string
}

export type FileInfo = {
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

export type AttachmentSummary = Partial<FileInfo> & {
  path: string
  is_image: number
  thumbnail_url?: string
  raw_url?: string
}

export type UploadResponse = {
  uploaded?: Attachment[]
  errors?: FileInfo[]
}

export type ExtCreditName = '水滴' | '威望' | '奖励券'
export type ExtCreditMap = { [name in ExtCreditName]?: number }
