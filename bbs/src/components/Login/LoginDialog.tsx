import React, { useRef, useState } from 'react'

import { Close } from '@mui/icons-material'
import {
  Alert,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material'

import { signIn } from '@/apis/auth'
import { useAppState } from '@/states'
import { gotoIdas } from '@/utils/routes'
import { persistedStates } from '@/utils/storage'

import Captcha, {
  CaptchaConfiguration,
  Captcha as CaptchaType,
} from '../Captcha'

const LoginDialog = ({ open }: { open: boolean }) => {
  const { state, dispatch } = useAppState()
  const formRef = useRef<HTMLFormElement>(null)
  const [captcha, setCaptcha] = useState<CaptchaConfiguration>()
  const captchaRef = useRef<CaptchaType>()
  const [signinPending, setSigninPending] = useState(false)
  const close = () => dispatch({ type: 'close login' })
  type FormData = {
    username: string
    password: string
    keepSignedIn: boolean
  }
  const verifyForm = (prompt: boolean): FormData | null => {
    if (!formRef.current) {
      return null
    }
    const data = new FormData(formRef.current)
    const username = data.get('username')
    const password = data.get('password')
    const keepSignedIn = data.get('keep_signed_in')?.toString() === '1'
    if (!username || !password) {
      prompt && showError('请输入用户名与密码。')
      return null
    }
    return {
      username: username.toString(),
      password: password.toString(),
      keepSignedIn,
    }
  }
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = verifyForm(true)
    if (!formData) {
      return
    }
    doSignIn(formData)
  }
  const doSignIn = async (formData: FormData, captchaValue?: string) => {
    try {
      setSigninPending(true)
      const authorization = await signIn({
        username: formData.username,
        password: formData.password,
        keep_signed_in: formData.keepSignedIn,
        ...(captchaValue && {
          captcha_value: captchaValue,
          captcha_type: captcha?.name,
        }),
      })
      if (authorization) {
        persistedStates.authorizationHeader = authorization
        close()
      }
    } catch (e_) {
      const e = e_ as
        | {
            type: string
            code: number
            message: string
            details: { data: CaptchaConfiguration[] }
          }
        | undefined
      if (e?.type == 'api' && e?.code == 1) {
        setCaptcha(e.details.data[0])
      } else {
        showError(e?.message || '登录失败！')
      }
      captchaRef.current?.reset()
    } finally {
      setSigninPending(false)
    }
  }
  const onCaptchaVerified = (token: string) => {
    const formData = verifyForm(false)
    if (formData) {
      doSignIn(formData, token)
    }
  }
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const showError = (message: string) => {
    setSnackbarMessage(message)
    setSnackbarOpen(true)
  }
  return (
    <Dialog open={open} onClose={close}>
      <DialogTitle>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography>登录</Typography>
          <IconButton onClick={close}>
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        {state.login.prompt && (
          <Alert severity="info">{state.login.prompt}</Alert>
        )}
        <Tabs value={0} sx={{ my: 1.5 }}>
          <Tab label="用户名密码登录" />
          <Tab label="统一身份认证登录" onClick={gotoIdas} />
        </Tabs>
        <form onSubmit={onSubmit} ref={formRef}>
          <Grid container alignItems="center" rowSpacing={2}>
            <Grid item xs={4}>
              <Typography>用户名：</Typography>
            </Grid>
            <Grid item xs={8}>
              <TextField autoFocus fullWidth name="username" />
            </Grid>
            <Grid item xs={4}>
              <Typography>密码：</Typography>
            </Grid>
            <Grid item xs={8}>
              <TextField type="password" fullWidth name="password" />
            </Grid>
          </Grid>
          <FormControlLabel
            control={<Checkbox name="keep_signed_in" value="1" />}
            label="自动登录"
          />
          {captcha && (
            <>
              <Alert severity="info">请完成验证后登录：</Alert>
              <Stack alignItems="center" my={1}>
                <Captcha
                  captcha={captcha}
                  onVerified={onCaptchaVerified}
                  ref={captchaRef}
                />
              </Stack>
            </>
          )}
          <Stack direction="row" justifyContent="center">
            <Button type="submit" disabled={signinPending}>
              {signinPending ? '请稍候...' : '登录'}
            </Button>
          </Stack>
        </form>
      </DialogContent>
      <Snackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        autoHideDuration={5000}
        anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
      >
        <Alert severity="error">{snackbarMessage}</Alert>
      </Snackbar>
    </Dialog>
  )
}

export default LoginDialog
