import React from 'react'

import { Drawer, useMediaQuery } from '@mui/material'

import { useAppState } from '@/states'
import NavLinks from './NavLinks'

// use different drawer variant due to the media
const LeftDrawer = ({ width }: { width: number }) => {
  const { state } = useAppState()

  // change drawer variant based on screen size
  const matchesMobile = useMediaQuery('(max-width:640px)')

  return (
    <>
      <Drawer
        variant={matchesMobile ? 'temporary' : 'persistent'}
        open={matchesMobile ? !state.drawer : state.drawer}
        ModalProps={{
          // Better open performance on mobile.
          keepMounted: matchesMobile,
        }}
        PaperProps={{
          sx: {
            border: 'none',
          },
        }}
        sx={{
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: width },
        }}
      >
        <NavLinks />
      </Drawer>
    </>
  )
}

export default LeftDrawer
