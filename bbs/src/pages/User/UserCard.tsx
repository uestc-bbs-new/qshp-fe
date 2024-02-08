import { Box, Button, Divider, Paper, Stack, Typography } from '@mui/material'

import { UserSummary } from '@/common/interfaces/user'
import Avatar from '@/components/Avatar'
import Link from '@/components/Link'
import Medals from '@/components/Medals'
import UserGroupIcon from '@/components/UserGroupIcon'
import { useAppState } from '@/states'
import { pages } from '@/utils/routes'

const UserStatEntry = ({
  title,
  value,
}: {
  title: string
  value: string | number | undefined
}) => (
  <Stack alignItems="center">
    <Typography>{title}</Typography>
    <Typography>{value}</Typography>
  </Stack>
)

const UserCard = ({ userSummary }: { userSummary?: UserSummary }) => {
  const { state } = useAppState()
  userSummary && (userSummary.friend_note = 'test')
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
                alt={userSummary?.username}
                uid={userSummary?.uid}
                size={218}
                imageSize="large"
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
                <Stack direction="row" alignItems="baseline">
                  <Typography fontSize={24} fontWeight="bold">
                    {userSummary?.username}
                  </Typography>
                  {userSummary?.friend_note && (
                    <Typography ml={1}>({userSummary.friend_note})</Typography>
                  )}
                </Stack>
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
                  component={Link}
                  to={pages.user()}
                  variant="contained"
                >
                  访问我的空间
                </Button>
              )}
            </Stack>
            <Box sx={{ width: 680, height: 62, margin: '5px' }}>
              <Stack direction="row" justifyContent="space-between">
                <UserStatEntry title="积分" value={userSummary?.credits} />
                <UserStatEntry
                  title="威望"
                  value={
                    userSummary?.ext_credits && userSummary.ext_credits['威望']
                  }
                />
                <UserStatEntry
                  title="水滴"
                  value={
                    userSummary?.ext_credits && userSummary.ext_credits['水滴']
                  }
                />
                <UserStatEntry title="好友" value={userSummary?.friends} />
                <UserStatEntry title="主题" value={userSummary?.threads} />
                <UserStatEntry title="回复" value={userSummary?.replies} />
              </Stack>
            </Box>
            <Divider />
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ width: 726, marginTop: 2 }}
            >
              <Stack direction="row" alignItems="center">
                {!!userSummary?.medals?.length && (
                  <Medals medals={userSummary.medals} />
                )}
              </Stack>
              <Stack
                direction="row"
                justifyContent="flex-end"
                alignItems="center"
                spacing={1.5}
              >
                {userSummary && state.user.uid != userSummary.uid && (
                  <Button
                    style={{
                      color: 'black',
                      backgroundColor: 'rgb(255, 255, 255)',
                      height: 32,
                      borderRadius: 8,
                    }}
                    variant="contained"
                    disabled={
                      userSummary?.blocked || !!userSummary?.friend_status
                    }
                  >
                    {userSummary.friend_status == 'friend'
                      ? '已成为好友'
                      : userSummary.friend_status == 'requested'
                        ? '已发送好友请求'
                        : '加为好友'}
                  </Button>
                )}
                {userSummary && state.user.uid != userSummary.uid && (
                  <Button variant="contained">开始私信</Button>
                )}
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Paper>
  )
}

export default UserCard
