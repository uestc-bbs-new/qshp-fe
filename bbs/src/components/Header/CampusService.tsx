import {
  Box,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material'

import boatWheelImg from '@/assets/boat-wheel.png'
import Link from '@/components/Link'
import { pages } from '@/utils/routes'

type NavLink = {
  link: string
  name: string
  external: boolean
}

const listServiceItems: NavLink[] = [
  {
    link: pages.thread(1430861),
    name: '校车时刻表',
    external: false,
  },
  { link: pages.forum(305), name: '失物招领', external: false },
  { link: pages.thread(1493930), name: '校历', external: false },
  {
    link: 'https://hq.uestc.edu.cn/web/detail.jsp?article_id=4645',
    name: '网上报修',
    external: true,
  },
  { link: 'https://ecard.uestc.edu.cn/', name: '一卡通查询', external: true },
  {
    link: 'https://eportal.uestc.edu.cn/',
    name: '网上服务大厅',
    external: true,
  },
  {
    link: 'https://hq.uestc.edu.cn/yzs/commentSite/commentSiteIndex',
    name: '后勤建议',
    external: true,
  },
  { link: 'https://gis.uestc.edu.cn/', name: '校园地图', external: true },
  { link: 'https://www.lib.uestc.edu.cn/', name: '图书馆', external: true },
]

const CampusService = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ backgroundColor: '#699ff2', borderRadius: '8px' }}>
        <Box className="px-8 pt-1 pb-3 text-white">
          <Typography sx={{ fontWeight: 'bold' }} variant="h6" my={0.5}>
            校园服务
          </Typography>
          <Stack direction="row" justifyContent="space-between">
            {listServiceItems.map((item, index) => (
              <Box key={index}>
                <Link
                  to={item.link}
                  external={item.external}
                  target={item.external ? '_blank' : undefined}
                  underline="none"
                  color="inherit"
                >
                  <ListItemButton sx={{ width: '100%' }}>
                    <Stack direction="column" spacing={1} alignItems="center">
                      <img
                        src={boatWheelImg}
                        alt="boat-wheel"
                        width="30"
                        height="30"
                      />
                      <ListItemText>
                        <Typography color="inherit">{item.name}</Typography>
                      </ListItemText>
                    </Stack>
                  </ListItemButton>
                </Link>
              </Box>
            ))}
          </Stack>
        </Box>
      </Paper>
    </Box>
  )
}
export default CampusService
