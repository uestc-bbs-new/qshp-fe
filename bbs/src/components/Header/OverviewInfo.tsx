import { InsertChart } from '@mui/icons-material'
import { Box, Divider, Skeleton, Typography } from '@mui/material'

import { GlobalStat } from '@/common/interfaces/response'
import { pages } from '@/utils/routes'

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
const OverviewInfo = ({ data }: { data?: GlobalStat }) => {
  return (
    <Box display="flex" alignItems="center" sx={{ my: 2 }}>
      <InsertChart sx={{ color: '#74EAE9', mr: 1 }} />
      {data ? (
        <>
          <Typography color="grey">今日：</Typography>
          {data.today_posts}
          <Divider_ />
          <Typography color="grey">昨日：</Typography>
          {data.yesterday_posts}
          <Divider_ />
          <Typography color="grey">帖子：</Typography>
          {data.total_posts}
          <Divider_ />
          <Typography color="grey">会员：</Typography>
          {data.total_users}
          {data.new_user && (
            <>
              <Divider_ />
              <Typography color="grey">欢迎新会员：</Typography>
              <Link
                to={pages.user({ username: data.new_user.username })}
                underline="none"
                color="#4AB8BB"
              >
                {data.new_user.username}
              </Link>
            </>
          )}
          {!!data.online_users && (
            <>
              <Divider_ />
              <Typography color="grey">在线用户：</Typography>
              {data.online_users}
            </>
          )}
        </>
      ) : (
        <Skeleton sx={{ flexGrow: 1 }} />
      )}
    </Box>
  )
}
export default OverviewInfo
