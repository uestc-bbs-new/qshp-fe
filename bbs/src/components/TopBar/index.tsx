import { AppBar, Button, IconButton, Stack } from '@mui/material'

import React from 'react'

import { Add, Menu } from '@mui/icons-material'

import { Link } from 'react-router-dom'

import { useAppState } from '@/states'
import UserMenu from './UserMenu'
import Message from './Message'
import SearchBar from './Search'

const Options = () => {
  return (
    <Stack
      justifyContent="flex-end"
      direction="row"
      className="basis-1/4 text-right"
    >
      <Message />
      {/* <AboutMe unread={state.messages.unread_count}/> */}
      <IconButton>
        <Add color="action" />
      </IconButton>
      <UserMenu />
    </Stack>
  )
}

const LoginComponent = () => {
  return (
    <Stack
      justifyContent="flex-end"
      direction="row"
      spacing={1}
      className="basis-1/4"
    >
      <Button variant="outlined">登录</Button>
      <Button variant="contained">注册</Button>
    </Stack>
  )
}

const TopBar = () => {
  const { state, dispatch } = useAppState()

  const changeMenu = () => {
    dispatch({
      type: 'set drawer',
    })
  }

  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Stack direction="row" alignItems="center" className="h-16 py-2 px-6">
        <Stack direction="row" className="basis-1/4" alignItems="center">
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={changeMenu}
          >
            <Menu />
          </IconButton>
          <Link to="/">logo 清水河畔</Link>
        </Stack>
        <Stack direction="row" justifyContent="center" className="basis-1/2">
          <SearchBar />
        </Stack>
        {state.users.uid != 0 ? <Options /> : <LoginComponent />}
      </Stack>
    </AppBar>
  )
}

export default TopBar
