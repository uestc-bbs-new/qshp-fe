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
      <Typography variant="h5" textAlign="justify" my={2} color="red">
        根据
        <Link
          to="https://info.uestc.edu.cn/info/1015/4154.htm"
          target="_blank"
          external
        >
          学校安排
        </Link>
        ，统一身份认证系统在 5 月 30 日（周五）22:00 至 6 月 1 日（周日）08:00
        期间处于维护状态。如果您在下一步的操作中遇到问题，请过一段时间后再重试。如有其他疑问请通过清水河畔官方
        QQ 号 1942224235 联系站长。
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
