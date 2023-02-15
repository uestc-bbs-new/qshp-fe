import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { useQuery } from 'react-query'
import { Box, Toolbar } from '@mui/material'

// import {FormLi}
import { useAppState } from '@/states'
import { getForumList } from '@/apis/common'
import TopBar from '@/components/TopBar'
import Drawer from '@/components/Drawer'
import routes from '@/routes'
// import Announcement from '@/components/Announcement'

const Layout = () => {
  const { state, dispatch } = useAppState()
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
          className="w-full h-full flex flex-col align-middle items-center transition-all"
          sx={{
            marginLeft: {
              sm: `${state.drawer ? drawerWidth : 0}px`,
            },
          }}
        >
          <Toolbar />
          <Box className="p-3 w-full max-w-screen-xl flex-1">
            {/* <Announcement /> */}
            <Routes>
              {routes.map(({ path, component: Component }) => (
                <Route path={path} element={<Component />} key={path} />
              ))}
            </Routes>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default Layout
