import { useState } from 'react'

import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Paper,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'

import { StyledSelect } from '@/components/StyledSelect'

const menuItems = ['公开', '好友可见', '保密', '仅注册好友可见']

const PrivacyFilter = () => {
  const theme = useTheme()

  const [friendList, setFriendList] = useState('公开')
  const [messageBorad, setMessageBorad] = useState('公开')
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
              注：您可以选择部分人看到您的主页内容
            </Typography>

            <Stack direction="row" sx={{ mb: 3 }}>
              <Typography sx={{ width: 100 }}>好友列表</Typography>
              <FormControl sx={{ width: 200 }}>
                <StyledSelect
                  value={friendList}
                  sx={{ ml: 1 }}
                  onChange={(e) => {
                    const selectedValue = e.target.value as string
                    setFriendList(selectedValue)
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
            <Stack direction="row" sx={{ mb: 3 }}>
              <Typography sx={{ width: 100 }}>留言板</Typography>
              <FormControl sx={{ width: 200 }}>
                <StyledSelect
                  value={messageBorad}
                  sx={{ ml: 1 }}
                  onChange={(e) => {
                    const selectedValue = e.target.value as string
                    setMessageBorad(selectedValue)
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
            <Stack direction="row" sx={{ mb: 3, mt: 10 }}>
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
export default PrivacyFilter
