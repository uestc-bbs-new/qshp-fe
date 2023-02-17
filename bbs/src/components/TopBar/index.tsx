import React from 'react'

import { AppBar, Button, IconButton, Stack, Toolbar } from '@mui/material'

import { Add, Menu } from '@mui/icons-material'

import { useNavigate, createSearchParams } from 'react-router-dom'

import { useAppState } from '@/states'
import Link from '@/components/Link'
import UserMenu from './UserMenu'
import Message from './Message'
import SearchBar from './Search'

const Options = () => {
  const navigate = useNavigate()

  return (
    <Stack
      justifyContent="flex-end"
      direction="row"
      className="basis-1/4 text-right"
    >
      <Toolbar>
        <UserMenu />
        <Message />
        {/* <AboutMe unread={state.messages.unread_count}/> */}
        <Button
          className="bg-white bg-opacity-40 ml-6"
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/edit')}
        >
          发帖
        </Button>
      </Toolbar>
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
      <Stack direction="row" alignItems="center" className="px-6">
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
          <Link to="/" className="text-white">
            logo 清水河畔
          </Link>
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
