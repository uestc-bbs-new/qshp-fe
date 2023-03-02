import { useQuery } from 'react-query'
import { Outlet } from 'react-router-dom'

import { KeyboardArrowUp } from '@mui/icons-material'
import { Box, Fab, Stack, Toolbar, useMediaQuery } from '@mui/material'

import { getForumList } from '@/apis/common'
import Announcement from '@/components/Announcement'
import Drawer from '@/components/Drawer'
import ScrollTop from '@/components/ScrollTop'
import TopBar from '@/components/TopBar'
import { useAppState } from '@/states'

import Aside from '../components/Aside'

const Layout = () => {
  const { state, dispatch } = useAppState()
  // 1720 comes from the content width 1280 plus 2 * drawer width 210
  const matches = useMediaQuery('(min-width: 1720px)')
  const drawerWidth = 210

  // read partition
  useQuery(['formList'], () => getForumList(), {
    // catchTime: 60 * 1000,
    // staleTime: 30 * 1000
    onSuccess: (data) => {
      // 对板块信息进行处理，得到嵌套的板块关系
      dispatch({
        type: 'set navList',
        payload: data.group,
      })
    },
  })

  return (
    <>
      <Box
        className="relative flex h-full"
        // style={{ backgroundColor: '#f7f9fe' }}
      >
        <TopBar />
        <Drawer width={drawerWidth} />
        <Box
          component="main"
          className={`flex w-full flex-col items-center align-middle transition-all`}
          sx={{
            marginLeft: {
              sm: `${state.drawer && !matches ? drawerWidth : 0}px`,
            },
          }}
        >
          <Toolbar id="back-to-top-anchor" />
          <Box id="detail" className="h-full w-full max-w-screen-xl flex-1 p-4">
            <Announcement />
            <Stack direction="row">
              <Outlet />
              <Aside />
            </Stack>
          </Box>
        </Box>
        <ScrollTop>
          <Fab size="small" aria-label="回到顶部">
            <KeyboardArrowUp />
          </Fab>
        </ScrollTop>
      </Box>
    </>
  )
}

export default Layout
