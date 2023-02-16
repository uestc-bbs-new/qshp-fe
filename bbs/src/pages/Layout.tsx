import React, { useEffect } from 'react'
import { useQuery } from 'react-query'
import { Box, Toolbar, Fab } from '@mui/material'
import { Outlet } from 'react-router-dom'
import { KeyboardArrowUp } from '@mui/icons-material'

// import {FormLi}
import { useAppState } from '@/states'
import { getForumList } from '@/apis/common'
import TopBar from '@/components/TopBar'
import Drawer from '@/components/Drawer'
import ScrollTop from '@/components/ScrollTop'
// import Announcement from '@/components/Announcement'

const Layout = () => {
  const { dispatch } = useAppState()
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
      <Box className="relative h-full flex">
        <TopBar />
        <Drawer width={drawerWidth} />
        <Box
          component="main"
          className="w-full flex flex-col align-middle items-center transition-all"
          sx={{
            marginLeft: {
              // sm: `${}px`,
            },
          }}
        >
          <Toolbar id="back-to-top-anchor" />
          <Box id="detail" className="p-3 w-full h-full max-w-screen-xl flex-1">
            {/* <Announcement /> */}
            <Outlet />
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
