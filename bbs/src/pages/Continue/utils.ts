const kMinPasswordLength = 10

type SetPasswordErrorCallback = (message: string) => void

export const checkPassword = (
  password1: string,
  password2: string,
  setPasswordError?: SetPasswordErrorCallback,
  setPasswordError2?: SetPasswordErrorCallback
) => {
  let message = ''
  if (password1.length < kMinPasswordLength) {
    message = `密码至少 ${kMinPasswordLength} 位。`
    setPasswordError && setPasswordError(message)
  }
  if (!message) {
    const matches =
      (password1.match(/[a-z]/) ? 1 : 0) +
      (password1.match(/[A-Z]/) ? 1 : 0) +
      (password1.match(/[0-9]/) ? 1 : 0) +
      (password1.match(/[^a-zA-Z0-9]/) ? 1 : 0)
    if (matches < 3) {
      message = `密码必须包含大写字母、小写字母、数字、特殊字符中的任意三种字符。`
      setPasswordError && setPasswordError(message)
    }
  }
  if (!message) {
    setPasswordError && setPasswordError(message)
    if (password2 != password1) {
      if (password2) {
        message = '两次输入的密码不同，请重新输入。'
        setPasswordError2 && setPasswordError2(message)
      } else {
        message = '请再次输入密码确认。'
      }
    }
  }
  return { valid: !message, message }
}
