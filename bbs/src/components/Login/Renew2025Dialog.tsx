import { Button, Stack, Typography } from '@mui/material'

import { WebmasterContact } from '@/pages/Continue/CommonLayout'
import { useAppState } from '@/states'
import { gotoIdas } from '@/utils/routes'

import { TransparentBackdropBlurDialog } from './LoginDialog'

const Renew2025Dialog = ({ open }: { open: boolean }) => {
  return (
    <TransparentBackdropBlurDialog open={open}>
      <Typography variant="h6" textAlign="justify">
        根据相关规定，您的账号需要使用 2025
        级研究生学号进行实名关联。请您点击以下按钮，通过统一身份认证系统完成实名关联：
      </Typography>
      <Stack direction="row" justifyContent="center" my={2}>
        <Button
          variant="contained"
          sx={{ fontSize: 16, px: 3, py: 1 }}
          onClick={() => gotoIdas({ mode: 'renew' })}
        >
          通过统一身份认证平台实名关联
        </Button>
      </Stack>
      <Typography my={1}>
        如有疑问，请通过
        <WebmasterContact />
        联系站长。
      </Typography>
    </TransparentBackdropBlurDialog>
  )
}

export default Renew2025Dialog
