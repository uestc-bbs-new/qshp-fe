import React, { useState } from 'react'
import {
  matchRoutes,
  redirect,
  useLoaderData,
  useNavigate,
  useParams,
} from 'react-router-dom'

import { PersonAddAlt1 } from '@mui/icons-material'
import {
  Alert,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar as MuiAvatar,
  Stack,
  Typography,
} from '@mui/material'

import { idasAuth, idasChooseUser } from '@/apis/auth'
import Avatar from '@/components/Avatar'
import Link from '@/components/Link'
import routes from '@/routes/routes'
import { setAuthorizationHeader } from '@/utils/authHeader'
import { kIdasOrigin, pages } from '@/utils/routes'

import { RegisterForm } from './Register'
import { IdasResultEx } from './common'

const kTicket = 'ticket'

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
        ) : idasResult.remaining_registers ? (
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
        ) : (
          <>
            <Alert severity="error">
              每个学号最多注册三个用户，您的注册次数已用完，无法注册新用户。
            </Alert>
            <Stack alignItems="center" mt={2}>
              <Button component={Link} to={pages.index()} variant="outlined">
                返回首页
              </Button>
            </Stack>
          </>
        )}
      </DialogContent>
    </Dialog>
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
