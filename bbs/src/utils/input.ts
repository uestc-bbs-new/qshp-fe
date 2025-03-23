export const normalizeNumberInput = (
  value: string,
  options?: { integer?: boolean; nonNegative?: boolean; expoential?: boolean }
) => {
  if (options?.nonNegative) {
    value = value.replace(/-/g, '')
  }
  if (options?.integer) {
    return value.replace(/[^0-9-]/g, '')
  }
  const dotIndex = value.indexOf('.')
  if (dotIndex != -1) {
    value =
      value.substring(0, dotIndex + 1) +
      value.substring(dotIndex + 1).replace(/\./g, '')
  }
  if (options?.expoential) {
    return value.replace(/[^0-9-.e]/gi, '')
  }
  return value.replace(/[^0-9-.]/g, '')
}

export const parseNumberInput = (
  value: string,
  options?: { float?: boolean }
) => {
  if (options?.float) {
    if (value == '.') {
      return 0
    }
    return parseFloat(value)
  }
  return parseInt(value)
}

const pad = (value: number | string) => value.toString().padStart(2, '0')
export const toDatetimeLocal = (value: Date) =>
  `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(
    value.getDate()
  )}T${pad(value.getHours())}:${pad(value.getMinutes())}`
