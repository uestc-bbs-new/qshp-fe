import { useQuery } from '@tanstack/react-query'

import { Outlet } from 'react-router-dom'

import {
  Alert,
  Box,
  List,
  ListItem,
  ListItemButton,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material'

import { getPermissions } from '@/apis/admin/global'
import Link from '@/components/Link'
import { useSignInChange } from '@/states'

import pages from './pages'

const list = [
  { text: '全局公告', to: pages.announcement(), permission: 'announcement' },
  { text: '首页列表', to: pages.toplist(), permission: 'toplist' },
  { text: '线下刮刮卡', to: pages.freshman(), extPermission: 'freshman' },
  { text: '高级', to: pages.advanced() },
]

const Layout = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin', 'permissions'],
    queryFn: getPermissions,
  })
  useSignInChange(refetch)

  if (isLoading) {
    return <Skeleton />
  }
  if (!data?.is_admin) {
    return (
      <Box my={2}>
        <Alert severity="error">
          <Typography>抱歉，您没有权限使用该功能。</Typography>
        </Alert>
      </Box>
    )
  }
  return (
    <Stack direction="row">
      <List sx={{ p: 1, mr: 2, flexGrow: 0, flexShrink: 0 }}>
        {list
          .filter((item) => {
            if (item.extPermission) {
              return data.extensions && item.extPermission in data.extensions
            }
            return !item.permission || item.permission in data
          })
          .map((item, index) => (
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
}

export default Layout
