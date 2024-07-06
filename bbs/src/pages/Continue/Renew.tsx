import { Button, Stack, Typography } from '@mui/material'

import Link from '@/components/Link'
import { gotoIdas } from '@/utils/routes'

const Renew = () => {
  return (
    <Stack mt={2}>
      <Typography variant="signinTitle">实名换绑</Typography>
      <Typography variant="h6" textAlign="justify" my={3}>
        拥有多个学号的用户，请使用实名换绑功能绑定最新的学号，以方便使用。
      </Typography>
      <Typography mb={2}>
        请使用
        <span
          css={{ fontSize: '1.15em', fontWeight: 'bold', color: '#ff3333' }}
        >
          最新的学号
        </span>
        登录统一身份认证。如果您已使用旧学号登录统一身份认证，请
        <Link
          to="https://authserver.uestc.edu.cn/authserver/logout"
          external
          target="_blank"
        >
          退出登录
        </Link>
        后再继续操作。
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
    </Stack>
  )
}

export default Renew
