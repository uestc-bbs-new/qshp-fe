import AssessmentIcon from '@mui/icons-material/Assessment'
import { Box, Divider, Grid, Paper, Stack, Typography } from '@mui/material'

import { Visitor } from '@/common/interfaces/user'
import Avatar from '@/components/Avatar'
import Link from '@/components/Link'
import { chineseTime } from '@/utils/dayjs'
import { pages } from '@/utils/routes'

const Side = ({
  visitors,
  visits,
}: {
  visitors?: Visitor[]
  visits?: number
}) => {
  return (
    <Box sx={{ width: 215 }} flexGrow={0} flexShrink={0}>
      <Stack direction="row" alignItems="center" sx={{ p: 1.5 }}>
        <AssessmentIcon />
        <Typography fontWeight={600} className="ml-1">
          最近访问
        </Typography>
      </Stack>
      <Divider sx={{ bgcolor: 'rgb(27, 83, 205)' }} />
      <Paper sx={{ mt: 1, p: 2 }}>
        <Grid container spacing={2}>
          {visitors?.map((user) => (
            <Grid item xs={4} key={user.uid}>
              <Stack
                component={Link}
                to={pages.user({ uid: user.uid })}
                underline="none"
                alignItems="center"
              >
                <Avatar
                  alt={user.username}
                  uid={user.uid}
                  size={40}
                  variant="rounded"
                />
                <Typography fontSize={12}>{user.username}</Typography>
                <Typography fontSize={12} color="rgb(161, 173, 197)">
                  {chineseTime(user.dateline * 1000, { short: true })}
                </Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>
        {!!visits && (
          <Typography mt={1} color="rgba(96, 98, 102, 0.8)">
            已有 {visits} 人次来访
          </Typography>
        )}
      </Paper>
    </Box>
  )
}

export default Side
