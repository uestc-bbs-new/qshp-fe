import { useState } from 'react'
import {
  matchRoutes,
  redirect,
  useLoaderData,
  useNavigate,
  useParams,
  useRouteError,
} from 'react-router-dom'

import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'

import { idasAuth, idasChooseUser } from '@/apis/auth'
import { User } from '@/common/interfaces/base'
import { ContinueMode, kDefaultContinueMode } from '@/common/types/idas'
import Error from '@/components/Error'
import Link from '@/components/Link'
import routes from '@/routes/routes'
import { kIdasOrigin, kIdasVersion2, pages } from '@/utils/routes'
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

type Page = 'register' | 'userList' | 'resetPassword'

const Continue = () => {
  const dark = useTheme().palette.mode == 'dark'
  const idasResult = useLoaderData() as IdasResultEx
  const mode = (useParams()['mode'] as ContinueMode) || kDefaultContinueMode
  const initialPage = (() => {
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
          {page == 'resetPassword' && selectedUser && (
            <ResetPassword
              user={selectedUser}
              idasResult={idasResult}
              onClose={back}
            />
          )}
        </CommonLayout>
      </DialogContent>
    </Dialog>
  )
}

export const ContinueError = () => {
  const error = useRouteError()
  console.log(error)
  return (
    <CommonLayout>
      <Error error={error} sx={{ width: '100%' }} />
    </CommonLayout>
  )
}

const sanitizeContinuePath = (path: string | null) =>
  path && matchRoutes(routes.current, path) ? path : '/'

export const ContinueLoader = async ({
  request,
  params,
}: {
  request: Request
  params: { mode?: ContinueMode }
}) => {
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
