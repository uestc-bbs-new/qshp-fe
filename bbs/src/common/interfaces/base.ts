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
}

export type UploadResponse = {
  uploaded?: Attachment[]
  errors?: FileInfo[]
}

export type ExtCreditName = '水滴' | '威望' | '奖励券'
export type ExtCreditMap = { [name in ExtCreditName]?: number }
