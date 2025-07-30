import { useQuery } from '@tanstack/react-query'

import { useState } from 'react'

import {
  Alert,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material'

import {
  applyRenew,
  checkRenew,
  kErrRenewSameStudentId,
  queryRenew,
} from '@/apis/auth'
import Error from '@/components/Error'
import Link from '@/components/Link'
import { useAppState, useSignInChange } from '@/states'
import { gotoIdas, kIdasLogoutUrl, pages } from '@/utils/routes'

import { WebmasterContact } from './CommonLayout'
import UserList from './UserList'
import { IdasResultEx } from './common'

const IdasLogout = () => (
  <Link to={kIdasLogoutUrl} external target="_blank">
    退出登录
  </Link>
)

const Renew = () => {
  const { dispatch } = useAppState()
  const { isLoading, isError, data, refetch } = useQuery({
    queryKey: ['renew'],
    queryFn: async () => {
      const result = await checkRenew()
      if (result.require_password_signin) {
        openLogin()
      }
      return result
    },
  })
  const openLogin = () =>
    dispatch({
      type: 'open dialog',
      payload: {
        kind: 'login',
        prompt: '请使用河畔用户名与河畔密码登录后进行实名关联。',
        onlyPasswordLogin: true,
        successCallback: () => refetch,
      },
    })
  useSignInChange(refetch)
  return (
    <Stack mt={2}>
      <Typography variant="signinTitle">实名换绑</Typography>
      <Typography variant="h6" textAlign="justify" my={3}>
        拥有多个学号的用户，请使用实名换绑功能绑定最新的学号，以方便使用。
      </Typography>
      {isLoading ? (
        <Stack justifyContent="center" alignItems="center" minHeight={150}>
          <CircularProgress />
        </Stack>
      ) : isError || !data || data.require_password_signin ? (
        <Stack direction="column" alignItems="flex-start">
          <Typography mb={2}>
            请使用河畔用户名与河畔密码登录后进行实名关联。
          </Typography>
          <Button
            variant="contained"
            sx={{ fontSize: 16, px: 3, py: 1 }}
            onClick={openLogin}
          >
            立即登录
          </Button>
        </Stack>
      ) : (
        <>
          <Typography mb={2}>
            请使用
            <span
              css={{ fontSize: '1.15em', fontWeight: 'bold', color: '#ff3333' }}
            >
              最新的学号
            </span>
            登录统一身份认证。如果您已使用旧学号登录统一身份认证，请
            <IdasLogout />
            后再继续操作。
          </Typography>
          <Typography mb={2}>
            实名换绑过程中若遇到问题，请通过
            <WebmasterContact />
            联系站长。
          </Typography>
          <Stack direction="row" justifyContent="flex-start">
            <Button
              variant="contained"
              sx={{ fontSize: 16, px: 3, py: 1 }}
              onClick={() => gotoIdas({ mode: 'renew' })}
            >
              通过统一身份认证平台验证新学号
            </Button>
          </Stack>
        </>
      )}
    </Stack>
  )
}

export const RenewContinue = ({ idasResult }: { idasResult: IdasResultEx }) => {
  const auth = {
    code: idasResult.code,
    ephemeral_authorization: idasResult.ephemeral_authorization,
  }
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['renew', 'check'],
    queryFn: () => queryRenew(auth),
  })
  const [pending, setPending] = useState(false)
  const [renewError, setRenewError] = useState<unknown>()
  const [renewSuccess, setRenewSuccess] = useState(false)
  const handleRenew = async () => {
    setPending(true)
    try {
      await applyRenew(auth)
      setRenewSuccess(true)
    } catch (e) {
      setRenewError(e)
    } finally {
      setPending(false)
    }
  }
  return (
    <Stack alignItems="flex-start" px={2} maxWidth={500}>
      <Typography variant="signinTitle">
        {data?.new_bind ? '实名关联' : '实名换绑'}
      </Typography>
      {isLoading && (
        <Stack justifyContent="center" alignItems="center" minHeight={150}>
          <CircularProgress />
        </Stack>
      )}
      {isError && (
        <>
          {(error as any)?.type == 'api' &&
          (error as any).code == kErrRenewSameStudentId ? (
            <>
              <Alert severity="warning" sx={{ mt: 1 }}>
                您在统一身份认证中登录的学号已经和当前河畔账号绑定。
              </Alert>
              <Typography variant="h6" mt={1} mb={2} textAlign="justify">
                请确认您已拥有新学号，在统一身份认证系统中
                <IdasLogout />
                旧学号，然后使用
                <span
                  css={{
                    fontSize: '1.15em',
                    fontWeight: 'bold',
                    color: '#ff3333',
                  }}
                >
                  新学号
                </span>
                激活或登录统一身份认证系统，再返回清水河畔进行实名换绑。
              </Typography>
            </>
          ) : (
            <>
              <Error error={error} sx={{ mx: 0, my: 1 }} />
            </>
          )}
          <Button component={Link} to={pages.renew} variant="outlined">
            返回
          </Button>
        </>
      )}
      {data && (
        <>
          <Typography variant="h6" mt={2}>
            {data?.new_bind
              ? '下列账号将实名关联至您登录的学号，请确认：'
              : '下列账号将换绑至新学号，请确认：'}
          </Typography>
          <UserList users={data.renew_users} />
          {renewSuccess ? (
            <>
              <Typography variant="h6" mb={1} textAlign="justify">
                {data?.new_bind
                  ? '实名关联成功！今后您可通过统一身份认证登录或找回密码。'
                  : '换绑成功！今后如需通过统一身份认证登录河畔、找回密码或注册新用户，请使用新学号。'}
              </Typography>
              <Button component={Link} to={pages.index()} variant="outlined">
                返回首页
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="contained"
                disabled={pending}
                onClick={handleRenew}
                sx={{ mb: 1 }}
              >
                确认{data?.new_bind ? '关联' : '换绑'}
              </Button>
              {renewError && <Error error={renewError} />}
            </>
          )}
        </>
      )}
    </Stack>
  )
}

export default Renew
