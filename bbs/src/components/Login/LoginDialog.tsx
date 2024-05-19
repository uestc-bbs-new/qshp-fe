import { css } from '@emotion/react'

import React, { ReactNode, useRef, useState } from 'react'

import {
  Close,
  RadioButtonChecked,
  RadioButtonUnchecked,
} from '@mui/icons-material'
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogProps,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  TextField,
  TextFieldProps,
  useMediaQuery,
} from '@mui/material'

import { signIn } from '@/apis/auth'
import logo from '@/assets/qshp-logo-outlined.png'
import { useAppState } from '@/states'
import { gotoIdas } from '@/utils/routes'
import { persistedStates } from '@/utils/storage'

import Captcha, {
  CaptchaConfiguration,
  Captcha as CaptchaType,
} from '../Captcha'
import Password from '../icons/Password'
import User from '../icons/User'

const SignInTextField = ({
  adornmentIcon,
  ...other
}: TextFieldProps & { adornmentIcon: ReactNode }) => (
  <Box position="relative">
    <TextField
      autoFocus
      fullWidth
      {...other}
      sx={(theme) => ({
        my: 1,
        '.MuiInputBase-root': {
          backgroundColor: theme.palette.mode == 'light' ? 'white' : '#999999',
          borderRadius: '8px',
        },
      })}
      InputLabelProps={{
        sx: {
          pl: '32px',
          transform: 'translate(16px, 10px)',
          '&.MuiInputLabel-shrink': {
            pl: 0,
            transitionProperty: '',
            transform: 'translate(14px, -9px) scale(0.75)',
          },
        },
      }}
      InputProps={{
        sx: {
          '& input': { pl: '48px', py: '10px' },
          '& fieldset': { border: 'none' },
        },
      }}
    />
    <Stack
      justifyContent="center"
      sx={{
        position: 'absolute',
        pl: 2,
        top: 0,
        bottom: 0,
        '& svg': {
          width: '100%',
        },
      }}
    >
      {adornmentIcon}
    </Stack>
  </Box>
)

const LoginDialog = ({ open }: { open: boolean }) => {
  const { state, dispatch } = useAppState()
  const formRef = useRef<HTMLFormElement>(null)
  const [captcha, setCaptcha] = useState<CaptchaConfiguration>()
  const captchaRef = useRef<CaptchaType>()
  const [signinPending, setSigninPending] = useState(false)
  const close = () => dispatch({ type: 'close dialog' })
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
      const result = await signIn({
        username: formData.username,
        password: formData.password,
        keep_signed_in: formData.keepSignedIn,
        ...(captchaValue && {
          captcha_value: captchaValue,
          captcha_type: captcha?.name,
        }),
      })
      persistedStates.authorizationHeader = result.authorization
      close()
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
    <TransparentBackdropBlurDialog open={open} onClose={close}>
      {state.globalDialog?.prompt && (
        <Alert severity="info">{state.globalDialog.prompt}</Alert>
      )}
      <Tabs value={0} sx={{ my: 1.5 }}>
        <Tab label="河畔密码登录" />
        <Tab label="统一身份认证登录" onClick={() => gotoIdas()} />
      </Tabs>
      <form onSubmit={onSubmit} ref={formRef}>
        <SignInTextField
          name="username"
          label="用户名"
          adornmentIcon={<User />}
        />
        <SignInTextField
          name="password"
          type="password"
          label="密码"
          adornmentIcon={<Password />}
        />
        <FormControlLabel
          control={
            <Checkbox
              name="keep_signed_in"
              value="1"
              icon={<RadioButtonUnchecked />}
              checkedIcon={<RadioButtonChecked />}
            />
          }
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
        <Stack direction="row" justifyContent="center" mb={1.5}>
          <Button onClick={() => gotoIdas({ mode: 'resetpassword' })}>
            忘记密码
          </Button>
          <Button
            onClick={() =>
              dispatch({ type: 'open dialog', payload: { kind: 'register' } })
            }
          >
            注册新用户
          </Button>
        </Stack>
        <Stack direction="row" justifyContent="center">
          <Button type="submit" disabled={signinPending} variant="contained">
            {signinPending ? '请稍候...' : '登录'}
          </Button>
        </Stack>
      </form>
      <Snackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        autoHideDuration={5000}
        anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
      >
        <Alert severity="error">{snackbarMessage}</Alert>
      </Snackbar>
    </TransparentBackdropBlurDialog>
  )
}

export const TransparentBackdropBlurDialog = ({
  children,
  onClose,
  ...props
}: DialogProps & { children: React.ReactNode }) => {
  const thinView = useMediaQuery('(max-width: 560px)')
  return (
    <Dialog
      onClose={onClose}
      {...props}
      PaperProps={{
        ...props.PaperProps,
        sx: (theme) => ({
          borderRadius: '8px',
          backgroundColor:
            theme.palette.mode == 'light'
              ? 'rgba(243, 245, 247, 0.87)'
              : 'rgba(49, 55, 66, 0.75)',
          ...(thinView && { m: 2 }),
        }),
      }}
      sx={{
        backdropFilter: 'blur(3px)',
        backgroundColor: 'rgba(189, 189, 189, 0.35)',
        ...props.sx,
      }}
    >
      {onClose && (
        <DialogTitle sx={{ p: 1 }}>
          <Stack direction="row" justifyContent="flex-end" alignItems="center">
            <IconButton onClick={(e) => onClose && onClose(e, 'escapeKeyDown')}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
      )}
      <DialogContent sx={{ px: thinView ? 3 : 5 }}>
        <Stack alignItems="center" mb={3} minWidth={thinView ? undefined : 352}>
          <img src={logo} css={css({ maxWidth: '100%' })} />
        </Stack>
        {children}
      </DialogContent>
    </Dialog>
  )
}

export default LoginDialog
