import { useLocation } from 'react-router-dom'

import { Box, Stack, Typography, useTheme } from '@mui/material'

import Announcement from '../Announcement'
import Banner from '../Banner'
import Breadcrumbs from '../Breadcurmbs'
import CampusService from './CampusService'

const headerImg = new URL(
  `../../assets/header.jpg`,
  import.meta.url
).href.toString()

const WelcomeBanner = () => {
  const theme = useTheme()
  return (
    <>
      <Announcement />
      <Banner src={headerImg}>
        <Box className="text-white text-center">
          <Typography variant="h4">清水河畔</Typography>
          <Typography color={theme.palette.grey[400]}>
            说你想说，做你想做
          </Typography>
        </Box>
      </Banner>
      <CampusService />
    </>
  )
}

const Header = () => {
  const location = useLocation()

  return (
    <>
      <Stack>
        <Typography className="font-bold" variant="h5">
          {/* 这里应该是根据页面显示不同头部 */}
        </Typography>
      </Stack>
      {location.pathname === '/' ? <WelcomeBanner /> : <Breadcrumbs />}
    </>
  )
}

export default Header
