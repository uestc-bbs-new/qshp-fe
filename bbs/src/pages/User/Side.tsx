import AssessmentIcon from '@mui/icons-material/Assessment'
import { Box, Divider, Paper, Stack, Typography } from '@mui/material'

import { Visitor } from '@/common/interfaces/user'

import { VisitorList } from './Visitors'

const Side = ({
  visitors,
  visits,
}: {
  visitors?: Visitor[]
  visits?: number
}) => {
  return (
    <Box sx={{ width: 232 }} flexGrow={0} flexShrink={0}>
      <Stack direction="row" alignItems="center" sx={{ p: 1.5 }}>
        <AssessmentIcon />
        <Typography fontWeight={600} className="ml-1">
          最近访问
        </Typography>
      </Stack>
      <Divider sx={{ bgcolor: 'rgb(27, 83, 205)' }} />
      <Paper sx={{ mt: 1, px: 0.75, py: 2 }}>
        <VisitorList visitors={visitors} visits={visits} />
      </Paper>
    </Box>
  )
}

export default Side
