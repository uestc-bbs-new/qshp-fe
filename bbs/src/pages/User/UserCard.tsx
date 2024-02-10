import { Box, Button, Divider, Paper, Stack, Typography } from '@mui/material'

import { UserSummary } from '@/common/interfaces/user'
import Avatar from '@/components/Avatar'
import Link from '@/components/Link'
import Medals from '@/components/Medals'
import DigestAuthor from '@/components/Medals/DigestAuthor'
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
  const avatarSize = 218
  const avatarM = 2
  return (
    <Paper
      sx={(theme) => ({
        position: 'relative',
        minHeight: `calc(${avatarSize}px + ${theme.spacing(avatarM * 2)})`,
      })}
    >
      <Box m={avatarM} position="absolute" left={0} top={0}>
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
      <Stack
        direction="row"
        pt={2}
        pb={1}
        sx={(theme) => ({
          backgroundColor:
            theme.palette.mode == 'light'
              ? 'rgb(210, 226, 253)'
              : 'rgb(12, 78, 174)',
        })}
      >
        <Box width={avatarSize} m={avatarM} flexShrink={0} />
        <Box sx={{ height: 70, margin: '6px' }} flexGrow={1}>
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
            sx={{ mr: 2 }}
            component={Link}
            to={pages.user()}
            variant="contained"
          >
            访问我的空间
          </Button>
        )}
      </Stack>
      <Stack direction="row">
        <Box width={avatarSize} m={avatarM} flexShrink={0} />
        <Stack flexGrow={1} flexShrink={1} minWidth="1em">
          <Box py={2}>
            <Stack direction="row" justifyContent="space-around">
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
            pr={2}
            mt={2}
          >
            <Stack
              direction="row"
              alignItems="center"
              mr={2}
              flexShrink={1}
              minWidth="1px"
              overflow="hidden"
              position="relative"
            >
              {!!userSummary?.digests && <DigestAuthor sx={{ mr: 1 }} />}
              {!!userSummary?.medals?.length && (
                <Medals medals={userSummary.medals} nowrap />
              )}
            </Stack>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1.5}
              flexShrink={0}
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
        </Stack>
      </Stack>
    </Paper>
  )
}

export default UserCard
