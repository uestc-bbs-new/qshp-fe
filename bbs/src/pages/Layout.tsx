import { useState } from 'react'
import { Outlet } from 'react-router-dom'

import { KeyboardArrowUp } from '@mui/icons-material'
import {
  Alert,
  Box,
  Button,
  Fab,
  Paper,
  Slide,
  Snackbar,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@mui/material'

import anniversaryButtonBg from '@/assets/anniversary_button_bg.jpg'
import anniversaryButtonTexture from '@/assets/anniversary_button_texture.png'
import {
  kSidebarWidth,
  useSidebarInMarginMediaQuery,
} from '@/common/ui/TopList'
import { kContentWidth } from '@/common/ui/base'
import Announcement from '@/components/Announcement'
import Breadcrumbs from '@/components/Breadcurmbs'
import Drawer from '@/components/Drawer'
import Link from '@/components/Link'
import ScrollTop from '@/components/ScrollTop'
import TopBar from '@/components/TopBar'
import { TopListDialog } from '@/components/TopList/TopListView'
import { useAppState } from '@/states'
import { pages, useActiveRoute } from '@/utils/routes'
import { isVpnProxy } from '@/utils/siteRoot'

const Layout = () => {
  const { state, dispatch } = useAppState()
  const thinView = useMediaQuery('(max-width: 560px)')
  const sidebarInMargin = useSidebarInMarginMediaQuery()
  const sidebarNotFit = useMediaQuery(
    `(max-width: ${kContentWidth + kSidebarWidth}px)`
  )
  const [vpnPromptOpen, setVpnPromptOpen] = useState(isVpnProxy)
  const route = useActiveRoute()
  const showAnniversaryFab =
    Date.now() < 1763186400000 && // new Date('2025-11-15 14:00').getTime()
    Date.now() > 1762999200000 // new Date('2025-11-13 10:00').getTime()

  return (
    <>
      <Box
        className="relative flex h-full"
        // style={{ backgroundColor: '#f7f9fe' }}
      >
        <TopBar />
        <Drawer />
        <Box
          component="main"
          className={`flex w-full flex-col items-center align-middle transition-all`}
          ml={
            state.toplistView?.open && state.toplistView?.sidebar
              ? sidebarInMargin
                ? 0
                : sidebarNotFit
                  ? `${kSidebarWidth}px`
                  : `calc(${kSidebarWidth * 2 + kContentWidth}px - 100%)`
              : undefined
          }
          sx={{ transition: 'marginRight 0.5s ease' }}
        >
          <Toolbar id="back-to-top-anchor" />
          <Box
            id="detail"
            className="h-full w-full max-w-screen-xl flex-1"
            px={thinView ? 1 : 1.75}
            py={1.75}
          >
            {!(
              ['thread', 'x_anniversary_18'].includes(route?.id ?? '') &&
              thinView
            ) && <Announcement />}
            <Breadcrumbs />
            <Outlet />
          </Box>
        </Box>
        <ScrollTop hidden={state.toplistView?.open}>
          <Fab size="small" aria-label="回到顶部">
            <KeyboardArrowUp />
          </Fab>
        </ScrollTop>

        {showAnniversaryFab &&
          route?.id != 'x_anniversary_18' &&
          route?.id != 'x_anniversary_18_verify' && (
            <Fab
              component={Link}
              to={pages.xAnniversary()}
              sx={{
                position: 'fixed',
                right: 8,
                bottom: 120,
                width: 96,
                height: 96,
                '@media (max-width: 560px)': {
                  width: 80,
                  height: 80,
                },
              }}
            >
              <Stack
                sx={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: '100%',
                  width: '100%',
                  height: '100%',
                  boxSizing: 'border-box',
                  backgroundColor: '#bde3ef',
                  background: `url(${anniversaryButtonBg}) center / 100%`,
                  border: '3px solid #e7f7ff',
                  lineHeight: '1.5em',
                }}
              >
                <div
                  css={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    marginTop: 4,
                    '@media (max-width: 560px)': {
                      transform: 'scale(0.833)',
                    },
                  }}
                >
                  <span css={{ color: '#1a87a6' }}>18</span>
                  <span css={{ color: '#5378ad' }}>周年</span>
                </div>
                <div
                  css={{
                    background: `url(${anniversaryButtonTexture}) center / 80% 90% no-repeat, linear-gradient(#f0f0f0, #e0e0e0)`,
                    width: '36%',
                    height: '12%',
                    marginTop: 6,
                    marginBottom: 6,
                    boxShadow: '0.7px 1px 2px #ccc',
                    borderRadius: 3,
                    transform: 'skewX(-10deg)',
                  }}
                />
                <div
                  css={{
                    fontSize: '16px',
                    color: '#d95000',
                    '@media (max-width: 560px)': {
                      transform: 'scale(0.833)',
                    },
                  }}
                >
                  刮刮卡
                </div>
              </Stack>
            </Fab>
          )}

        {state.globalSnackbar && (
          <Snackbar
            key={state.globalSnackbar.key}
            open
            TransitionComponent={
              state.globalSnackbar.transition != 'none' ? Slide : undefined
            }
            autoHideDuration={3000}
            onClose={() => dispatch({ type: 'close snackbar' })}
            sx={{
              '&.MuiSnackbar-root': {
                left: '50%',
                top: '50%',
                right: 'auto',
                bottom: 'auto',
                transform: 'translate(-50%, -50%)',
              },
            }}
          >
            <Alert
              severity={state.globalSnackbar.severity ?? 'info'}
              variant="filled"
            >
              {state.globalSnackbar.message}
            </Alert>
          </Snackbar>
        )}
      </Box>
      {state.toplistView?.mounted && (
        <TopListDialog
          open={!!state.toplistView?.open}
          alwaysOpen={!!state.toplistView?.alwaysOpen}
          sidebar={!!state.toplistView?.sidebar}
          onClose={() => {
            dispatch({
              type: 'close toplist',
              payload: { manuallyOpened: false },
            })
          }}
        />
      )}
      {vpnPromptOpen && (
        <Paper
          elevation={10}
          sx={(theme) => ({
            position: 'fixed',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            margin: 'auto',
            width: 310,
            maxWidth: '95%',
            height: 160,
            p: 2,
            backgroundColor:
              theme.palette.mode == 'dark' ? '#204ac1' : '#b8d1f7',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: '999',
          })}
        >
          <Typography variant="h6" color="red">
            温馨提示
          </Typography>
          <Typography my={1}>
            清水河畔已开放外网访问，VPN 用户请直接通过 bbs.uestc.edu.cn
            域名访问。
          </Typography>
          <Stack alignItems="center">
            <Button onClick={() => setVpnPromptOpen(false)} variant="outlined">
              关闭
            </Button>
          </Stack>
        </Paper>
      )}
    </>
  )
}

export default Layout
