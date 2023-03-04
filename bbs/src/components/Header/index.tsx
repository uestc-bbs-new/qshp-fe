import { useLocation } from 'react-router-dom'

import { Box, Stack, Typography, useTheme } from '@mui/material'

import Banner from '../Banner'
import Breadcrumbs from '../Breadcurmbs'

const WelcomeBanner = () => {
  const theme = useTheme()
  return (
    <Banner src="https://www.minebbs.com/data/img/bg-grass.png">
      <Box className="text-white text-center">
        <Typography variant="h4">清水河畔</Typography>
        <Typography color={theme.palette.grey[400]}>
          说你想说，做你想做
        </Typography>
      </Box>
    </Banner>
  )
}

const Header = () => {
  const location = useLocation()

  return (
    <>
      <Stack>
        <Typography className="font-bold" variant="h5">
          论坛列表
        </Typography>
      </Stack>
      {location.pathname === '/' ? <WelcomeBanner /> : <Breadcrumbs />}
    </>
  )
}

export default Header
