export const setTitle = (title: string) => {
  document.title = title
}

export const searchParamsAssign = (value: URLSearchParams, kvList: object) =>
  new URLSearchParams(
    Object.entries(Object.assign(Object.fromEntries(value.entries()), kvList))
  )
