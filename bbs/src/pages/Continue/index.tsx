import React, { useRef, useState } from 'react'
import {
  matchRoutes,
  redirect,
  useLoaderData,
  useNavigate,
  useParams,
} from 'react-router-dom'

import { PersonAddAlt1 } from '@mui/icons-material'
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar as MuiAvatar,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

import {
  checkUserName,
  idasAuth,
  idasChooseUser,
  idasFreshman,
  register,
} from '@/apis/auth'
import { IdasAuthResult } from '@/common/interfaces/response'
import Avatar from '@/components/Avatar'
import routes from '@/routes/routes'
import { setAuthorizationHeader } from '@/utils/authHeader'
import { kIdasOrigin } from '@/utils/routes'

const kTicket = 'ticket'

type IdasResultEx = IdasAuthResult & {
  ticket: string
  continue: string
}

type Mode = 'signin' | 'register' | 'resetpassword'
const kDefaultMode = 'signin'

const Continue = () => {
  const idasResult = useLoaderData() as IdasResultEx
  const mode = useParams()['mode'] as Mode | undefined

  const [pending, setPending] = useState(false)
  const [forceRegister, setRegister] = useState(mode == 'register')
  const navigate = useNavigate()
  const signIn = (user_id: number) => {
    setPending(true)
    idasChooseUser({
      user_id,
      ticket: idasResult.ticket,
      ephemeral_authorization: idasResult.ephemeral_authorization,
    })
      .then((authorization) => {
        setAuthorizationHeader(authorization)
        navigate(idasResult.continue, {
          replace: true,
        })
      })
      .catch(() => setPending(false))
  }

  return (
    <Dialog open>
      <DialogTitle>
        <Typography variant="h4">欢迎来到清水河畔！</Typography>
      </DialogTitle>
      <DialogContent>
        {idasResult.users && !forceRegister ? (
          <>
            <Typography>请选择您的账号完成登录：</Typography>
            <List>
              {idasResult.users.map((user, index) => (
                <ListItem key={index}>
                  <ListItemButton
                    disabled={pending}
                    onClick={() => signIn(user.uid)}
                  >
                    <ListItemIcon>
                      <Avatar uid={user.uid} variant="rounded" />
                    </ListItemIcon>
                    <ListItemText>
                      <Typography>{user.username}</Typography>
                    </ListItemText>
                  </ListItemButton>
                </ListItem>
              ))}
              {!!idasResult.remaining_registers && (
                <ListItem key="new">
                  <ListItemButton
                    disabled={pending}
                    onClick={() => setRegister(true)}
                  >
                    <ListItemIcon>
                      <MuiAvatar variant="rounded">
                        <PersonAddAlt1 />
                      </MuiAvatar>
                    </ListItemIcon>
                    <Typography>注册新用户</Typography>
                  </ListItemButton>
                </ListItem>
              )}
            </List>
          </>
        ) : (
          <>
            <Typography variant="h6">
              {forceRegister
                ? '请填写注册信息：'
                : '您还未注册过清水河畔账号，清填写信息完成注册：'}
            </Typography>
            <RegisterForm
              idasResult={idasResult}
              onClose={() => setRegister(false)}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

const kMinUserNameLength = 3
const kMaxUserNameLength = 15
const kMinPasswordLength = 10

const RegisterForm = ({
  idasResult,
  onClose,
}: {
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
      await idasFreshman({
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
    setAuthorizationHeader(
      await register({
        ticket: idasResult.ticket,
        ephemeral_authorization: idasResult.ephemeral_authorization,
        username: username.toString(),
        password: password.toString(),
        email: email.toString(),
      })
    )
    navigate(idasResult.continue, { replace: true })
  }
  return (
    <form ref={formRef}>
      <Grid container alignItems="center" rowSpacing={2}>
        <Grid item xs={4}>
          <Typography>用户名：</Typography>
        </Grid>
        <Grid item xs={8}>
          <TextField
            autoFocus
            fullWidth
            name="username"
            helperText={
              userNameError || '注册后不能随意修改用户名，请认真考虑后填写。'
            }
            error={!!userNameError}
            onBlur={validateUserName}
            required
          />
        </Grid>
        <Grid item xs={4}>
          <Typography>河畔密码：</Typography>
        </Grid>
        <Grid item xs={8}>
          <TextField
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
        </Grid>
        <Grid item xs={4}>
          <Typography>确认密码：</Typography>
        </Grid>
        <Grid item xs={8}>
          <TextField
            type="password"
            fullWidth
            name="password2"
            error={!!passwordError2}
            onBlur={() => validatePassword(true)}
          />
        </Grid>
        <Grid item xs={4}>
          <Typography>Email：</Typography>
        </Grid>
        <Grid item xs={8}>
          <TextField type="email" fullWidth name="email" />
        </Grid>
      </Grid>
      <Stack direction="row" justifyContent="center" alignItems="center" my={2}>
        <Button variant="contained" onClick={handleRegister}>
          立即注册
        </Button>
        <Button variant="outlined" sx={{ ml: 2 }} onClick={goFreshmanOrBack}>
          {idasResult.users ? '返回' : '到处逛逛，稍后注册'}
        </Button>
      </Stack>
    </form>
  )
}

const sanitizeContinuePath = (path: string | null) =>
  path && matchRoutes(routes.current, path) ? path : '/'

export const ContinueLoader = async ({
  request,
  params,
}: {
  request: Request
  params: { mode?: Mode }
}) => {
  const url = new URL(request.url)
  const searchParams = url.searchParams
  const ticket = searchParams.get(kTicket)
  const path = sanitizeContinuePath(searchParams.get('path'))
  if (!ticket) {
    return redirect(path)
  }
  const originalSearchParams = new URLSearchParams(searchParams)
  originalSearchParams.delete(kTicket)
  const continuePath = `${kIdasOrigin}${url.pathname}?${originalSearchParams}`
  try {
    const result = await idasAuth({
      continue: continuePath,
      ticket,
      signin: (params.mode || kDefaultMode) == 'signin',
    })
    if (result.authorization) {
      setAuthorizationHeader(result.authorization)
      return redirect(path)
    }
    return { ...result, ticket, continue: path }
  } catch (_) {
    return redirect(path)
  }
}

export default Continue
