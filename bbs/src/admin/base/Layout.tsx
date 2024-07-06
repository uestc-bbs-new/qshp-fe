import { Outlet } from 'react-router-dom'

import { Box, List, ListItem, ListItemButton, Stack } from '@mui/material'

import Link from '@/components/Link'

import pages from './pages'

const list = [
  { text: '全局公告', to: pages.announcement() },
  { text: '首页列表', to: pages.toplist() },
]

const Layout = () => (
  <Stack direction="row">
    <List sx={{ p: 1, mr: 2 }}>
      {list.map((item, index) => (
        <ListItem disablePadding key={index}>
          <ListItemButton component={Link} to={item.to}>
            {item.text}
          </ListItemButton>
        </ListItem>
      ))}
    </List>
    <Box flexGrow={1} flexShrink={1}>
      <Outlet />
    </Box>
  </Stack>
)

export default Layout
