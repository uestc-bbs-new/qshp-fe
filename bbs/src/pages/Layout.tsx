import { Outlet } from 'react-router-dom'

import { KeyboardArrowUp } from '@mui/icons-material'
import {
  Alert,
  Box,
  Fab,
  Slide,
  Snackbar,
  Toolbar,
  useMediaQuery,
} from '@mui/material'

import freshmanBonus2025 from '@/assets/2025_fresh_bonus.png'
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
import { isDeveloper } from '@/states/settings'
import { useActiveRoute } from '@/utils/routes'

const Layout = () => {
  const { state, dispatch } = useAppState()
  const thinView = useMediaQuery('(max-width: 560px)')
  const sidebarInMargin = useSidebarInMarginMediaQuery()
  const sidebarNotFit = useMediaQuery(
    `(max-width: ${kContentWidth + kSidebarWidth}px)`
  )
  const activeRoute = useActiveRoute()

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

        {isDeveloper() && activeRoute?.id != 'x_freshman_luckydraw' && (
          <Fab
            component={Link}
            to="/freshman/luckydraw"
            sx={{
              position: 'fixed',
              right: 8,
              bottom: 120,
              width: 96,
              height: 96,
            }}
          >
            <img
              src={freshmanBonus2025}
              css={{
                width: '100%',
              }}
            />
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
    </>
  )
}

export default Layout
