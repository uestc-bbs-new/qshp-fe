import { Box, Button, Paper, Stack, TextField, Typography } from '@mui/material'

import Avatar from '@/components/Avatar'

const Profile = () => {
  return (
    <>
      <Box className="relative overflow-hidden p-2" sx={{ width: '100%' }}>
        <Paper elevation={3} sx={{ borderRadius: '10px', overflow: 'hidden' }}>
          <Box sx={{ p: 1 }}>
            <Typography variant="h6">基本信息</Typography>
            <Stack direction="row">
              <Typography variant="h6">头像</Typography>
              <Avatar
                className="mx-3"
                uid={0}
                sx={{ width: 50, height: 50 }}
                variant="rounded"
              />
            </Stack>
            <Stack direction="row">
              <Typography variant="h6">昵称</Typography>
              <TextField />
            </Stack>
            <Stack direction="row">
              <Typography variant="h6">自我介绍</Typography>
              <TextField />
            </Stack>
            <Stack direction="row">
              <Typography variant="h6">自定义头衔</Typography>
              <TextField />
            </Stack>
            <Stack direction="row">
              <Typography variant="h6">个人签名</Typography>
              <TextField />
            </Stack>
            <Button>保存</Button>
          </Box>
        </Paper>
      </Box>
    </>
  )
}
export default Profile
