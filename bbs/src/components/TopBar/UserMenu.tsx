import { useNavigate } from 'react-router-dom'

import {
  DarkMode,
  LightMode,
  Logout,
  Person,
  SavedSearch,
  Settings,
  TransferWithinAStation,
} from '@mui/icons-material'
import {
  Box,
  Divider,
  ListItemIcon,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material'

import { signOut } from '@/apis/common'
import Tooltip from '@/components/Tooltip'
import { Theme, useAppState } from '@/states'
import { UserState } from '@/states/reducers/stateReducer'
import siteRoot from '@/utils/siteRoot'

import Avatar from '../Avatar'

const MenuContent = () => {
  const { state, dispatch } = useAppState()

  const logout = async () => {
    await signOut()
    dispatch({ type: 'set user' })
  }

  const themeChange = () => {
    if (state.theme === 'light') {
      dispatch({
        type: 'set theme',
        payload: 'dark' as Theme,
      })
    } else {
      dispatch({
        type: 'set theme',
        payload: 'light' as Theme,
      })
    }
  }
  const navigate = useNavigate()
  return (
    <Box className="py-2">
      <MenuItem>
        <ListItemIcon>
          <Person fontSize="small" />
        </ListItemIcon>
        个人空间
      </MenuItem>
      <Divider variant="middle" flexItem></Divider>
      <MenuItem
        onClick={() =>
          (window.location.href = `${siteRoot}/forum.php?mod=collection`)
        }
      >
        <ListItemIcon>
          <SavedSearch fontSize="small" />
        </ListItemIcon>
        淘帖
      </MenuItem>
      <Divider variant="middle" flexItem></Divider>
      <MenuItem onClick={themeChange}>
        <ListItemIcon>
          {state.theme === 'light' ? (
            <DarkMode fontSize="small" />
          ) : (
            <LightMode fontSize="small" />
          )}
        </ListItemIcon>
        {state.theme === 'light' ? '暗黑' : 'light'}模式
      </MenuItem>
      <Divider variant="middle" flexItem></Divider>
      <MenuItem>
        <ListItemIcon>
          <TransferWithinAStation fontSize="small" />
        </ListItemIcon>
        切换账号
      </MenuItem>
      <Divider variant="middle" flexItem></Divider>
      <MenuItem onClick={() => navigate({ pathname: '/setting' })}>
        <ListItemIcon>
          <Settings fontSize="small" />
        </ListItemIcon>
        设置
      </MenuItem>
      <Divider variant="middle" flexItem></Divider>
      <MenuItem onClick={logout}>
        <ListItemIcon>
          <Logout fontSize="small" />
        </ListItemIcon>
        登出
      </MenuItem>
    </Box>
  )
}

const UserMenu = ({ user }: { user: UserState }) => {
  return (
    <>
      <Tooltip title={<MenuContent />}>
        <Stack direction="row" alignItems="center">
          <Avatar
            className="mx-3"
            uid={user.uid}
            sx={{ width: 32, height: 32 }}
            variant="rounded"
          />
          <Typography>{user.username}</Typography>
        </Stack>
      </Tooltip>
    </>
  )
}

export default UserMenu
