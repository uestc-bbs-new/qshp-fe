import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Add, Close, Menu } from '@mui/icons-material'
import { MeetingRoomTwoTone } from '@mui/icons-material'
import {
  AppBar,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material'

import { signIn } from '@/apis/common'
import Link from '@/components/Link'
import { useAppState } from '@/states'
import { State } from '@/states/reducers/stateReducer'
import { setAuthorizationHeader } from '@/utils/auth_header'
import { useDiscuzLink } from '@/utils/discuz_link_map'

import Message from './Message'
import SearchBar from './Search'
import UserMenu from './UserMenu'

const Options = ({ state }: { state: State }) => {
  const navigate = useNavigate()

  return (
    <Stack
      justifyContent="flex-end"
      direction="row"
      className="basis-1/4 text-right"
    >
      <Toolbar disableGutters>
        <UserMenu user={state.user} />
        <Message />
        {/* <AboutMe unread={state.messages.unread_count}/> */}
        <Button
          className="ml-3 bg-white bg-opacity-40"
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
  const [signinOpen, setSigninOpen] = useState(false)
  const closeSignin = () => setSigninOpen(false)
  const doSignin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const username = data.get('username')
    const password = data.get('password')
    if (!username || !password) {
      alert('请输入用户名与密码。')
      return
    }
    const authorization = await signIn({
      username: username.toString(),
      password: password.toString(),
      keep_signed_in: data.get('keep_signed_in')?.toString() === '1',
    })
    if (authorization) {
      setAuthorizationHeader(authorization)
      closeSignin()
    }
  }
  return (
    <Stack
      justifyContent="flex-end"
      direction="row"
      spacing={1}
      className="basis-1/4"
    >
      <Button variant="contained" onClick={(_) => setSigninOpen(true)}>
        登录
      </Button>
      <Button variant="contained">注册</Button>
      <Dialog open={signinOpen} onClose={closeSignin}>
        <DialogTitle>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography>登录</Typography>
            <IconButton onClick={closeSignin}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <form onSubmit={doSignin}>
            <Grid container alignItems="center" rowSpacing={2}>
              <Grid item xs={4}>
                <Typography>用户名：</Typography>
              </Grid>
              <Grid item xs={8}>
                <TextField autoFocus fullWidth name="username" />
              </Grid>
              <Grid item xs={4}>
                <Typography>密码：</Typography>
              </Grid>
              <Grid item xs={8}>
                <TextField type="password" fullWidth name="password" />
              </Grid>
            </Grid>
            <FormControlLabel
              control={<Checkbox name="keep_signed_in" value="1" />}
              label="自动登录"
            />
            <Stack direction="row" justifyContent="center">
              <Button type="submit">登录</Button>
            </Stack>
          </form>
        </DialogContent>
      </Dialog>
    </Stack>
  )
}

const TopBar = () => {
  const { state, dispatch } = useAppState()
  const legacyUrl = useDiscuzLink()

  const changeMenu = () => {
    dispatch({
      type: 'set drawer',
    })
  }

  const logoImg = new URL(
    `../../assets/qshp-logo.png`,
    import.meta.url
  ).href.toString()

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
            <img
              src={logoImg}
              alt="logo"
              style={{ height: '50px', width: 'auto', marginRight: '30px' }}
            />
          </Link>
          <SearchBar />
        </Stack>
        <Stack sx={{ flexGrow: 1 }}></Stack>
        {state.user.uid != 0 ? <Options state={state} /> : <LoginComponent />}
        <Link
          to="/thread/1812091"
          className="text-white"
          underline="none"
          sx={{ ml: 2, mr: 1 }}
        >
          <Typography sx={{ fontSize: 12 }}>客户端下载</Typography>
        </Link>
        <Link
          to={legacyUrl}
          external
          target="_blank"
          className="text-white"
          underline="none"
        >
          <Stack direction="row" alignItems="center">
            <MeetingRoomTwoTone fontSize="small" />
            <Typography sx={{ fontSize: 12 }}>返回旧版</Typography>
          </Stack>
        </Link>
      </Stack>
    </AppBar>
  )
}

export default TopBar
