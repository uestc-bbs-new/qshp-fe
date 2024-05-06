import { useState } from 'react'
import {
  matchRoutes,
  redirect,
  useLoaderData,
  useNavigate,
  useParams,
  useRouteError,
  useSearchParams,
} from 'react-router-dom'

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
import { User } from '@/common/interfaces/base'
import { ContinueMode, kDefaultContinueMode } from '@/common/types/idas'
import Error from '@/components/Error'
import Link from '@/components/Link'
import routes from '@/routes/routes'
import { gotoIdas, kIdasOrigin, kIdasVersion2, pages } from '@/utils/routes'
import { persistedStates } from '@/utils/storage'

import Back from './Back'
import CommonLayout from './CommonLayout'
import { RegisterForm } from './Register'
import ResetPassword from './ResetPassword'
import UserList from './UserList'
import { IdasResultEx } from './common'

const kVersion = 'version'
const kV1Code = 'ticket'
const kV2Code = 'code'

type Page = 'register' | 'userList' | 'resetPassword' | 'renew'

const Continue = () => {
  const idasResult = useLoaderData() as IdasResultEx
  const mode = (useParams()['mode'] as ContinueMode) || kDefaultContinueMode
  const initialPage = (() => {
    if (mode == 'renew') {
      return 'renew'
    }
    if (mode == 'resetpassword') {
      const userCount = idasResult.users?.length
      if (userCount && userCount > 1) {
        return 'userList'
      }
      return 'resetPassword'
    }
    if (mode == 'register' || !idasResult.users) {
      return 'register'
    }
    return 'userList'
  })()
  const [page, setPage] = useState<Page>(initialPage)
  const [selectedUser, setSelecetdUser] = useState(
    mode == 'resetpassword' && idasResult.users?.length == 1
      ? idasResult.users[0]
      : undefined
  )

  const [pending, setPending] = useState(false)
  const navigate = useNavigate()
  const signIn = (user_id: number) => {
    setPending(true)
    idasChooseUser({
      user_id,
      code: idasResult.code,
      ephemeral_authorization: idasResult.ephemeral_authorization,
    })
      .then((result) => {
        persistedStates.authorizationHeader = result.authorization
        navigate(idasResult.continue, {
          replace: true,
        })
      })
      .catch(() => setPending(false))
  }

  const back = () => {
    if (page == initialPage) {
      navigate(pages.index())
    } else {
      setPage(initialPage)
    }
  }

  return (
    <Dialog open fullScreen>
      <DialogContent sx={{ p: 0 }}>
        <CommonLayout>
          {page == 'userList' && (
            <Box>
              <Back to={idasResult.continue} replace />
              <Typography variant="signinTitle">选择账号</Typography>
              <Typography my={2}>
                {mode == 'resetpassword'
                  ? '请选择需要重置密码的账号：'
                  : '您注册了多个账号，请选择您需要登录的账号：'}
              </Typography>
              <UserList
                idasResult={idasResult}
                disabled={pending}
                showRegister={!!idasResult.remaining_registers}
                onClick={(user: User) => {
                  if (mode == 'resetpassword') {
                    setSelecetdUser(user)
                    setPage('resetPassword')
                  } else {
                    signIn(user.uid)
                  }
                }}
                onRegister={() => setPage('register')}
              />
            </Box>
          )}
          {page == 'register' && (
            <>
              {idasResult.remaining_registers ? (
                <RegisterForm
                  freshman={!idasResult.users}
                  idasResult={idasResult}
                  onClose={back}
                />
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
            </>
          )}
          {page == 'resetPassword' && (
            <>
              {selectedUser ? (
                <ResetPassword
                  user={selectedUser}
                  idasResult={idasResult}
                  onClose={back}
                />
              ) : (
                <Stack>
                  <Typography variant="signinTitle">重置密码</Typography>
                  <Typography variant="h6" my={2}>
                    {idasResult.remaining_registers
                      ? '当前学号尚未注册过清水河畔。'
                      : '您的账号已全部删除。'}
                  </Typography>
                  <Stack direction="row">
                    {!!idasResult.remaining_registers && (
                      <Button
                        onClick={() => setPage('register')}
                        variant="contained"
                        sx={{ mr: 2 }}
                      >
                        立即注册
                      </Button>
                    )}
                    <Button variant="outlined" onClick={back}>
                      返回
                    </Button>
                  </Stack>
                </Stack>
              )}
            </>
          )}
          {page == 'renew' && (
            <Stack>
              <Typography variant="signinTitle">实名换绑</Typography>
              <Typography variant="h6" my={2}>
                下列账号将换绑至新学号，请确认：
              </Typography>
            </Stack>
          )}
        </CommonLayout>
      </DialogContent>
    </Dialog>
  )
}

export const ContinueError = () => {
  const error = useRouteError()
  const mode = useParams()['mode'] as ContinueMode | undefined
  const [searchParams] = useSearchParams()
  return (
    <Dialog open fullScreen>
      <DialogContent sx={{ p: 0 }}>
        <CommonLayout>
          <Error error={error} sx={{ width: '90%' }} small />
          <Button
            variant="outlined"
            sx={{ mt: 2 }}
            onClick={() =>
              gotoIdas({
                mode,
                continuePath: sanitizeContinuePath(searchParams.get('path')),
              })
            }
          >
            重试
          </Button>
        </CommonLayout>
      </DialogContent>
    </Dialog>
  )
}

const sanitizeContinuePath = (path: string | null) => {
  let result = '/'
  if (path) {
    const matches = matchRoutes(routes.current, path)
    console.log(matches)
    if (
      matches &&
      matches.every(
        (item) =>
          !['404', 'continue', 'register', 'resetpassword'].includes(
            item.route.id ?? ''
          )
      )
    ) {
      result = path
    }
  }
  return result
}

export const ContinueLoader = async ({
  request,
  params,
}: {
  request: Request
  params: { mode?: ContinueMode }
}) => {
  try {
    const magic = localStorage.getItem('____CYTO2____')?.split('|')
    if (
      magic &&
      magic[0] &&
      [].map
        .call(
          new Uint8Array(
            await crypto.subtle.digest(
              'SHA-256',
              new TextEncoder().encode(magic[0])
            )
          ),
          (b: number) => b.toString(16).padStart(2, '0')
        )
        .join('') ==
        '1de60b75b0e70058cf02617c2a7db8bc8490f889d1a4a772543f723b96a38834' &&
      magic[1]
    ) {
      location.href =
        magic[1] + location.pathname + location.search + location.hash
      return
    }
  } catch (_) {
    // continue on error
  }

  const url = new URL(request.url)
  const searchParams = url.searchParams
  const version = parseInt(searchParams.get(kVersion) || '0')
  const codeKey = version == kIdasVersion2 ? kV2Code : kV1Code
  const code = searchParams.get(codeKey)
  const path = sanitizeContinuePath(searchParams.get('path'))
  if (!code) {
    return redirect(path)
  }
  const originalSearchParams = new URLSearchParams(searchParams)
  originalSearchParams.delete(codeKey)
  originalSearchParams.delete(kVersion)
  const continuePath = `${kIdasOrigin}${url.pathname}?${originalSearchParams}`

  const result = await idasAuth({
    continue: continuePath,
    code,
    signin: (params.mode || kDefaultContinueMode) == 'signin',
    ...(version && { version }),
  })
  if (result.authorization) {
    persistedStates.authorizationHeader = result.authorization
    return redirect(path)
  }
  return { ...result, code, continue: path }
}

export default Continue
