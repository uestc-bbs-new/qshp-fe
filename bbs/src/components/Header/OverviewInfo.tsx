import { InsertChart } from '@mui/icons-material'
import { Divider, Skeleton, Stack, Typography } from '@mui/material'

import { GlobalStat } from '@/common/interfaces/response'
import { pages } from '@/utils/routes'

import Link from '../Link'
import Separated from '../Separated'

const OverviewInfo = ({ data }: { data?: GlobalStat }) => (
  <Stack
    direction="row"
    alignItems="center"
    flexWrap="wrap"
    flexGrow={1}
    flexShrink={1}
  >
    <InsertChart sx={{ color: '#74EAE9', mr: 1 }} />
    {data ? (
      <Separated
        separator={
          <Divider
            orientation="vertical"
            variant="middle"
            sx={{ height: 15, mx: 1 }}
          />
        }
      >
        <>
          <Typography color="grey">今日：</Typography>
          {data.today_posts}
        </>
        <>
          <Typography color="grey">昨日：</Typography>
          {data.yesterday_posts}
        </>
        <>
          <Typography color="grey">帖子：</Typography>
          {data.total_posts}
        </>
        <>
          <Typography color="grey">会员：</Typography>
          {data.total_users}
        </>
        {data.new_user && (
          <>
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
            <Typography color="grey">在线用户：</Typography>
            {data.online_users}
          </>
        )}
      </Separated>
    ) : (
      <Skeleton width="60%" />
    )}
  </Stack>
)

export const OverviewInfoMobile = ({ data }: { data?: GlobalStat }) =>
  data ? (
    <Stack
      direction="row"
      px={1}
      spacing={2}
      justifyContent="space-between"
      mt={1}
      pb={8}
    >
      <Stack flexShrink={0}>
        <Stack direction="row">
          <Typography color="grey" component="span">
            今日：
          </Typography>
          {data.today_posts}
        </Stack>
        <Stack direction="row">
          <Typography color="grey" component="span">
            昨日：
          </Typography>
          {data.yesterday_posts}
        </Stack>
        <Stack direction="row">
          <Typography color="grey" component="span">
            帖子：
          </Typography>
          {data.total_posts}
        </Stack>
      </Stack>
      <Stack>
        {!!data.online_users && (
          <Stack direction="row">
            <Typography color="grey">在线用户：</Typography>
            {data.online_users}
          </Stack>
        )}
        <Stack direction="row">
          <Typography color="grey" component="span">
            会员：
          </Typography>
          {data.total_users}
        </Stack>
        {data.new_user && (
          <Stack direction="row">
            <Typography color="grey" component="span" sx={{ flexShrink: 0 }}>
              新会员：
            </Typography>
            <Link
              to={pages.user({ username: data.new_user.username })}
              underline="none"
              color="#4AB8BB"
            >
              {data.new_user.username}
            </Link>
          </Stack>
        )}
      </Stack>
    </Stack>
  ) : (
    <></>
  )
export default OverviewInfo
