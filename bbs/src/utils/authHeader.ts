const kStorageKey = 'newbbs_authorization'
const getAuthorizationHeader = () => localStorage.getItem(kStorageKey)
const setAuthorizationHeader = (value: string) =>
  localStorage.setItem(kStorageKey, value)
export { getAuthorizationHeader, setAuthorizationHeader }
