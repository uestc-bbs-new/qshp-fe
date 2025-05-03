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

const AccountSecurity = () => {
  const theme = useTheme()
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('')
  const [email, setEmail] = useState('')

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
            <Stack direction="row" alignItems="center">
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
            <Stack direction="row" alignItems="center">
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
            <Stack direction="row" alignItems="center" sx={{ mb: 8 }}>
              <Typography sx={{ width: 100 }}>邮箱</Typography>
              <StyledField
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ width: '40%' }}
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
export default AccountSecurity
