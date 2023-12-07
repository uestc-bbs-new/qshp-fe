import { useState } from 'react'

import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Paper,
  Stack,
  Typography,
  alpha,
  useTheme,
} from '@mui/material'

import { StyledField } from '@/components/StyledField'
import { StyledSelect } from '@/components/StyledSelect'

const menuItems = [
  '无安全提问',
  '母亲的名字',
  '父亲的名字',
  '父亲出生的城市',
  '您其中一位老师的名字',
  '您个人计算机的型号',
  '您最喜欢的餐馆名称',
  '驾驶执照最后四位数字',
]

const PasswordSecurity = () => {
  const theme = useTheme()
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('')
  const [email, setEmail] = useState('')
  const [securityQuestion, setSecurityQuestion] = useState('')
  const [securityAnswer, setSecurityAnswer] = useState('')

  return (
    <>
      <Box className="relative overflow-hidden p-2" sx={{ width: '100%' }}>
        <Paper elevation={3} sx={{ borderRadius: '10px', overflow: 'hidden' }}>
          <Box sx={{ pl: 3 }}>
            <Typography
              fontSize={13}
              sx={{
                mb: 5,
                mt: 3,
                color: theme.palette.text.secondary,
              }}
            >
              <Box component="span" sx={{ color: 'red' }}>
                *
              </Box>
              注：您必须填写原密码才能修改下面的资料
            </Typography>
            <Stack direction="row" alignItems="center" sx={{ mb: 3 }}>
              <Typography sx={{ width: 100 }}>
                旧密码
                <Box component="span" sx={{ color: 'red', ml: 5 }}>
                  *
                </Box>
              </Typography>
              <StyledField
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                sx={{ width: '40%' }}
              />
            </Stack>
            <Stack direction="row">
              <Typography sx={{ width: 100 }}>新密码</Typography>
              <StyledField
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                sx={{ width: '40%' }}
              />
            </Stack>
            <Typography
              sx={{
                ml: 13,
                mt: 1,
                mb: 3,
                color: alpha(theme.palette.text.secondary, 0.3),
              }}
              fontSize={12}
            >
              如果不需要更改密码，此处请留空
            </Typography>
            <Stack direction="row">
              <Typography sx={{ width: 100 }}>确认新密码</Typography>
              <StyledField
                value={newPasswordConfirm}
                onChange={(e) => setNewPasswordConfirm(e.target.value)}
                sx={{ width: '40%' }}
              />
            </Stack>
            <Typography
              sx={{
                ml: 13,
                mt: 1,
                mb: 3,
                color: alpha(theme.palette.text.secondary, 0.3),
              }}
              fontSize={12}
            >
              如果不需要更改密码，此处请留空
            </Typography>
            <Stack direction="row" sx={{ mb: 3 }}>
              <Typography sx={{ width: 100 }}>邮箱</Typography>
              <StyledField
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ width: '40%' }}
              />
            </Stack>
            <Typography
              sx={{
                ml: 13,
                mt: 1,
                mb: 1,
                color: 'orange',
              }}
              fontSize={12}
            >
              新邮箱（{`1445987647@qq.com`}）等待验证中...
            </Typography>
            <Typography
              sx={{
                ml: 13,
                mt: 1,
                mb: 3,
                color: alpha(theme.palette.text.secondary, 0.3),
              }}
              fontSize={12}
            >
              系统已经向该邮箱发送了一封验证激活邮件，请查收邮件，进行验证激活。
              <br />
              如果哦没有收到邮件，您可以更换一个邮箱，或者
              <Button>重新接受验证邮件</Button>
            </Typography>
            <Stack direction="row" sx={{ mb: 8 }}>
              <Typography sx={{ width: 100 }}>安全提问</Typography>
              <FormControl sx={{ width: '30%' }}>
                <StyledSelect
                  value={securityQuestion}
                  onChange={(e) => {
                    const selectedValue = e.target.value as string
                    setSecurityQuestion(selectedValue)
                  }}
                >
                  {menuItems.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </StyledSelect>
              </FormControl>
            </Stack>
            <Stack direction="row" sx={{ mb: 8 }}>
              <Typography sx={{ width: 100 }}>回答</Typography>
              <StyledField
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                sx={{ width: '30%' }}
              />
            </Stack>
            <Stack direction="row" sx={{ mb: 7 }}>
              <Box sx={{ width: 100 }}></Box>
              <Button variant="contained" sx={{ px: 4 }}>
                保存
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Box>
    </>
  )
}
export default PasswordSecurity
