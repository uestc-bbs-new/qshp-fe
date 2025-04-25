export const searchParamsExtract = (value: URLSearchParams, keys: string[]) => {
  const result = new URLSearchParams()
  keys.forEach((key) => value.getAll(key).forEach((v) => result.append(key, v)))
  return result
}
