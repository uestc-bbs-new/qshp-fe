export type ThreadType = {
  type_id: number
  name: string
  moderators_only: boolean
}

export type ThreadTypeMap = { [type_id: number]: ThreadType }
