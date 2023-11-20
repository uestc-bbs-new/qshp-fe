import { useNavigate } from 'react-router-dom'

import { Add, Menu } from '@mui/icons-material'
import { MeetingRoomTwoTone } from '@mui/icons-material'
import {
  AppBar,
  Button,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material'

import Link from '@/components/Link'
import { useAppState } from '@/states'

import Message from './Message'
import SearchBar from './Search'
import UserMenu from './UserMenu'

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
        {state.users.uid != 0 ? <Options /> : <LoginComponent />}
        <Link
          to="https://bbs.uestc.edu.cn/forum.php?mod=viewthread&tid=1812091"
          className="text-white"
          underline="none"
          sx={{ mr: 1, ml: -1.5 }}
        >
          <Typography sx={{ fontSize: 12 }}>客户端下载</Typography>
        </Link>
        <Link
          to="https://bbs.uestc.edu.cn/"
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
