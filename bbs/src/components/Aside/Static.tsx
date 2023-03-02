import { useQuery } from 'react-query'

import { Box, Stack, Typography } from '@mui/material'

import { getBBSInfo } from '@/apis/common'
import Card from '@/components/Card'

const Static = () => {
  const { data: info, isLoading: infoLoading } = useQuery(['bbsInfo'], () =>
    getBBSInfo()
  )
  return (
    <Card>
      <Stack className="text-sm" direction="row" justifyContent="space-between">
        <Box>
          <Typography fontSize="inherit">今日：</Typography>
          <Typography fontSize="inherit">昨日：</Typography>
        </Box>
        <Box className="text-right">
          <Typography fontSize="inherit">
            {infoLoading ? <></> : info?.todayposts}
          </Typography>
          <Typography fontSize="inherit">
            {infoLoading ? <></> : info?.yesterdayposts}
          </Typography>
        </Box>
      </Stack>
    </Card>
  )
}

export default Static
