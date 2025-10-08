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

import {
  kSidebarWidth,
  useSidebarInMarginMediaQuery,
} from '@/common/ui/TopList'
import { kContentWidth } from '@/common/ui/base'
import Announcement from '@/components/Announcement'
import Breadcrumbs from '@/components/Breadcurmbs'
import Drawer from '@/components/Drawer'
import ScrollTop from '@/components/ScrollTop'
import TopBar from '@/components/TopBar'
import { TopListDialog } from '@/components/TopList/TopListView'
import { useAppState } from '@/states'
import { isVpnProxy } from '@/utils/siteRoot'

const Layout = () => {
  const { state, dispatch } = useAppState()
  const thinView = useMediaQuery('(max-width: 560px)')
  const sidebarInMargin = useSidebarInMarginMediaQuery()
  const sidebarNotFit = useMediaQuery(
    `(max-width: ${kContentWidth + kSidebarWidth}px)`
  )
  const [vpnPromptOpen, setVpnPromptOpen] = useState(isVpnProxy)

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
            <Announcement />
            <Breadcrumbs />
            <Outlet />
          </Box>
        </Box>
        <ScrollTop hidden={state.toplistView?.open}>
          <Fab size="small" aria-label="回到顶部">
            <KeyboardArrowUp />
          </Fab>
        </ScrollTop>

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
