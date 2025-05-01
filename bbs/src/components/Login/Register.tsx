import { Button, Stack, Typography, useMediaQuery } from '@mui/material'

import Link from '@/components/Link'
import { gotoIdas } from '@/utils/routes'

export const RegisterContent = ({ small }: { small?: boolean }) => {
  const thin = useMediaQuery('(max-width: 950px)')
  return (
    <>
      <Typography
        variant="signinTitle"
        sx={small ? { fontSize: 26 } : undefined}
      >
        欢迎来到清水河畔！
      </Typography>
      <Typography variant="h6" textAlign="justify" my={3}>
        清水河畔属于高校官方论坛，账号注册时必须进行实名关联。
        <br />
        点击以下按钮，使用学号与网上服务大厅密码登录后继续注册：
      </Typography>
      <Stack direction="row" justifyContent="center">
        <Button
          variant="contained"
          sx={{ fontSize: small ? 18 : 20, px: small ? 4 : 5, py: 1.5 }}
          onClick={() => gotoIdas({ mode: 'register' })}
        >
          进入统一身份认证平台
        </Button>
      </Stack>
      {false && ( // Preserved for the next year.
        <Typography
          color="red"
          my={2}
          textAlign="justify"
          sx={{ textWrap: 'pretty' }}
        >
          2024 级新生请在
          <Link to="https://idas.uestc.edu.cn/" target="_blank" external>
            统一身份认证平台
          </Link>
          中点击登录按钮下方的“账号激活”，
          {!thin && <br />}
          填写信息完成激活后即可在此注册清水河畔。
        </Typography>
      )}
    </>
  )
}
