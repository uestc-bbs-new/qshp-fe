import React from 'react'

import { Menu, MenuItem, Divider, ListItemIcon, Button } from '@mui/material'

import {
  TransferWithinAStation,
  LightMode,
  DarkMode,
  Logout,
} from '@mui/icons-material'

import Avatar from '../Avatar'
import { useAppState, Theme } from '@/states'

const UserMenu = () => {
  const { state, dispatch } = useAppState()
  const logout = () => {
    dispatch({
      type: 'clear',
    })
  }

  const themeChange = () => {
    if (state.theme === 'light') {
      dispatch({
        type: 'set theme',
        payload: 'dark' as Theme,
      })
    } else {
      dispatch({
        type: 'set theme',
        payload: 'light' as Theme,
      })
    }
  }

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'user-menu' : undefined

  return (
    <>
      <Button aria-describedby={id} onClick={handleClick} className="min-w-min">
        <Avatar
          src="https://mui.com/static/avatar/1.jpg"
          alt="1234"
          sx={{ width: 32, height: 32 }}
          variant="rounded"
        />
      </Button>

      <Menu
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={themeChange}>
          <ListItemIcon>
            {state.theme === 'light' ? (
              <DarkMode fontSize="small" />
            ) : (
              <LightMode fontSize="small" />
            )}
          </ListItemIcon>
          {state.theme === 'light' ? '暗黑' : 'light'}模式
        </MenuItem>
        <Divider variant="middle" flexItem></Divider>
        <MenuItem>
          <ListItemIcon>
            <TransferWithinAStation fontSize="small" />
          </ListItemIcon>
          切换账号
        </MenuItem>
        <Divider variant="middle" flexItem></Divider>
        <MenuItem onClick={logout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          登出
        </MenuItem>
      </Menu>
    </>
  )
}

export default UserMenu
