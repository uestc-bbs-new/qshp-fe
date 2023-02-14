import React from 'react'

import {
  Menu,
  Avatar,
  MenuItem,
  Divider,
  ListItemIcon,
  IconButton,
} from '@mui/material'

// import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state'
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation'
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LogoutIcon from '@mui/icons-material/Logout'

import { useAppState, Theme } from '@/states'

const paperProps = {
  elevation: 0,
  sx: {
    // overflow: "visible",
    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
    mt: 1.5,
  },
}

const UserMenu = () => {
  const { state, dispatch } = useAppState()
  const logout = () => {
    dispatch({
      type: 'clear',
    })
  }

  const themeChange = () => {
    dispatch({
      type: 'set theme',
      payload: 'dark' as Theme,
    })
  }

  return (
    <>
      <div>salkdfjlsa</div>
      {/* <PopupState variant="popover">
        {(popupState) => (
          <>
            <IconButton {...bindTrigger(popupState)}>
              <Avatar
                alt="Remy Sharp"
                src="https://mui.com/static/images/avatar/1.jpg"
                sx={{ width: 32, height: 32 }}
              />
            </IconButton>
            <Menu
              {...bindMenu(popupState)}
              PaperProps={paperProps}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem>
                <ListItemIcon>
                  <DarkModeIcon fontSize="small" />
                </ListItemIcon>
                暗黑模式 (beta)
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <TransferWithinAStationIcon fontSize="small" />
                </ListItemIcon>
                切换账号
              </MenuItem>
              <MenuItem onClick={logout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                登出
              </MenuItem>
            </Menu>
          </>
        )}
      </PopupState> */}
    </>
  )
}

export default UserMenu
