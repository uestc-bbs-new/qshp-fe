import HCaptcha from '@hcaptcha/react-hcaptcha'

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
  TextField,
  Typography,
} from '@mui/material'

import { signIn } from '@/apis/common'
import { useAppState } from '@/states'
import { setAuthorizationHeader } from '@/utils/authHeader'

const LoginDialog = ({ open }: { open: boolean }) => {
  const { state, dispatch } = useAppState()
  const formRef = useRef<HTMLFormElement>(null)
  const hCaptchaToken = useRef('')
  const hCaptchaRef = useRef<HCaptcha>(null)
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
    if (!hCaptchaToken.current) {
      prompt && showError('请完成验证后登录')
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
  const doSignIn = async (formData: FormData) => {
    try {
      setSigninPending(true)
      const authorization = await signIn({
        username: formData.username,
        password: formData.password,
        keep_signed_in: formData.keepSignedIn,
        captcha_value: hCaptchaToken.current,
      })
      if (authorization) {
        setAuthorizationHeader(authorization)
        close()
      }
    } catch (e) {
      showError((e as { message?: string })?.message || '登录失败！')
      hCaptchaRef.current?.resetCaptcha()
      console.error(e)
    } finally {
      setSigninPending(false)
    }
  }
  const onCaptchaVerify = (token: string, _: string) => {
    hCaptchaToken.current = token
    const formData = verifyForm(false)
    if (formData) {
      doSignIn(formData)
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
          <Alert severity="info" className="mb-5">
            {state.login.prompt}
          </Alert>
        )}
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
          <div style={{ textAlign: 'center' }}>
            <HCaptcha
              sitekey="52100d97-0777-4497-8852-e380d5b3430b"
              onVerify={onCaptchaVerify}
              ref={hCaptchaRef}
            />
          </div>
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
