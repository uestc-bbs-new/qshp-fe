export type SystemSettingsKey = 'medals'

export type Medal = {
  id: number
  name: string
  image_path: string
  type: number
  display_order: number
  description: string
  expiration_days: number
  ext_credit: string
  price: number
}

export type MedalMap = { [id: string]: Medal }

type SystemSettingsEntry<T> = {
  version: number
  value: T
}

export type SystemSettings = {
  medals?: SystemSettingsEntry<Medal[]>
}
