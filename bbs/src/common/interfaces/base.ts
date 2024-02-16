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
}

export type UploadResponse = {
  uploaded?: Attachment[]
  errors?: FileInfo[]
}
