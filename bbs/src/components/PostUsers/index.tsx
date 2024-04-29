import React, { Box, Stack, useTheme } from '@mui/material'

import { SearchSummaryUser } from '@/common/interfaces/search'
import Chip from '@/components/Chip'
import { pages } from '@/utils/routes'

import Avatar from '../Avatar'
import Link from '../Link'

type PostProps = {
  data: SearchSummaryUser
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
            <Avatar alt={data.username} uid={data.uid} size={small ? 35 : 54} />
          </Box>
          <Box className="flex-1">
            <Stack justifyContent="space-between">
              <Stack direction="row">
                <Link
                  to={pages.user({ uid: data.uid })}
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
                      <Chip text={`${data.group_title}`} />
                    </Box>
                  </Stack>
                </Link>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Box>
  )
}

export default PostUsers
