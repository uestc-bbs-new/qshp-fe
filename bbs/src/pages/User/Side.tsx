import AssessmentIcon from '@mui/icons-material/Assessment'
import { Box, Divider, Grid, Paper, Stack, Typography } from '@mui/material'

import Avatar from '@/components/Avatar'

const Side = () => {
  const users = [
    { id: 1, name: 'user1', time: '2小时前' },
    { id: 2, name: 'user2', time: '2小时前' },
    { id: 3, name: 'user3', time: '2小时前' },
    { id: 4, name: 'user3', time: '2小时前' },
  ]
  return (
    <Box sx={{ width: 215 }}>
      <Stack direction="row" justifyContent="space-between" sx={{ p: 1.5 }}>
        <Stack direction="row">
          <AssessmentIcon />
          <Typography fontWeight={600} className="ml-1">
            最近访问
          </Typography>
        </Stack>
        <Typography color="rgba(96, 98, 102, 0.8)">已有45人来过</Typography>
      </Stack>
      <Divider sx={{ bgcolor: 'rgb(27, 83, 205)' }} />
      <Paper sx={{ mt: 1, p: 2 }}>
        <Grid container spacing={2}>
          {users.map((user) => (
            <Grid item xs={4} key={user.id}>
              <Box sx={{ textAlign: 'center' }}>
                <Avatar
                  alt="0"
                  uid={0}
                  sx={{ width: 40, height: 40 }}
                  variant="rounded"
                />
                <Typography fontSize={12}>{user.name}</Typography>
                <Typography fontSize={12} color="rgb(161, 173, 197)">
                  {user.time}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  )
}

export default Side
