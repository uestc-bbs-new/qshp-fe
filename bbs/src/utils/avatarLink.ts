import prefix from './siteRoot'

const padNumber = (value: number, length: number) => {
  return value.toString().padStart(length, '0')
}
const uidSplit = (uid: number) => {
  const s = uid.toString()
  const leastSignificantDigits01 = padNumber(uid % 100, 2)
  const leastSignificantDigits23 = padNumber(Math.floor(uid / 100) % 100, 2)
  const leastSignificantDigits45 = padNumber(Math.floor(uid / 10000) % 100, 2)
  const mostSignificantDigits = padNumber(Math.floor(uid / 1000000), 3)
  return `${mostSignificantDigits}/${leastSignificantDigits45}/${leastSignificantDigits23}/${leastSignificantDigits01}`
}

export const smallLink = (uid: number) => {
  return `${prefix}/uc_server/data/avatar/${uidSplit(uid)}_avatar_small.jpg`
}

export const middleLink = (uid: number) => {
  return `${prefix}/uc_server/data/avatar/${uidSplit(uid)}_avatar_middle.jpg`
}

export const largeLink = (uid: number) => {
  return `${prefix}/uc_server/data/avatar/${uidSplit(uid)}_avatar_big.jpg`
}

export const defaultLink = () => {
  // return `/uc_server/data/avatar/default.png`
  return '/assets/avatar-default.png'
}
