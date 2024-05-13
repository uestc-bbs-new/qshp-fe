import {
  Box,
  Button,
  Divider,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'

import { UserInfo } from '@/common/interfaces/response'
import BlacklistUser from '@/components/BlacklistUser'

const userInfo: UserInfo = {
  user_id: 1,
  username: '小鼠同学',
  user_group: 123,
  credits: 100,
  last_login_at: Date.now(),
}

const Blacklist = () => {
  const theme = useTheme()

  return (
    <>
      <Box className="relative overflow-hidden p-2" sx={{ width: '100%' }}>
        <Paper elevation={3} sx={{ borderRadius: '10px', overflow: 'hidden' }}>
          <Box sx={{ pl: 3 }}>
            <Stack direction="row" alignItems="center" sx={{ my: 2 }}>
              <Typography>添加黑名单成员</Typography>
              <TextField
                sx={{ width: '50%', mx: 2 }}
                size="small"
                variant="outlined"
                placeholder="输入用户名"
              />
              <Button variant="contained" style={{ minWidth: '10px' }}>
                添加
              </Button>
            </Stack>
          </Box>
          <Divider
            variant="middle"
            style={{ backgroundColor: 'rgba(128, 128, 128, 0.3)' }}
          />
          <Grid container spacing={3} sx={{ p: 3 }}>
            {Array.from(new Array(5)).map((_, index) => (
              <Grid item xs={4} key={index} sx={{ py: 1 }}>
                <BlacklistUser data={userInfo} />
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>
    </>
  )
}
export default Blacklist
