export const setTitle = (title: string) => {
  document.title = title
}

export const searchParamsAssign = (
  value: URLSearchParams,
  kvList: object,
  removeKeys?: string | string[]
) => {
  const result = new URLSearchParams(
    Object.entries(Object.assign(Object.fromEntries(value.entries()), kvList))
  )
  if (removeKeys) {
    if (typeof removeKeys == 'string') {
      removeKeys = [removeKeys]
    }
    removeKeys.forEach((key) => result.delete(key))
  }
  return result
}

export const searchParamsExtract = (value: URLSearchParams, keys: string[]) => {
  const result = new URLSearchParams()
  keys.forEach((key) => value.getAll(key).forEach((v) => result.append(key, v)))
  return result
}

export const handleCtrlEnter = (handler?: () => void) =>
  handler
    ? (e: React.KeyboardEvent) => {
        if (e.ctrlKey && e.key == 'Enter') {
          handler()
        }
      }
    : undefined

export const handleEnter = (handler?: () => void) =>
  handler
    ? (e: React.KeyboardEvent) => {
        if (e.key == 'Enter') {
          handler()
        }
      }
    : undefined
