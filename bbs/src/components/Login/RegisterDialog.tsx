import { useEffect } from 'react'

import { Typography } from '@mui/material'

import { gotoIdas } from '@/utils/routes'

import { TransparentBackdropBlurDialog } from './LoginDialog'

const RegisterDialog = ({ open }: { open: boolean }) => {
  useEffect(() => {
    setTimeout(() => gotoIdas({ mode: 'register' }), 1000)
  }, [])
  return (
    <TransparentBackdropBlurDialog open={open}>
      <Typography variant="h5" my={2}>
        即将跳转至电子科技大学统一身份认证平台，请使用学号登录后继续注册...
      </Typography>
    </TransparentBackdropBlurDialog>
  )
}

export default RegisterDialog
