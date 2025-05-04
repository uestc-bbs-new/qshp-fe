import { useQuery } from '@tanstack/react-query'

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

import { getSecuritySettings, kStatusUnbound } from '@/apis/settings'
import Avatar from '@/components/Avatar'
import Link from '@/components/Link'
import { StyledField } from '@/components/StyledField'
import { StyledSelect } from '@/components/StyledSelect'
import { pages } from '@/utils/routes'

const fieldSx = { width: 100, flexShrink: 0 }

const AccountSecurity = () => {
  const theme = useTheme()
  const [changePassword, setChangePassword] = useState(false)
  const [changeEmail, setChangeEmail] = useState(false)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('')
  const [email, setEmail] = useState('')

  const { data } = useQuery({
    queryKey: ['settings', 'security'],
    queryFn: getSecuritySettings,
  })

  return (
    <>
      <Box className="relative overflow-hidden p-2" sx={{ width: '100%' }}>
        <Paper elevation={3} sx={{ borderRadius: '10px', overflow: 'hidden' }}>
          <Box px={3}>
            {!changePassword && (
              <Stack direction="row" alignItems="flex-start" my={3}>
                <Typography sx={fieldSx}>河畔密码</Typography>
                <Stack alignItems="flex-start">
                  <Typography>
                    通过用户名密码登录时需输入河畔密码，请您确保密码的安全性并妥善保存。
                  </Typography>
                  <Button
                    variant="outlined"
                    sx={{ mt: 1 }}
                    onClick={() => setChangePassword(true)}
                  >
                    修改密码
                  </Button>
                </Stack>
              </Stack>
            )}
            {(changePassword || changeEmail) && (
              <>
                <Stack direction="row" alignItems="center" mt={3}>
                  <Typography sx={fieldSx}>
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
                <Typography
                  ml={13}
                  mt={1}
                  mb={3}
                  sx={{
                    color: alpha(theme.palette.text.secondary, 0.3),
                  }}
                  fontSize={12}
                >
                  如需更改河畔密码或邮箱，请先输入当前密码。
                </Typography>
              </>
            )}
            {changePassword && (
              <>
                <Stack direction="row" alignItems="center" my={3}>
                  <Typography sx={fieldSx}>新密码</Typography>
                  <StyledField
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    sx={{ width: '40%' }}
                  />
                </Stack>
                <Stack direction="row" alignItems="center" my={3}>
                  <Typography sx={fieldSx}>确认新密码</Typography>
                  <StyledField
                    value={newPasswordConfirm}
                    onChange={(e) => setNewPasswordConfirm(e.target.value)}
                    sx={{ width: '40%' }}
                  />
                </Stack>
              </>
            )}
            {changeEmail ? (
              <Stack direction="row" alignItems="center" my={3}>
                <Typography sx={fieldSx}>邮箱</Typography>
                <StyledField
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{ width: '40%' }}
                />
              </Stack>
            ) : (
              <Stack direction="row" alignItems="flex-start" my={3}>
                <Typography sx={fieldSx}>邮箱</Typography>
                <Stack alignItems="flex-start">
                  <Typography>{data?.email}</Typography>
                  <Typography>
                    该邮箱用于找回密码，请确认邮箱地址准确无误，建议填写常用邮箱。
                  </Typography>
                  <Button
                    sx={{ mt: 1 }}
                    variant="outlined"
                    onClick={() => {
                      setChangeEmail(true)
                      if (data?.email) {
                        setEmail(data?.email)
                      }
                    }}
                  >
                    修改邮箱
                  </Button>
                </Stack>
              </Stack>
            )}
            <Stack direction="row" alignItems="flex-start" my={3}>
              <Typography sx={fieldSx}>实名关联</Typography>
              <Stack alignItems="flex-start">
                {data?.bind_status == kStatusUnbound ? (
                  <>
                    <Typography>您还未实名关联！</Typography>
                  </>
                ) : (
                  <>
                    <Typography>
                      您已实名关联，该学号关联了以下用户：
                    </Typography>
                    {data?.bind_users?.map((item) => (
                      <Stack
                        direction="row"
                        alignItems="center"
                        key={item.uid}
                        my={1}
                      >
                        <Avatar uid={item.uid} size={32} />
                        <Link to={pages.user({ uid: item.uid })} ml={1}>
                          {item.username}
                        </Link>
                      </Stack>
                    ))}
                    <Typography>
                      拥有多个学号的在校用户，请及时绑定至最新学号，以方便使用统一身份认证登录及密码找回功能。
                    </Typography>
                  </>
                )}
                <Button variant="outlined" sx={{ mt: 1 }}>
                  {data?.bind_status == kStatusUnbound
                    ? '实名关联'
                    : '实名换绑'}
                </Button>
              </Stack>
            </Stack>
            <Stack direction="row" sx={{ mb: 7 }}>
              <Box sx={fieldSx}></Box>
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
