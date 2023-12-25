const defaultMap = (name: string) => (name == 'background' ? '#fff' : undefined)
const colorMap: {
  [type: string]: string | ((name: string) => string | undefined)
} = {
  threadType: (name: string) =>
    name == 'background' ? 'rgba(77, 145, 245, 0.3)' : '#303133',
  rateNegative: (name: string) =>
    name == 'background' ? '#F56C6C' : '#FFFFFF',
  level: defaultMap,
}

const chipColor = (name: string, type: string) => {
  const result = colorMap[type]
  if (typeof result == 'function') {
    return result(name)
  }
  if (typeof result == 'string') {
    return result
  }
  return defaultMap(name)
}

export default chipColor
