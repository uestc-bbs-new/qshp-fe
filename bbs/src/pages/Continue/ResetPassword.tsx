import { css } from '@emotion/react'

import { useRef, useState } from 'react'

import {
  Alert,
  Button,
  Dialog,
  DialogContent,
  Stack,
  Typography,
} from '@mui/material'

import { resetPassword } from '@/apis/auth'
import { User } from '@/common/interfaces/base'
import Error from '@/components/Error'
import Link from '@/components/Link'
import { gotoIdas, pages } from '@/utils/routes'

import CommonLayout from './CommonLayout'
import { CommonForm } from './Forms'
import { PasswordInput } from './Password'
import { IdasResultEx } from './common'

const ResetPassword = ({
  user,
  idasResult,
  onClose,
}: {
  user: User
  idasResult: IdasResultEx
  onClose: () => void
}) => {
  const formRef = useRef<HTMLFormElement>(null)
  const passwordValid = useRef(false)
  const [apiError, setApiError] = useState<unknown>()
  const [success, setSuccess] = useState(false)
  const [pending, setPending] = useState(false)

  const getFormField = (name: string) => {
    if (!formRef.current) {
      return ''
    }
    return (new FormData(formRef.current).get(name) || '').toString()
  }

  const handleReset = async () => {
    const password = getFormField('password')
    if (!passwordValid.current || !password) {
      return
    }
    setPending(true)
    try {
      await resetPassword({
        code: idasResult.code,
        ephemeral_authorization: idasResult.ephemeral_authorization,
        user_id: user.uid,
        password,
      })
    } catch (e) {
      setApiError(e)
      return
    } finally {
      setPending(false)
    }
    setSuccess(true)
  }
  return (
    <CommonForm
      title={<Typography variant="signinTitle">重置密码</Typography>}
      onClose={onClose}
      ref={formRef}
    >
      <tr>
        <th>
          <Typography>用户名</Typography>
        </th>
        <td css={css({ padding: '16.5px 0.5em' })}>
          <Typography>{user.username}</Typography>
        </td>
      </tr>
      <PasswordInput
        onValidated={(valid) => (passwordValid.current = valid)}
        disabled={pending}
      />
      <tr>
        <th></th>
        <td>
          <Stack
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
            my={2}
          >
            {success && idasResult.users && idasResult.users.length > 1 && (
              <Button variant="outlined" onClick={onClose} sx={{ mr: 2 }}>
                重置其他账号
              </Button>
            )}
            {success && (
              <Button component={Link} to={pages.index()} variant="contained">
                返回首页
              </Button>
            )}
            {!success && (
              <Button
                disabled={pending}
                variant="contained"
                onClick={handleReset}
              >
                重置密码
              </Button>
            )}
          </Stack>
          {success && (
            <Alert severity="success">密码已重置，请使用新密码登录。</Alert>
          )}
          {!!apiError && <Error error={apiError} />}
        </td>
      </tr>
    </CommonForm>
  )
}

export const ResetPasswordHome = () => {
  return (
    <Dialog open fullScreen>
      <DialogContent sx={{ p: 0 }}>
        <CommonLayout>
          <Stack pl={2} pr={4}>
            <Typography variant="signinTitle">忘记密码</Typography>
            <Typography variant="h6" textAlign="justify" my={3}>
              在校用户请通过统一身份认证验证后重置密码：
            </Typography>
            <Stack direction="row" justifyContent="flex-start">
              <Button
                variant="contained"
                sx={{ fontSize: 20, px: 5, py: 1.5 }}
                onClick={() => gotoIdas({ mode: 'resetpassword' })}
              >
                进入统一身份认证平台
              </Button>
            </Stack>
            <Typography variant="h6" textAlign="justify" mt={6}>
              如果您无法通过统一身份认证平台登录，请通过清水河畔官方 QQ 号
              1942224235 联系站长。
            </Typography>
            <Stack direction="row" justifyContent="flex-end" mt={2}>
              <Link
                external
                to="/plugin.php?id=rnreg:resetpassword&forceold=1"
                target="_blank"
                underline="hover"
                sx={{ color: '#ccc' }}
              >
                返回旧版
              </Link>
            </Stack>
          </Stack>
        </CommonLayout>
      </DialogContent>
    </Dialog>
  )
}

export default ResetPassword
