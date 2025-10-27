import { useRef, useState } from 'react'

import { Typography } from '@mui/material'

import { SignUpTextField } from './Forms'
import { checkPassword } from './utils'

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

  const validatePassword = (confirmPassword?: boolean) => {
    if (!password1.current || !password2.current) {
      return
    }
    const result = checkPassword(
      password1.current.value,
      password2.current.value,
      setPasswordError,
      setPasswordError2
    )
    if (result.valid) {
      setPasswordError('')
      setPasswordError2('')
      if (confirmPassword) {
        onValidated(true)
      }
    } else {
      onValidated(false)
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
