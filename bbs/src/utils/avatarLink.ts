const uidSplit = (uid: number) => {
  const s = uid.toString()
  return `/${s.substring(0, 2)}/${s.substring(2, 4)}/${s.substring(4, 6)}`
}

export const smallLink = (uid: number) => {
  return `/uc_server/data/avatar/000${uidSplit(uid)}_avatar_small.jpg`
}

export const middleLink = (uid: number) => {
  return `/uc_server/data/avatar/000${uidSplit(uid)}_avatar_middle.jpg`
}

export const largeLink = (uid: number) => {
  return `/uc_server/data/avatar/000${uidSplit(uid)}_avatar_big.jpg`
}

export const defaultLink = () => {
  // return `/uc_server/data/avatar/default.png`
  return 'https://mui.com/static/images/avatar/1.jpg'
}
