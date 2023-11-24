import {
  Box,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material'

import Link from '@/components/Link'

const boatWheelImg = new URL(
  `../../assets/boat-wheel.png`,
  import.meta.url
).href.toString()
const listServiceItems: { link: string; name: string }[] = [
  { link: '', name: '校车时刻表' },
  { link: '', name: '失物招领' },
  { link: '', name: '校历' },
  { link: '', name: '网上报修' },
  { link: '', name: '一卡通查询' },
  { link: '', name: '信息门户' },
  { link: '', name: '后勤建议' },
  { link: '', name: '校园地图' },
  { link: '', name: '图书馆' },
]
const renderLink = (link: string, name: string, key: string) => {
  return (
    <Box>
      <Link to={link} underline="none" color="inherit" key={key}>
        <ListItemButton sx={{ width: '100%' }}>
          <Stack direction="column" spacing={1} alignItems="center">
            <img src={boatWheelImg} alt="boat-wheel" width="30" height="30" />
            <ListItemText>
              <Typography color="inherit">{name}</Typography>
            </ListItemText>
          </Stack>
        </ListItemButton>
      </Link>
    </Box>
  )
}
const CampusService = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ backgroundColor: '#699ff2', borderRadius: '8px' }}>
        <Box className="pt-3 px-8 text-white">
          <Typography sx={{ fontWeight: 'bold' }} variant="h6">
            校园服务
            <Stack direction="row" justifyContent="space-between">
              {listServiceItems.map((item) =>
                renderLink(item.link, item.name, item.name)
              )}
            </Stack>
          </Typography>
        </Box>
      </Paper>
    </Box>
  )
}
export default CampusService
