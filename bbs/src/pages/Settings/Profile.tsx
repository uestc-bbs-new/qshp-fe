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

import Avatar from '@/components/Avatar'
import { StyledField } from '@/components/StyledField'
import { StyledSelect } from '@/components/StyledSelect'

import ProfileSign from './ProfileSign'

const menuItems = ['公开', '好友可见', '保密']

const Profile = () => {
  const theme = useTheme()
  const [name, setName] = useState('之前的用户名')
  const [selfIntroduction, setSelfIntroduction] = useState('之前的自我介绍')
  const [title, setTitle] = useState('之前的自定义头衔')
  const [sign, setSign] = useState('之前的个人签名')
  const [privacy, setPrivacy] = useState('公开')

  return (
    <>
      <Box className="relative overflow-hidden p-2" sx={{ width: '100%' }}>
        <Paper elevation={3} sx={{ borderRadius: '10px', overflow: 'hidden' }}>
          <Box sx={{ pl: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, mt: 3 }}>
              基本信息
            </Typography>
            <Stack direction="row" alignItems="center" sx={{ mb: 3 }}>
              <Typography sx={{ width: 100 }}>头像</Typography>
              <Avatar uid={0} size={100} />
            </Stack>
            <Stack direction="row" alignItems="center">
              <Typography sx={{ width: 100 }}>用户名</Typography>
              <StyledField
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={{ width: '35%' }}
              />
              <Button>修改</Button>
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
              您有一次免费改名的机会，如需换名，请在上面输入新的用户名，并点击“修改”按钮
            </Typography>
            <Stack direction="row" sx={{ mb: 3 }}>
              <Typography sx={{ width: 100, mt: 1 }}>自我介绍</Typography>
              <StyledField
                multiline
                rows={4}
                value={selfIntroduction}
                onChange={(e) => setSelfIntroduction(e.target.value)}
                sx={{ width: '70%' }}
              />
              <FormControl sx={{ width: 90 }}>
                <StyledSelect value={privacy} sx={{ ml: 1 }}>
                  {menuItems.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </StyledSelect>
              </FormControl>
            </Stack>
            <Stack direction="row" alignItems="center" sx={{ mb: 3 }}>
              <Typography sx={{ width: 100 }}>自定义头衔</Typography>
              <StyledField
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                sx={{ width: '70%' }}
              />
            </Stack>
            <Stack direction="row" sx={{ mb: 3 }}>
              <Typography sx={{ width: 100, mt: 1 }}>个人签名</Typography>
              <ProfileSign />
            </Stack>
            <Stack direction="row" sx={{ mb: 3 }}>
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
export default Profile
