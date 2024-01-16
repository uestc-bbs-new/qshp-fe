export const setTitle = (title: string) => {
  document.title = title
}

export const searchParamsAssign = (value: URLSearchParams, kvList: object) =>
  new URLSearchParams(
    Object.entries(Object.assign(Object.fromEntries(value.entries()), kvList))
  )

export const handleCtrlEnter =
  (handler: () => void) => (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key == 'Enter') {
      handler()
    }
  }
