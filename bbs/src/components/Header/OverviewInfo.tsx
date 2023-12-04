import { InsertChart } from '@mui/icons-material'
import { Box, Divider, Typography } from '@mui/material'

import Link from '../Link'

const Divider_ = () => {
  return (
    <Divider
      orientation="vertical"
      variant="middle"
      sx={{ height: 15, mx: 1 }}
    ></Divider>
  )
}
const OverviewInfo = () => {
  return (
    <Box display="flex" alignItems="center" sx={{ my: 2 }}>
      <InsertChart sx={{ color: '#74EAE9', mr: 1 }} />
      <Typography color="grey">今日：</Typography>
      1605
      <Divider_ />
      <Typography color="grey">昨日：</Typography>
      1865
      <Divider_ />
      <Typography color="grey">帖子：</Typography>
      30303156
      <Divider_ />
      <Typography color="grey">会员：</Typography>
      213326
      <Divider_ />
      <Typography color="grey">欢迎新会员：</Typography>
      <Link to={`/user`} underline="none" color="#4AB8BB">
        WULALA-
      </Link>
    </Box>
  )
}
export default OverviewInfo
