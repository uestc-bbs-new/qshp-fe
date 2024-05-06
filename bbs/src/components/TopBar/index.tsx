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
import { State } from '@/states/reducers/stateReducer'
import { useDiscuzLink } from '@/utils/discuzLinkMap'
import { pages, useActiveRoute } from '@/utils/routes'

import Message from './Message'
import SearchBar from './Search'
import UserMenu from './UserMenu'

const Options = ({ state }: { state: State }) => {
  const activeRoute = useActiveRoute()
  const fid =
    (activeRoute?.id == 'forum' || activeRoute?.id == 'thread') &&
    state.activeForum?.can_post_thread
      ? state.activeForum?.fid
      : undefined
  const postLink = pages.post(fid)

  return (
    <Stack
      justifyContent="flex-end"
      alignItems="center"
      direction="row"
      className="basis-1/4 text-right"
    >
      <UserMenu user={state.user} />
      <Message />
      {/* <AboutMe unread={state.messages.unread_count}/> */}
      <Button
        className="ml-3 bg-white bg-opacity-40"
        variant="contained"
        startIcon={<Add />}
        component={Link}
        to={postLink}
        state={fid && state.activeForum}
      >
        发帖
      </Button>
    </Stack>
  )
}

const LoginComponent = () => {
  const { dispatch } = useAppState()
  return (
    <Stack
      justifyContent="flex-end"
      direction="row"
      spacing={1}
      className="basis-1/4"
    >
      <Button
        variant="contained"
        onClick={() =>
          dispatch({ type: 'open dialog', payload: { kind: 'login' } })
        }
      >
        登录
      </Button>
      <Button
        variant="contained"
        onClick={() =>
          dispatch({ type: 'open dialog', payload: { kind: 'register' } })
        }
      >
        注册
      </Button>
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
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, px: 2.5 }}
    >
      <Toolbar disableGutters>
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
          <Link to={pages.index()} className="text-white">
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
          to={pages.thread(1812091)}
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
      </Toolbar>
    </AppBar>
  )
}

export default TopBar
