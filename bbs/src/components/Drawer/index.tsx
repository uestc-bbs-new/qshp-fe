import { Drawer, useMediaQuery, useTheme } from '@mui/material'

import { useAppState } from '@/states'

import NavLinks from './NavLinks'

// use different drawer variant due to the media
const LeftDrawer = ({ width }: { width: number }) => {
  const { state } = useAppState()
  const theme = useTheme()

  // change drawer variant based on screen size
  const matchesMobile = useMediaQuery('(max-width:640px)')
  const open = state.drawer

  return (
    <>
      <Drawer
        variant={matchesMobile ? 'temporary' : 'persistent'}
        // open={matchesMobile ? !state.drawer : state.drawer}
        open={open}
        ModalProps={{
          // Better open performance on mobile.
          keepMounted: matchesMobile,
        }}
        PaperProps={{
          sx: {
            border: 'none',
            background: theme.palette.background.default,
          },
        }}
        sx={{
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: width },
        }}
      >
        {open && <NavLinks />}
      </Drawer>
    </>
  )
}

export default LeftDrawer
