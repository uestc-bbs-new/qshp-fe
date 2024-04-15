import { css } from '@emotion/react'

import { useRef } from 'react'

import { Button, Stack, Typography } from '@mui/material'

import { resetPassword } from '@/apis/auth'
import { User } from '@/common/interfaces/base'

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
    await resetPassword({
      code: idasResult.code,
      ephemeral_authorization: idasResult.ephemeral_authorization,
      user_id: user.uid,
      password,
    })
    alert('密码已重置！')
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
      <PasswordInput onValidated={(valid) => (passwordValid.current = valid)} />
      <tr>
        <th></th>
        <td>
          <Stack
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
            my={2}
          >
            <Button variant="contained" onClick={handleReset}>
              重置密码
            </Button>
          </Stack>
        </td>
      </tr>
    </CommonForm>
  )
}

export default ResetPassword
