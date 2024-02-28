import React, { Box, Stack, Typography, useTheme } from '@mui/material'

import { UserInfo } from '@/common/interfaces/response'
import Chip from '@/components/Chip'

import Avatar from '../Avatar'
import Link from '../Link'

type PostProps = {
  data: UserInfo
  small?: boolean
  className?: string
}
const PostUsers = ({ data, small, className }: PostProps) => {
  const theme = useTheme()
  return (
    <Box className={small ? className : `${className}`}>
      <Box
        className={`rounded-lg shadow-lg p-6 ${className}`}
        style={{
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Stack direction="row">
          <Box sx={{ mr: 2 }}>
            <Avatar
              alt={data.username}
              uid={data.user_id}
              size={small ? 35 : 54}
            />
          </Box>
          <Box className="flex-1">
            <Stack justifyContent="space-between">
              <Stack direction="row">
                <Link
                  to={`/user/${data.user_id}`}
                  color="inherit"
                  underline="hover"
                  className={small ? 'line-clamp-3' : 'line-clamp-2'}
                >
                  <Stack direction={'row'}>
                    <Link color="inherit">{data.username}</Link>
                    {/* <UserCard uid={data.user_id}>
                      <Link color="inherit">{data.username}</Link>
                    </UserCard> */}
                    <Box className="line-clamp-1">
                      <Chip text={`lv.${data.user_group}`} />
                    </Box>
                  </Stack>
                </Link>
              </Stack>
              {small ? (
                <></>
              ) : (
                <Stack>
                  <Typography variant="subtitle2">
                    积分：{data.credits}
                  </Typography>
                </Stack>
              )}
            </Stack>
          </Box>
          {small ? (
            <></>
          ) : (
            <Box>
              <Stack direction="row">
                <Box>
                  <Typography className="pr-5">最后登录:</Typography>
                </Box>
                <Box>
                  <Typography>{data.last_login_at}</Typography>
                </Box>
              </Stack>
            </Box>
          )}
        </Stack>
      </Box>
    </Box>
  )
}

export default PostUsers
