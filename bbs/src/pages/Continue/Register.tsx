import { css } from '@emotion/react'

import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button, Stack, TextField, Typography, styled } from '@mui/material'

import { checkUserName, idasFreshman, register } from '@/apis/auth'
import { persistedStates } from '@/utils/storage'

import Back from './Back'
import { IdasResultEx } from './common'

const kMinUserNameLength = 3
const kMaxUserNameLength = 15
const kMinPasswordLength = 10

export const RegisterForm = ({
  freshman,
  idasResult,
  onClose,
}: {
  freshman?: boolean
  idasResult: IdasResultEx
  onClose: () => void
}) => {
  const navigate = useNavigate()
  const formRef = useRef<HTMLFormElement>(null)
  const [userNameError, setUserNameError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordError2, setPasswordError2] = useState('')
  const goFreshmanOrBack = async () => {
    if (idasResult.users) {
      onClose()
    } else {
      persistedStates.authorizationHeader = await idasFreshman({
        ticket: idasResult.ticket,
        ephemeral_authorization: idasResult.ephemeral_authorization,
      })
      navigate(idasResult.continue, { replace: true })
    }
  }
  const getFormField = (name: string) => {
    if (!formRef.current) {
      return ''
    }
    return (new FormData(formRef.current).get(name) || '').toString()
  }
  const validateUserName = async () => {
    const username = getFormField('username')
    if (
      username.length < kMinUserNameLength ||
      username.length > kMaxUserNameLength
    ) {
      setUserNameError('用户名长度为 3~15 个字符。')
      return
    }
    setUserNameError('')
    if (
      !(await checkUserName({
        ticket: idasResult.ticket,
        ephemeral_authorization: idasResult.ephemeral_authorization,
        username,
      })) &&
      getFormField('username') == username
    ) {
      setUserNameError('该用户名已注册，请重新输入。')
    }
  }
  const validatePassword = async (confirmPassword?: boolean) => {
    const password = getFormField('password')
    const password2 = getFormField('password2')
    if (password.length < kMinPasswordLength) {
      setPasswordError(`密码至少 ${kMinPasswordLength} 位。`)
      return
    }
    if (confirmPassword && password2 != password) {
      setPasswordError2('两次输入的密码不同，请重新输入。')
      return
    }
    setPasswordError('')
    setPasswordError2('')
  }
  const handleRegister = async () => {
    if (!formRef.current) {
      return
    }
    if (userNameError || passwordError) {
      return
    }
    const data = new FormData(formRef.current)
    const username = data.get('username')
    const password = data.get('password')
    const email = data.get('email')
    if (!username || !password || !email) {
      return
    }
    persistedStates.authorizationHeader = await register({
      ticket: idasResult.ticket,
      ephemeral_authorization: idasResult.ephemeral_authorization,
      username: username.toString(),
      password: password.toString(),
      email: email.toString(),
    })
    navigate(idasResult.continue, { replace: true })
  }
  return (
    <form ref={formRef} style={{ width: '70%' }}>
      <Back onClick={onClose} />
      <Typography variant="signinTitle">注册</Typography>
      {freshman && (
        <Typography>欢迎来到清水河畔！请填写信息完成注册：</Typography>
      )}
      <table
        css={css({
          width: '100%',
          '& th': {
            textAlign: 'left',
            verticalAlign: 'top',
            paddingTop: '16.5px',
            width: '6em',
          },
        })}
      >
        <tr>
          <th>
            <Typography>用户名</Typography>
          </th>
          <td>
            <SignUpTextField
              autoFocus
              name="username"
              helperText={
                userNameError || '注册后不能随意修改用户名，请认真考虑后填写。'
              }
              error={!!userNameError}
              onBlur={validateUserName}
              required
              sx={{ width: '80%' }}
            />
          </td>
        </tr>
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
                '建议设置一个安全的河畔密码并妥善保存，以便今后登录。'
              }
              onBlur={() => validatePassword()}
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
              onBlur={() => validatePassword(true)}
              sx={{ mb: 1 }}
            />
          </td>
        </tr>
        <tr>
          <th>
            <Typography>Email</Typography>
          </th>
          <td>
            <SignUpTextField type="email" fullWidth name="email" />
          </td>
        </tr>
        <tr>
          <th></th>
          <td>
            <Stack
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
              my={2}
            >
              <Button variant="contained" onClick={handleRegister}>
                立即注册
              </Button>
              {!idasResult.users && (
                <Button
                  variant="outlined"
                  sx={{ ml: 2 }}
                  onClick={goFreshmanOrBack}
                >
                  到处逛逛，稍后注册
                </Button>
              )}
            </Stack>
          </td>
        </tr>
      </table>
    </form>
  )
}

const SignUpTextField = styled(TextField)(({ theme }) => ({
  '.MuiOutlinedInput-root': {
    backgroundColor: theme.palette.mode == 'light' ? '#F4F3F3' : '#999999',
    borderRadius: 8,
    fieldset: {
      border: 'none',
    },
  },
}))
