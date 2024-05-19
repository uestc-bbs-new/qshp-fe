import { Drawer, useMediaQuery, useTheme } from '@mui/material'

import { useAppState } from '@/states'

import NavLinks from './NavLinks'

const LeftDrawer = () => {
  const { state } = useAppState()
  const theme = useTheme()

  const keepMounted = useMediaQuery('(max-width:640px)')
  const open = state.drawer

  return (
    <>
      <Drawer
        variant={'temporary'}
        open={open}
        ModalProps={{
          // Better open performance on mobile.
          keepMounted: keepMounted,
        }}
        PaperProps={{
          sx: {
            border: 'none',
            background: theme.palette.background.default,
          },
        }}
        sx={{
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 210 },
        }}
      >
        {open && <NavLinks />}
      </Drawer>
    </>
  )
}

export default LeftDrawer
