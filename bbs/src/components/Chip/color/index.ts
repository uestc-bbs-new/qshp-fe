import { PaletteMode } from '@mui/material'

const defaultMap = (name: string, theme?: PaletteMode) =>
  name == 'background' ? '#fff' : undefined
const colorMap: {
  [type: string]:
    | string
    | ((name: string, theme?: PaletteMode) => string | undefined)
} = {
  threadType: (name: string, theme?: PaletteMode) =>
    name == 'background'
      ? 'rgba(77, 145, 245, 0.3)'
      : theme == 'dark'
        ? 'white'
        : '#303133',
  threadTypeActive: (name: string) =>
    name == 'background' ? '#FBACA3' : '#303133',
  rateNegative: (name: string) =>
    name == 'background' ? '#F56C6C' : '#FFFFFF',
  level: defaultMap,
}

const chipColor = (name: string, type: string, theme?: PaletteMode) => {
  const result = colorMap[type]
  if (typeof result == 'function') {
    return result(name, theme)
  }
  if (typeof result == 'string') {
    return result
  }
  return defaultMap(name, theme)
}

export default chipColor
