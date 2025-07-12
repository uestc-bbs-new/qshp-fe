import { useState } from 'react'
import { useLoaderData, useNavigate, useRouteError } from 'react-router-dom'

import { Box, Button, Dialog, DialogContent, Typography } from '@mui/material'

import { verifyEmailLink } from '@/apis/auth'
import { User } from '@/common/interfaces/base'
import Error from '@/components/Error'
import Link from '@/components/Link'
import { pages } from '@/utils/routes'

import Back from './Back'
import CommonLayout from './CommonLayout'
import ResetPassword from './ResetPassword'
import UserList from './UserList'

type LoaderData = {
  users: User[]
  verify: string
}

export const EmailContinueLoader = async ({
  params,
}: {
  params: { verify?: string }
}) => {
  if (!params.verify) {
    return Promise.reject('缺少参数')
  }
  const result = await verifyEmailLink(params.verify)
  return { users: result.users, verify: params.verify }
}

export const EmailContinue = () => {
  const result = useLoaderData() as LoaderData
  const initialPage = (() => {
    const userCount = result.users.length
    if (userCount && userCount > 1) {
      return 'userList'
    }
    return 'resetPassword'
  })()
  const [page, setPage] = useState<'userList' | 'resetPassword'>(initialPage)
  const [selectedUser, setSelecetdUser] = useState(result.users[0])

  const navigate = useNavigate()

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
              <Back to={pages.resetPassword} replace />
              <Typography variant="signinTitle">选择账号</Typography>
              <Typography my={2}>请选择需要重置密码的账号：</Typography>
              <UserList
                users={result.users}
                onClick={(user: User) => {
                  setSelecetdUser(user)
                  setPage('resetPassword')
                }}
              />
            </Box>
          )}
          {page == 'resetPassword' && (
            <ResetPassword
              method="email"
              emailVerify={result.verify}
              user={selectedUser}
              users={result.users}
              onClose={back}
            />
          )}
        </CommonLayout>
      </DialogContent>
    </Dialog>
  )
}

export const EmailContinueError = () => {
  const error: any = useRouteError()
  if (error && error.type == 'http' && error.status == 401) {
    error.type = 'api'
    error.message = '邮件验证链接无效或已过期，请重新发送验证邮件。'
  }
  return (
    <Dialog open fullScreen>
      <DialogContent sx={{ p: 0 }}>
        <CommonLayout>
          <Error error={error} sx={{ width: '90%' }} small />
          <Button
            variant="outlined"
            sx={{ mt: 2 }}
            component={Link}
            to={pages.resetPasswordByEmail}
          >
            返回
          </Button>
        </CommonLayout>
      </DialogContent>
    </Dialog>
  )
}
