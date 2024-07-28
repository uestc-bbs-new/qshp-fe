import { Button, Stack, Typography } from '@mui/material'

import Link from '@/components/Link'
import { gotoIdas } from '@/utils/routes'

export const RegisterContent = ({ small }: { small?: boolean }) => (
  <>
    <Typography variant="signinTitle" sx={small ? { fontSize: 26 } : undefined}>
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
    <Typography color="red" my={2}>
      2024 级本科生预计 8 月中旬可在
      <Link to="https://freshman.uestc.edu.cn/" target="_blank" external>
        迎新系统
      </Link>
      查询学号，在统一身份认证平台
      <br />
      激活账号后即可注册清水河畔，敬请期待。
    </Typography>
    <Stack direction="row" justifyContent="flex-end" mt={3}>
      <Link
        external
        to="/member.php?mod=register&forceold=1"
        target="_blank"
        underline="hover"
        sx={{ color: '#ccc' }}
      >
        返回旧版
      </Link>
    </Stack>
  </>
)
