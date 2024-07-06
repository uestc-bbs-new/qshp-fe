import { useRef, useState } from 'react'

import { Typography } from '@mui/material'

import { SignUpTextField } from './Forms'

const kMinPasswordLength = 10

export const PasswordInput = ({
  disabled,
  onValidated,
}: {
  disabled?: boolean
  onValidated: (valid: boolean) => void
}) => {
  const [passwordError, setPasswordError] = useState('')
  const [passwordError2, setPasswordError2] = useState('')
  const password1 = useRef<HTMLInputElement>()
  const password2 = useRef<HTMLInputElement>()

  const validatePassword = async (confirmPassword?: boolean) => {
    if (
      password1.current &&
      password1.current.value.length < kMinPasswordLength
    ) {
      setPasswordError(`密码至少 ${kMinPasswordLength} 位。`)
      onValidated(false)
      return
    }
    if (password1.current) {
      const password = password1.current.value
      const matches =
        (password.match(/[a-z]/) ? 1 : 0) +
        (password.match(/[A-Z]/) ? 1 : 0) +
        (password.match(/[0-9]/) ? 1 : 0) +
        (password.match(/[^a-zA-Z0-9]/) ? 1 : 0)
      if (matches < 3) {
        setPasswordError(
          `密码必须包含大写字母、小写字母、数字、特殊字符中的任意三种字符。`
        )
        onValidated(false)
        return
      }
    }
    if (
      confirmPassword &&
      password1.current &&
      password2.current &&
      password2.current.value != password1.current.value
    ) {
      setPasswordError2('两次输入的密码不同，请重新输入。')
      onValidated(false)
      return
    }
    setPasswordError('')
    setPasswordError2('')
    if (confirmPassword) {
      onValidated(true)
    }
  }

  return (
    <>
      <tr>
        <th>
          <Typography>河畔密码</Typography>
        </th>
        <td>
          <SignUpTextField
            type="password"
            fullWidth
            name="password"
            error={!!passwordError || !!passwordError2}
            helperText={
              passwordError ||
              passwordError2 ||
              '请设置一个安全的河畔密码并妥善保存，以便今后登录。'
            }
            disabled={disabled}
            onBlur={() => validatePassword()}
            inputRef={password1}
          />
        </td>
      </tr>
      <tr>
        <th>
          <Typography>确认密码</Typography>
        </th>
        <td>
          <SignUpTextField
            type="password"
            fullWidth
            name="password2"
            error={!!passwordError2}
            disabled={disabled}
            onBlur={() => validatePassword(true)}
            sx={{ mb: 1 }}
            inputRef={password2}
          />
        </td>
      </tr>
    </>
  )
}
