import { Box, Button, Divider, Paper, Stack, Typography } from '@mui/material'

import { UserSummary } from '@/common/interfaces/user'
import Avatar from '@/components/Avatar'
import UserGroupIcon from '@/components/UserGroupIcon'
import { useAppState } from '@/states'

const UserCard = ({ userSummary }: { userSummary?: UserSummary }) => {
  const basicIfo = [
    { id: 1, info: '积分' },
    { id: 2, info: '威望' },
    { id: 3, info: '水滴' },
    { id: 4, info: '好友' },
    { id: 5, info: '主题' },
    { id: 6, info: '回复' },
  ]
  const { state } = useAppState()
  return (
    <Paper>
      <Box
        sx={{
          backgroundImage:
            'linear-gradient(to bottom, rgb(210, 226, 253) 0%, rgb(210, 226, 253) 35%, rgb(255, 255, 255) 36%, rgb(255, 255, 255) 100%)',
        }}
      >
        <Stack direction="row">
          <Box sx={{ margin: 18 + 'px' }}>
            {userSummary && (
              <Avatar
                alt="0"
                uid={userSummary?.uid}
                sx={{ width: 218, height: 218 }}
                variant="rounded"
              />
            )}
          </Box>
          <Box>
            <Stack
              direction="row"
              className="mt-5"
              justifyContent="space-between"
            >
              <Box sx={{ height: 70, margin: '6px' }}>
                <Typography fontSize={24} fontWeight="bold">
                  {userSummary?.username}
                </Typography>
                <Stack
                  direction="row"
                  className="pr-2"
                  spacing={2}
                  alignItems="center"
                >
                  <Typography>{userSummary?.group_title}</Typography>
                  {userSummary?.group_subtitle && (
                    <Typography> ({userSummary.group_subtitle})</Typography>
                  )}
                  <UserGroupIcon user={userSummary} />
                </Stack>
              </Box>
              {userSummary && userSummary.uid != state.user.uid && (
                <Button
                  style={{
                    color: 'black',
                    backgroundColor: 'rgb(255, 255, 255)',
                    height: 32,
                    marginTop: 8,
                    borderRadius: 8,
                  }}
                  variant="contained"
                >
                  访问我的空间
                </Button>
              )}
            </Stack>
            <Box sx={{ width: 680, height: 62, margin: '5px' }}>
              <Stack direction="row" justifyContent="space-between">
                {basicIfo.map((item, index) => {
                  return (
                    <Stack alignItems="center" key={item.id}>
                      <Typography>{item.info}</Typography>
                      <Typography></Typography>
                    </Stack>
                  )
                })}
              </Stack>
            </Box>
            <Divider />
            <Box sx={{ width: 726, marginTop: 2 }}>
              <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
                <Button
                  style={{
                    color: 'black',
                    backgroundColor: 'rgb(255, 255, 255)',
                    height: 32,
                    borderRadius: 8,
                  }}
                  variant="contained"
                >
                  加为好友
                </Button>
                <Button variant="contained">开始私信</Button>
              </Stack>
            </Box>
          </Box>
        </Stack>
      </Box>
    </Paper>
  )
}

export default UserCard
