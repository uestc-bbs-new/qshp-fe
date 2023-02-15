const levelColor = (name: string) => {
  return '#fff'
}

const plateColor = (name: string) => {
  return 'rgb(100,116,139)'
}

const chipColor = (name: string, type: string) => {
  if (type === 'level') {
    return levelColor(name)
  }
  return plateColor(name)
}

export default chipColor
