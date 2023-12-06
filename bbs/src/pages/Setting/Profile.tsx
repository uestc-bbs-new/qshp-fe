import { useState } from 'react'

import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  TextFieldProps,
  Typography,
  alpha,
  styled,
  useTheme,
} from '@mui/material'

import Avatar from '@/components/Avatar'

const StyledField = styled((props: TextFieldProps) => (
  <TextField size="small" {...props} />
))(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    '& fieldset': {
      borderColor: '#D4E1FD',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#7d7d7d',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.mode === 'dark' ? '#95C9F8' : '#3A70F0',
    },
  },
  '& .MuiOutlinedInput-input': {
    color: theme.palette.mode === 'dark' ? '#ffffff' : '#7281A7',
  },
}))
const menuItems = ['公开', '好友可见', '保密']

const Profile = () => {
  const theme = useTheme()
  const [name, setName] = useState('之前的昵称')
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
              <Avatar
                uid={0}
                sx={{ width: 100, height: 100 }}
                variant="rounded"
              />
            </Stack>
            <Stack direction="row">
              <Typography sx={{ width: 100 }}>昵称</Typography>
              <StyledField
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={{ width: '70%' }}
              />
              <Button>修改</Button>
            </Stack>
            <Typography
              sx={{
                ml: 12,
                mt: 1,
                mb: 3,
                color: alpha(theme.palette.text.secondary, 0.3),
              }}
              fontSize={12}
            >
              您有一次免费改名的机会，如需换名，请在上面输入新的用户名，并点击“修改”按钮
            </Typography>
            <Stack direction="row" sx={{ mb: 3 }}>
              <Typography sx={{ width: 100 }}>自我介绍</Typography>
              <StyledField
                multiline
                rows={4}
                value={selfIntroduction}
                onChange={(e) => setSelfIntroduction(e.target.value)}
                sx={{ width: '70%' }}
              />
              <FormControl sx={{ width: 90, size: 'small' }}>
                <Select value={privacy}>
                  {menuItems.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
            <Stack direction="row" sx={{ mb: 3 }}>
              <Typography sx={{ width: 100 }}>自定义头衔</Typography>
              <StyledField
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                sx={{ width: '70%' }}
              />
            </Stack>
            <Stack direction="row" sx={{ mb: 3 }}>
              <Typography sx={{ width: 100 }}>个人签名</Typography>
              <StyledField
                multiline
                rows={5}
                value={sign}
                onChange={(e) => setSign(e.target.value)}
                sx={{ width: '70%' }}
              />
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
