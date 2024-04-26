import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button, Stack, Typography } from '@mui/material'

import { checkUserName, idasFreshman, register } from '@/apis/auth'
import Link from '@/components/Link'
import { gotoIdas } from '@/utils/routes'
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
  const handleRegister = async () => {
    if (!formRef.current) {
      return
    }
    if (userNameError || !passwordValid.current) {
      return
    }
    const data = new FormData(formRef.current)
    const username = data.get('username')
    const password = data.get('password')
    const email = data.get('email')
    if (!username || !password || !email) {
      return
    }
    persistedStates.authorizationHeader = (
      await register({
        code: idasResult.code,
        ephemeral_authorization: idasResult.ephemeral_authorization,
        username: username.toString(),
        password: password.toString(),
        email: email.toString(),
      })
    ).authorization
    navigate(idasResult.continue, { replace: true })
  }
  return (
    <CommonForm
      ref={formRef}
      title={
        <>
          <Typography variant="signinTitle">注册</Typography>
          {freshman && (
            <Typography>欢迎来到清水河畔！请填写信息完成注册：</Typography>
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
          <Stack direction="row" justifyContent="flex-end">
            <Link
              external
              to="/member.php?mod=register&forceold=1"
              target="_blank"
              underline="hover"
              sx={{ color: '#ccc' }}
            >
              返回旧版
            </Link>
          </Stack>
        </td>
      </tr>
    </CommonForm>
  )
}

export const RegisterHome = () => (
  <CommonLayout>
    <Stack>
      <Typography>欢迎来到清水河畔</Typography>
      <Typography>
        清水河畔属于高校官方论坛，账号注册时必须进行实名关联。请点击“统一身份认证”按钮，使用学号与网上服务大厅密码登录后继续注册：
      </Typography>
      <Button
        variant="contained"
        onClick={() => gotoIdas({ mode: 'register' })}
      >
        统一身份认证
      </Button>
    </Stack>
  </CommonLayout>
)
