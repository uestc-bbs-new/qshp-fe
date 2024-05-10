import { PlaylistRemove } from '@mui/icons-material'
import { Box, Button, Paper, Stack, Typography, useTheme } from '@mui/material'

import { UserInfo } from '@/common/interfaces/response'
import { pages } from '@/utils/routes'

import Avatar from '../Avatar'
import Link from '../Link'

type BlacklistUsersProps = {
  data: UserInfo
  className?: string
}
const BlacklistUsers = ({ data, className }: BlacklistUsersProps) => {
  const theme = useTheme()
  return (
    <Box className={`${className}`}>
      <Paper
        className={`shadow-lg pl-6 pr-2 py-4 ${className}`}
        style={{
          borderRadius: '10px',
          borderColor: theme.palette.primary.main,
        }}
        variant="outlined"
      >
        <Stack direction="row">
          <Box sx={{ mr: 2 }}>
            <Avatar
              alt={data.username}
              uid={data.user_id}
              sx={{ width: 37, height: 37 }}
              variant="rounded"
            />
          </Box>
          <Box className="flex-1">
            <Stack justifyContent="space-between">
              <Stack direction="row">
                <Link
                  to={pages.user({ uid: data.user_id })}
                  className={'line-clamp-2'}
                  underline="none"
                >
                  <Link color="inherit" underline="none">
                    {data.username}
                  </Link>
                </Link>
              </Stack>

              <Stack>
                <Typography variant="subtitle2">{data.user_group}</Typography>
              </Stack>
            </Stack>
          </Box>

          <Box sx={{ mt: 0 }}>
            <Button size="small" sx={{ py: 0 }}>
              <PlaylistRemove />
              移出黑名单
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Box>
  )
}
export default BlacklistUsers
