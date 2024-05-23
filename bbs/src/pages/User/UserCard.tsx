import { useRef, useState } from 'react'

import {
  Box,
  Button,
  Divider,
  ModalProps,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

import { addFriend } from '@/apis/user'
import { User } from '@/common/interfaces/base'
import { UserSummary } from '@/common/interfaces/user'
import Avatar from '@/components/Avatar'
import GeneralDialog, { DialogHandle } from '@/components/GeneralDialog'
import Link from '@/components/Link'
import Medals from '@/components/Medals'
import DigestAuthor from '@/components/Medals/DigestAuthor'
import UserGroupIcon from '@/components/UserGroupIcon'
import { useAppState } from '@/states'
import { pages } from '@/utils/routes'
import siteRoot from '@/utils/siteRoot'
import { handleEnter } from '@/utils/tools'

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
  const avatarSize = 200
  const avatarM = 2

  const [addFriendOpen, setAddFriendOpen] = useState(false)

  return (
    <>
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
              size={avatarSize}
              imageSize="large"
              variant="rounded"
              sx={{
                boxShadow: '4px 4px 12px rgba(0, 0, 0, 0.25)',
                backgroundColor: '#eee',
              }}
            />
          )}
        </Box>
        <Stack
          direction="row"
          py={1}
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
            <Box py={1.5}>
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
              py={1.5}
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
                {!!userSummary?.digests && (
                  <DigestAuthor
                    username={userSummary.username}
                    sx={{ mr: 1 }}
                  />
                )}
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
                    onClick={() => setAddFriendOpen(true)}
                  >
                    {userSummary.blocked
                      ? '已屏蔽'
                      : userSummary.friend_status == 'friend'
                        ? '已成为好友'
                        : userSummary.friend_status == 'requested'
                          ? '已发送好友请求'
                          : '加为好友'}
                  </Button>
                )}
                {userSummary &&
                  !userSummary.blocked &&
                  state.user.uid != userSummary.uid && (
                    <Button
                      component={Link}
                      variant="contained"
                      to={`${siteRoot}/home.php?mod=space&do=pm&subop=view&touid=${userSummary.uid}#last`}
                      external
                      target="_blank"
                    >
                      开始私信
                    </Button>
                  )}
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Paper>
      {userSummary && addFriendOpen && (
        <AddFriendDialog
          open={addFriendOpen}
          user={userSummary}
          onClose={() => setAddFriendOpen(false)}
        />
      )}
    </>
  )
}

const AddFriendDialog = ({
  user,
  open,
  onClose,
}: {
  user: User
  open: boolean
  onClose: ModalProps['onClose']
}) => {
  const dialogRef = useRef<DialogHandle>(null)
  const inputRef = useRef<HTMLInputElement>()
  return (
    <GeneralDialog
      open={open}
      onClose={onClose}
      titleText="加为好友"
      actions={[
        {
          type: 'ok',
          onClick: async () => {
            await addFriend({ uid: user.uid, message: inputRef.current?.value })
          },
        },
      ]}
      ref={dialogRef}
    >
      <Stack direction="row" alignItems="center" minWidth={320} mt={1}>
        <Avatar uid={user.uid} size={40} />
        <Typography ml={1}>{user.username}</Typography>
      </Stack>
      <TextField
        label="附言"
        sx={{ my: 3 }}
        inputRef={inputRef}
        autoFocus
        fullWidth
        onKeyDown={handleEnter(() => dialogRef.current?.ok({}))}
      />
    </GeneralDialog>
  )
}

export default UserCard
