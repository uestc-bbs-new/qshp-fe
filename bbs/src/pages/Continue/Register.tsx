import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  Button,
  Dialog,
  DialogContent,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'

import {
  AuthorizationResult,
  checkUserName,
  idasFreshman,
  register,
} from '@/apis/auth'
import Error from '@/components/Error'
import Link from '@/components/Link'
import { RegisterContent } from '@/components/Login/Register'
import { isEmailValid } from '@/utils/input'
import { isPreviewRelease } from '@/utils/releaseMode'
import { pages } from '@/utils/routes'
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
  onSignIn,
}: {
  freshman?: boolean
  idasResult: IdasResultEx
  onClose: () => void
  onSignIn: () => void
}) => {
  const theme = useTheme()
  const navigate = useNavigate()
  const formRef = useRef<HTMLFormElement>(null)
  const [userNameError, setUserNameError] = useState('')
  const [userNamePrompt, setUserNamePrompt] = useState('')
  const [emailPrompt, setEmailPrompt] = useState('')
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
      // This regex is just a subset of CJK characters recognized by backend, but for simplicity,
      // use it for now.
      !username.match(/^[\u4E00-\u9FFF\u3400-\u4DBF]{2}$/) &&
      (username.length < kMinUserNameLength ||
        username.length > kMaxUserNameLength)
    ) {
      setUserNameError('用户名长度为 3~15 个字符，或两个汉字。')
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
  const suggestUserName = () => {
    const username = getFormField('username')
    if (username.match(/^(?:\d{12,13}|\d{10})$/)) {
      setUserNamePrompt('不建议使用学号作为用户名。')
    } else {
      setUserNamePrompt('')
    }
  }
  const validateEmail = () => {
    const email = getFormField('email')
    if (email.length > 64) {
      setEmailError('邮箱地址太长。')
    } else if (isEmailValid(email)) {
      setEmailError('')
      setEmailPrompt(
        email.match(/@std\.uestc\.edu\.cn$/i)
          ? '学生邮箱毕业后无法继续使用，建议您填写其他常用邮箱。'
          : ''
      )
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
      navigate(pages.welcome, {
        replace: true,
        state: {
          continue: window.innerWidth < 750 ? idasResult.continue : undefined,
        },
      })
    }
  }
  return (
    <>
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
                userNameError ||
                (userNamePrompt && (
                  <span style={{ color: theme.palette.warning.main }}>
                    {userNamePrompt}
                  </span>
                )) ||
                '注册后不能随意修改用户名，请认真考虑后填写。'
              }
              error={!!userNameError}
              onChange={suggestUserName}
              onBlur={validateUserName}
              required
              sx={{ width: '80%' }}
            />
          </td>
        </tr>
        <PasswordInput
          onValidated={(valid) => (passwordValid.current = valid)}
        />
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
              helperText={
                emailPrompt ? (
                  <span style={{ color: theme.palette.warning.main }}>
                    {emailPrompt}
                  </span>
                ) : (
                  emailError ||
                  '请准确填写您的常用邮箱，如果毕业后忘记河畔密码可通过邮箱找回。'
                )
              }
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
              flexWrap="wrap"
              my={1}
            >
              <Button
                variant="contained"
                sx={{ my: 1 }}
                onClick={handleRegister}
              >
                立即注册
              </Button>
              {!idasResult.users?.length &&
                !!idasResult.remaining_registers &&
                !isPreviewRelease && (
                  <Button
                    variant="outlined"
                    sx={{ ml: 2, my: 1 }}
                    onClick={goFreshmanOrBack}
                  >
                    到处逛逛，稍后注册
                  </Button>
                )}
              {!!idasResult.users?.length && (
                <Button
                  variant="outlined"
                  sx={{ ml: 2, my: 1 }}
                  onClick={onSignIn}
                >
                  登录已有帐号
                </Button>
              )}
            </Stack>
            {!!idasResult.users?.length && (
              <Typography mb={1}>
                您已在清水河畔注册过，
                <Link to="javascript:void(0)" onClick={onSignIn}>
                  点击此处
                </Link>
                查看或登录已有账号。
              </Typography>
            )}
            {registerError ? <Error error={registerError} small /> : <></>}
          </td>
        </tr>
      </CommonForm>
    </>
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
