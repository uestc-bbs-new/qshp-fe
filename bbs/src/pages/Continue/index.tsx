import React, { useState } from 'react'
import {
  matchRoutes,
  redirect,
  useLoaderData,
  useNavigate,
  useParams,
} from 'react-router-dom'

import { ArrowBackIos } from '@mui/icons-material'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  Stack,
  Typography,
} from '@mui/material'

import { idasAuth, idasChooseUser } from '@/apis/auth'
import Link from '@/components/Link'
import routes from '@/routes/routes'
import { kIdasOrigin, pages } from '@/utils/routes'
import { persistedStates } from '@/utils/storage'

import logo from '../../assets/logo-signin.png'
import { RegisterForm } from './Register'
import UserList from './UserList'
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
        persistedStates.authorizationHeader = authorization
        navigate(idasResult.continue, {
          replace: true,
        })
      })
      .catch(() => setPending(false))
  }

  return (
    <Dialog open fullScreen>
      <DialogContent sx={{ p: 0 }}>
        <Stack direction="row" flexGrow={1} flexShrink={1} minHeight={1}>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            position="relative"
            overflow="hidden"
            sx={{ width: '57%' }}
          >
            <div
              style={{
                width: 2169,
                height: 2169,
                position: 'absolute',
                right: 0,
                bottom: 0,
                transform: `translate(0, ${(247 / 1080) * 100}vh)`,
                borderRadius: '100%',
                backgroundColor: '#71ABFF',
              }}
            />
            <Box flexGrow={1}></Box>
            <Box flexGrow={0} flexShrink={0} style={{ position: 'relative' }}>
              <img src={logo} />
              <div
                style={{
                  fontSize: '60px',
                  fontWeight: '900',
                  margin: '0.5em 0',
                  color: 'white',
                }}
              >
                清水河畔
              </div>
              <div
                style={{
                  fontSize: '36px',
                  fontWeight: '900',
                  color: 'rgba(255, 255, 255, 0.56)',
                }}
              >
                电子科技大学官方论坛
              </div>
            </Box>
            <Box flexGrow={2} />
          </Stack>
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            flexGrow={1}
            flexShrink={1}
          >
            {idasResult.users && !forceRegister ? (
              <Box>
                <Link to={idasResult.continue} underline="none">
                  <Stack direction="row" alignItems="center" mb={2}>
                    <ArrowBackIos /> 返回
                  </Stack>
                </Link>
                <Typography variant="signinTitle">选择账号</Typography>
                <Typography my={2}>
                  您注册了多个账号，请选择您需要登录的账号：
                </Typography>
                <UserList
                  idasResult={idasResult}
                  disabled={pending}
                  showRegister={!!idasResult.remaining_registers}
                  onSignIn={(uid: number) => signIn(uid)}
                  onRegister={() => setRegister(true)}
                />
              </Box>
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
                  <Button
                    component={Link}
                    to={pages.index()}
                    variant="outlined"
                  >
                    返回首页
                  </Button>
                </Stack>
              </>
            )}
          </Stack>
        </Stack>
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
      persistedStates.authorizationHeader = result.authorization
      return redirect(path)
    }
    return { ...result, ticket, continue: path }
  } catch (_) {
    return redirect(path)
  }
}

export default Continue
