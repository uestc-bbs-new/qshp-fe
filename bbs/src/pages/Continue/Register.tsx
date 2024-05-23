import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button, Dialog, DialogContent, Stack, Typography } from '@mui/material'

import {
  AuthorizationResult,
  checkUserName,
  idasFreshman,
  register,
} from '@/apis/auth'
import Error from '@/components/Error'
import { RegisterContent } from '@/components/Login/Register'
import { isIdasRelease, isPreviewRelease } from '@/utils/releaseMode'
import { persistedStates } from '@/utils/storage'

import CommonLayout from './CommonLayout'
import { CommonForm, SignUpTextField } from './Forms'
import { PasswordInput } from './Password'
import { IdasResultEx } from './common'

const kMinUserNameLength = 3
const kMaxUserNameLength = 15

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
  const [emailError, setEmailError] = useState('')
  const [registerError, setRegisterError] = useState<unknown>()
  const passwordValid = useRef(false)
  const goFreshmanOrBack = async () => {
    if (idasResult.users) {
      onClose()
    } else {
      persistedStates.authorizationHeader = (
        await idasFreshman({
          code: idasResult.code,
          ephemeral_authorization: idasResult.ephemeral_authorization,
        })
      ).authorization
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
        code: idasResult.code,
        ephemeral_authorization: idasResult.ephemeral_authorization,
        username,
      })) &&
      getFormField('username') == username
    ) {
      setUserNameError('该用户名已注册，请重新输入。')
    }
  }
  const validateEmail = () => {
    const email = getFormField('email')
    if (email.length > 64) {
      setEmailError('邮箱地址太长。')
    } else if (email.match(/^[\w\-.]+@([\w-]+\.)+[\w-]{2,}$/)) {
      setEmailError('')
    } else {
      setEmailError('请输入有效的邮箱地址。')
    }
  }
  const handleRegister = async () => {
    if (!formRef.current) {
      return
    }
    if (userNameError || !passwordValid.current || emailError) {
      return
    }
    const data = new FormData(formRef.current)
    const username = data.get('username')
    const password = data.get('password')
    const email = data.get('email')
    if (!username || !password || !email) {
      return
    }
    let result: AuthorizationResult | undefined = undefined
    try {
      result = await register({
        code: idasResult.code,
        ephemeral_authorization: idasResult.ephemeral_authorization,
        username: username.toString(),
        password: password.toString(),
        email: email.toString(),
      })
    } catch (e) {
      setRegisterError(e)
    }
    if (result) {
      persistedStates.authorizationHeader = result.authorization
      if (window.innerWidth < 750) {
        navigate(idasResult.continue, { replace: true })
      } else {
        location.href = '/'
      }
    }
  }
  return (
    <CommonForm
      ref={formRef}
      title={
        <>
          <Typography variant="signinTitle">注册</Typography>
          {freshman && (
            <Typography variant="h6" my={2}>
              欢迎来到清水河畔！请填写信息完成注册：
            </Typography>
          )}
        </>
      }
      onClose={onClose}
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
      <PasswordInput onValidated={(valid) => (passwordValid.current = valid)} />
      <tr>
        <th>
          <Typography>Email</Typography>
        </th>
        <td>
          <SignUpTextField
            type="email"
            fullWidth
            name="email"
            error={!!emailError}
            helperText={emailError}
            onBlur={validateEmail}
            required
          />
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
            {!idasResult.users && !isIdasRelease && !isPreviewRelease && (
              <Button
                variant="outlined"
                sx={{ ml: 2 }}
                onClick={goFreshmanOrBack}
              >
                到处逛逛，稍后注册
              </Button>
            )}
          </Stack>
          {registerError ? <Error error={registerError} small /> : <></>}
        </td>
      </tr>
    </CommonForm>
  )
}

export const RegisterHome = () => (
  <Dialog open fullScreen>
    <DialogContent sx={{ p: 0 }}>
      <CommonLayout>
        <Stack pl={2} pr={4}>
          <RegisterContent />
        </Stack>
      </CommonLayout>
    </DialogContent>
  </Dialog>
)
