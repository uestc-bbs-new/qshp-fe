import { useState } from 'react'

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

import { signOut } from '@/apis/auth'
import Tooltip from '@/components/Tooltip'
import { useAppState } from '@/states'
import { UserState } from '@/states/reducers/stateReducer'
import { isIdasRelease } from '@/utils/releaseMode'
import { pages } from '@/utils/routes'
import siteRoot from '@/utils/siteRoot'
import { persistedStates } from '@/utils/storage'
import {
  getSystemTheme,
  getTextFromThemeSetting,
  useSystemThemeChange,
} from '@/utils/theme'

import Avatar from '../Avatar'
import Link, { MenuItemLink } from '../Link'

const MenuContent = () => {
  if (isIdasRelease) {
    return <></>
  }

  const { state, dispatch } = useAppState()
  const [themeSetting, setThemeSetting] = useState(persistedStates.theme)
  const [systemTheme, setSystemTheme] = useState(getSystemTheme())
  useSystemThemeChange((theme) => setSystemTheme(theme))

  const logout = async () => {
    await signOut()
    dispatch({ type: 'set user' })
  }

  const toggleTheme = () => {
    const current = state.theme
    if (themeSetting == 'auto' || current != systemTheme) {
      persistedStates.theme = current == 'light' ? 'dark' : 'light'
      dispatch({
        type: 'set theme',
        payload: persistedStates.theme,
      })
    } else {
      persistedStates.theme = 'auto'
    }
    setThemeSetting(persistedStates.theme)
  }
  return (
    <Box className="py-2">
      <MenuItem component={MenuItemLink} to={pages.user()}>
        <ListItemIcon>
          <Person fontSize="small" />
        </ListItemIcon>
        个人空间
      </MenuItem>
      <Divider variant="middle" flexItem></Divider>
      <MenuItem
        component={MenuItemLink}
        to={`${siteRoot}/forum.php?mod=collection`}
        external
        target="_blank"
      >
        <ListItemIcon>
          <SavedSearch fontSize="small" />
        </ListItemIcon>
        淘帖
      </MenuItem>
      <Divider variant="middle" flexItem></Divider>
      <MenuItem onClick={toggleTheme}>
        <ListItemIcon>
          {state.theme === 'light' ? (
            <LightMode fontSize="small" />
          ) : (
            <DarkMode fontSize="small" />
          )}
        </ListItemIcon>
        {getTextFromThemeSetting(themeSetting)}
      </MenuItem>
      <Divider variant="middle" flexItem></Divider>
      <MenuItem>
        <ListItemIcon>
          <TransferWithinAStation fontSize="small" />
        </ListItemIcon>
        切换账号
      </MenuItem>
      <Divider variant="middle" flexItem></Divider>
      <MenuItem component={MenuItemLink} to={pages.settings()}>
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
        <Link color="inherit" underline="none" to={pages.user()}>
          <Stack direction="row" alignItems="center">
            <Avatar className="mx-3" uid={user.uid} size={32} />
            <Typography>{user.username}</Typography>
          </Stack>
        </Link>
      </Tooltip>
    </>
  )
}

export default UserMenu
