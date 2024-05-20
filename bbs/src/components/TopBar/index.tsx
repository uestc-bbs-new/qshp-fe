import { useRef, useState } from 'react'

import { Add, Menu, PostAdd, Search } from '@mui/icons-material'
import { MeetingRoomTwoTone } from '@mui/icons-material'
import {
  AppBar,
  Button,
  ButtonProps,
  IconButton,
  Paper,
  Popover,
  Skeleton,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@mui/material'

import Link, { LinkProps } from '@/components/Link'
import { useAppState } from '@/states'
import { State } from '@/states/reducers/stateReducer'
import { useDiscuzLink } from '@/utils/discuzLinkMap'
import { pages, useActiveRoute } from '@/utils/routes'

import Message from './Message'
import SearchBar from './Search'
import UserMenu, { MiniUserMenu } from './UserMenu'

const MiniButton = (props: ButtonProps & LinkProps) => (
  <Button
    variant="contained"
    {...props}
    sx={{
      width: 32,
      height: 32,
      minWidth: 0,
      boxSizing: 'border-box',
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
      '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.3)' },
      ...props.sx,
    }}
  />
)

const Options = ({
  state,
  onSearchClick,
}: {
  state: State
  onSearchClick: () => void
}) => {
  const activeRoute = useActiveRoute()
  const fid =
    (activeRoute?.id == 'forum' || activeRoute?.id == 'thread') &&
    state.activeForum?.can_post_thread
      ? state.activeForum?.fid
      : undefined
  const postLink = pages.post(fid)
  const miniView = useMediaQuery('(max-width: 800px)')

  return (
    <>
      {miniView ? (
        <>
          <MiniButton sx={{ mr: 1 }} onClick={onSearchClick}>
            <Search />
          </MiniButton>
          <MiniButton
            component={Link}
            to={postLink}
            state={fid && state.activeForum}
            sx={{ mr: 1 }}
          >
            <PostAdd />
          </MiniButton>
          <MiniUserMenu user={state.user} />
        </>
      ) : (
        <>
          <UserMenu user={state.user} />
          <Message />
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
        </>
      )}
    </>
  )
}

const LoginComponent = () => {
  const { dispatch } = useAppState()
  return (
    <>
      <Button
        variant="contained"
        sx={{ mr: 1 }}
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
    </>
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

  const narrowTopBar = useMediaQuery('(max-width: 850px)')
  const miniSearch = useMediaQuery('(max-width: 800px)')
  const smallLogo = useMediaQuery('(max-width: 400px)')
  const appbarRef = useRef<HTMLElement>(null)
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, px: 2.5 }}
      ref={appbarRef}
    >
      <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
        <Stack
          direction="row"
          alignItems="center"
          flexGrow={0}
          flexShrink={1}
          minWidth="1em"
          mr={1}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: smallLogo ? 0 : 2 }}
            onClick={changeMenu}
          >
            <Menu />
          </IconButton>
          <Link to={pages.index()} className="text-white">
            <img
              src={logoImg}
              alt="logo"
              css={{
                width: smallLogo ? 150 : 175,
                marginRight: smallLogo ? 10 : 30,
              }}
            />
          </Link>
          {!miniSearch && !!state.user.uid && (
            <SearchBar sx={{ flexShrink: 1, width: 420 }} />
          )}
        </Stack>
        <Stack direction="row" alignItems="center" flexGrow={0} flexShrink={0}>
          {state.user.uninitialized ? (
            <Skeleton width={160} height={32} />
          ) : state.user.uid ? (
            <Options
              state={state}
              onSearchClick={() => setSearchOpen(!searchOpen)}
            />
          ) : (
            <LoginComponent />
          )}
          {!narrowTopBar && (
            <>
              <Link
                to={legacyUrl}
                external
                target="_blank"
                className="text-white"
                underline="none"
                ml={2}
              >
                <Stack direction="row" alignItems="center">
                  <MeetingRoomTwoTone fontSize="small" />
                  <Typography sx={{ fontSize: 12 }}>返回旧版</Typography>
                </Stack>
              </Link>
            </>
          )}
        </Stack>
      </Toolbar>
      {miniSearch && (
        <Popover
          open={searchOpen}
          onClose={() => setSearchOpen(false)}
          anchorEl={appbarRef.current}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          marginThreshold={0}
          sx={{ zIndex: 1 }}
          slotProps={{ paper: { sx: { maxWidth: '100%', width: 440 } } }}
          disableRestoreFocus // Work around of bug https://github.com/mui/material-ui/issues/33004
        >
          <Paper
            elevation={1}
            sx={(theme) => ({
              backgroundColor:
                theme.palette.mode == 'dark'
                  ? theme.palette.background.default
                  : theme.palette.primary.main,
            })}
          >
            <SearchBar autoFocus sx={{ pr: 2 }} />
          </Paper>
        </Popover>
      )}
    </AppBar>
  )
}

export default TopBar
