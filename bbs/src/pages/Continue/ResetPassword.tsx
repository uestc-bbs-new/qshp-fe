import { css } from '@emotion/react'
import { useQuery } from '@tanstack/react-query'

import { useEffect, useRef, useState } from 'react'

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  Stack,
  Typography,
} from '@mui/material'

import {
  getEmailConfig,
  resetPassword,
  resetPasswordByEmail,
  sendEmailToResetPassword,
} from '@/apis/auth'
import { User } from '@/common/interfaces/base'
import Captcha, { Captcha as CaptchaType } from '@/components/Captcha'
import Error from '@/components/Error'
import Link from '@/components/Link'
import { isEmailValid } from '@/utils/input'
import { getIdasLink, gotoIdas, pages } from '@/utils/routes'

import CommonLayout, { OfficialEmail, WebmasterContact } from './CommonLayout'
import { CommonForm, SignUpTextField } from './Forms'
import { PasswordInput } from './Password'
import { IdasResultEx } from './common'

const kSavedStudentIdForEmailKey = 'newbbs_email_saved_studentid'

const ResetPassword = ({
  method,
  user,
  users,
  emailVerify,
  idasResult,
  onClose,
}: {
  method: 'idas' | 'email'
  user: User
  users?: User[]
  emailVerify?: string
  idasResult?: IdasResultEx
  onClose: () => void
}) => {
  const formRef = useRef<HTMLFormElement>(null)
  const passwordValid = useRef(false)
  const [apiError, setApiError] = useState<unknown>()
  const [success, setSuccess] = useState(false)
  const [pending, setPending] = useState(false)
  let savedStudentId = ''
  try {
    savedStudentId = sessionStorage.getItem(kSavedStudentIdForEmailKey) ?? ''
  } catch (_) {}

  const getFormField = (name: string) => {
    if (!formRef.current) {
      return ''
    }
    return (new FormData(formRef.current).get(name) || '').toString()
  }

  const handleReset = async () => {
    const password = getFormField('password')
    const studentIdOrName = getFormField('studentIdOrName').trim()
    if (!passwordValid.current || !password) {
      return
    }
    if (method == 'email' && !studentIdOrName) {
      return
    }
    setPending(true)
    try {
      if (method == 'idas' && idasResult) {
        await resetPassword({
          code: idasResult.code,
          ephemeral_authorization: idasResult.ephemeral_authorization,
          user_id: user.uid,
          password,
        })
      } else if (method == 'email' && emailVerify) {
        await resetPasswordByEmail(
          emailVerify,
          user.uid,
          password,
          studentIdOrName
        )
      } else {
        return
      }
    } catch (e) {
      setApiError(e)
      return
    } finally {
      setPending(false)
    }
    setSuccess(true)
    setApiError(null)
    sessionStorage.setItem(kSavedStudentIdForEmailKey, studentIdOrName)
  }
  return (
    <CommonForm
      title={<Typography variant="signinTitle">重置密码</Typography>}
      onClose={onClose}
      ref={formRef}
    >
      <tr>
        <th>
          <Typography>用户名</Typography>
        </th>
        <td css={css({ padding: '16.5px 0.5em' })}>
          <Typography>{user.username}</Typography>
        </td>
      </tr>
      <PasswordInput
        onValidated={(valid) => (passwordValid.current = valid)}
        disabled={pending}
      />
      {method == 'email' && (
        <tr>
          <th>
            <Typography>关联学号/姓名</Typography>
          </th>
          <td>
            <SignUpTextField
              fullWidth
              name="studentIdOrName"
              disabled={pending}
              sx={{ mb: 1 }}
              helperText="选择其中任意一项输入"
              defaultValue={savedStudentId}
            />
          </td>
        </tr>
      )}
      <tr>
        <th></th>
        <td>
          <Stack
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
            my={2}
          >
            {success &&
              ((idasResult?.users && idasResult?.users.length > 1) ||
                (users && users.length > 1)) && (
                <Button variant="outlined" onClick={onClose} sx={{ mr: 2 }}>
                  重置其他账号
                </Button>
              )}
            {success && (
              <Button component={Link} to={pages.index()} variant="contained">
                返回首页
              </Button>
            )}
            {!success && (
              <Button
                disabled={pending}
                variant="contained"
                onClick={handleReset}
              >
                重置密码
              </Button>
            )}
          </Stack>
          {success && (
            <Alert severity="success">密码已重置，请使用新密码登录。</Alert>
          )}
          {!!apiError && <Error error={apiError} small />}
        </td>
      </tr>
    </CommonForm>
  )
}

export const ResetPasswordHome = () => {
  return (
    <Dialog open fullScreen>
      <DialogContent sx={{ p: 0 }}>
        <CommonLayout>
          <Stack pl={2} pr={4}>
            <Typography variant="signinTitle">忘记密码</Typography>
            <Typography variant="h6" textAlign="justify" my={3}>
              在校用户请通过统一身份认证验证后重置密码：
            </Typography>
            <Stack direction="row" justifyContent="flex-start">
              <Button
                variant="contained"
                sx={{ fontSize: 20, px: 5, py: 1.5 }}
                onClick={() => gotoIdas({ mode: 'resetpassword' })}
              >
                进入统一身份认证平台
              </Button>
            </Stack>
            <Typography textAlign="justify" mt={2}>
              注：毕业离校两年内，可使用统一身份认证系统中的
              <Link
                to="https://idas.uestc.edu.cn/retrieve-password/accountUnban/index.html"
                target="_blank"
                external
              >
                账号解禁
              </Link>
              功能自助申请解禁，然后点击上述按钮重置密码。
            </Typography>
            <Typography variant="h6" textAlign="justify" mt={4}>
              毕业用户请
              <Link to={pages.resetPasswordByEmail}>
                点击此处通过邮箱重置密码
              </Link>
              。若您注册时未填写有效邮箱，或遇到其他问题，请通过
              <WebmasterContact />
              联系站长。
            </Typography>
          </Stack>
        </CommonLayout>
      </DialogContent>
    </Dialog>
  )
}

export const ResetPasswordEmailHome = () => {
  const [pending, setPending] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [apiError, setApiError] = useState<unknown>()
  const [errorMessage, setErrorMessage] = useState<string>()
  const [emailSent, setEmailSent] = useState(false)
  const captchaRef = useRef<CaptchaType>(null)
  const captchaToken = useRef<string>(undefined)
  const kEmailRetryTimeout = 60
  const [timeout, setRetryTimeout] = useState(kEmailRetryTimeout)
  const timeoutRef = useRef<number>(timeout)
  const retryInterval = useRef<number>(undefined)
  useEffect(
    () => () => {
      if (retryInterval.current) {
        clearInterval(retryInterval.current)
        retryInterval.current = undefined
      }
    },
    []
  )
  const {
    isLoading,
    isError,
    data: config,
  } = useQuery({
    queryKey: ['resetpassword', 'email', 'config'],
    queryFn: getEmailConfig,
  })
  const onCaptchaVerified = (value: string) => {
    captchaToken.current = value
  }
  const handleSend = async () => {
    const email = inputRef.current?.value
    if (!email || !isEmailValid(email)) {
      setErrorMessage('请输入有效的邮箱地址。')
      return
    }
    if (config?.required_captcha?.length && !captchaToken.current) {
      setErrorMessage('请完成验证后继续操作。')
      captchaRef.current?.reset()
      return
    }
    if (errorMessage) {
      setErrorMessage(undefined)
    }
    setPending(true)
    setEmailSent(false)
    try {
      await sendEmailToResetPassword({
        email,
        ...(captchaToken.current && { captcha_value: captchaToken.current }),
        ...(config?.required_captcha?.length && {
          captcha_type: config.required_captcha[0].name,
        }),
      })
      setApiError(null)
      setEmailSent(true)
      if (retryInterval.current) {
        clearInterval(retryInterval.current)
        retryInterval.current = undefined
      }
      setRetryTimeout(kEmailRetryTimeout)
      timeoutRef.current = kEmailRetryTimeout
      retryInterval.current = setInterval(() => {
        if (timeoutRef.current > 0) {
          setRetryTimeout((timeout) => {
            return (timeoutRef.current = timeout - 1)
          })
        } else {
          clearInterval(retryInterval.current)
          retryInterval.current = undefined
        }
      }, 1000)
    } catch (e: any) {
      if (e?.type == 'http' && e.status == 401) {
        e.type = 'api'
        e.message = '邮件验证链接无效或已过期，请重新发送验证邮件。'
      }
      setApiError(e)
      if (e?.type == 'api' && e.code == 1) {
        captchaRef.current?.reset()
      }
    } finally {
      setPending(false)
    }
  }
  return (
    <Dialog open fullScreen>
      <DialogContent sx={{ p: 0 }}>
        <CommonLayout>
          <Stack pl={2} pr={4} alignItems="flex-start" maxWidth={500}>
            <Typography variant="signinTitle">邮箱找回密码</Typography>
            {isError ? (
              <Alert severity="error" sx={{ mt: 2 }}>
                页面加载失败，请刷新重试
              </Alert>
            ) : (
              <>
                <Typography variant="h6" textAlign="justify" mt={4} mb={1}>
                  请准确输入您注册时填写的邮箱：
                </Typography>
                <SignUpTextField
                  type="email"
                  autoFocus
                  fullWidth
                  inputRef={inputRef}
                />
                {isLoading && (
                  <Stack
                    justifyContent="center"
                    alignItems="center"
                    width="100%"
                    minHeight={65}
                    mt={1}
                  >
                    <CircularProgress />
                  </Stack>
                )}
                {!!config?.required_captcha?.length && (
                  <Box mt={1}>
                    <Captcha
                      captcha={config.required_captcha[0]}
                      onVerified={onCaptchaVerified}
                      ref={captchaRef}
                    />
                  </Box>
                )}
                <Button
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={pending || (emailSent && timeout > 0)}
                  onClick={handleSend}
                >
                  {pending
                    ? '请稍候...'
                    : emailSent && timeout
                      ? `邮件已发送 (${timeout})`
                      : '发送验证邮件'}
                </Button>
              </>
            )}
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            {apiError ? <Error error={apiError} small /> : <></>}
            {emailSent && (
              <Alert severity="info">
                <Typography fontSize={16} textAlign="justify">
                  邮件已发送，请在邮箱中查看。如果未收到邮件，请检查垃圾邮件文件夹，或者将{' '}
                  <OfficialEmail /> 添加到白名单并重新发送验证邮件。
                </Typography>
              </Alert>
            )}
            <Typography textAlign="justify" mt={5}>
              注：仅供毕业用户使用，在校用户请通过
              <Link to={getIdasLink({ mode: 'resetpassword' })} external>
                统一身份认证
              </Link>
              验证后重置密码。如果遇到问题，请通过
              <WebmasterContact />
              联系站长。
            </Typography>
            <Stack direction="row" justifyContent="flex-start"></Stack>
          </Stack>
        </CommonLayout>
      </DialogContent>
    </Dialog>
  )
}

export default ResetPassword
