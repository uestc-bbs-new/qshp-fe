import { useRef, useState } from 'react'

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
  Badge,
  Box,
  Divider,
  ListItemIcon,
  MenuItem,
  Popover,
  Stack,
  Typography,
} from '@mui/material'

import { signOut } from '@/apis/auth'
import Tooltip from '@/components/Tooltip'
import { useAppState } from '@/states'
import { UserState } from '@/states/reducers/stateReducer'
import { isIdasRelease, isPreviewRelease } from '@/utils/releaseMode'
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
import { MessageTabs } from './Message'
import { getTotalMessages } from './messages'

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
      {!isPreviewRelease && (
        <>
          <Divider variant="middle" flexItem></Divider>
          <MenuItem>
            <ListItemIcon>
              <TransferWithinAStation fontSize="small" />
            </ListItemIcon>
            切换账号
          </MenuItem>
        </>
      )}
      <Divider variant="middle" flexItem></Divider>
      <MenuItem
        component={MenuItemLink}
        to={isPreviewRelease ? '/home.php?mod=spacecp' : pages.settings()}
        external={isPreviewRelease}
      >
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
        退出登录
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

export const MiniUserMenu = ({ user }: { user: UserState }) => {
  const kMax = 99
  const total = getTotalMessages(user)
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  return (
    <Box onClick={() => setOpen(!open)} ref={menuRef}>
      <Badge badgeContent={total > kMax ? `${kMax}+` : total} color="warning">
        <Avatar uid={user.uid} size={32} />
      </Badge>
      <Popover
        open={open}
        onClose={() => setOpen(false)}
        anchorEl={menuRef.current}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        elevation={4}
        sx={{ maxHeight: 'calc(100vh - 64px)' }}
      >
        <MessageTabs />
        <MenuContent />
      </Popover>
    </Box>
  )
}

export default UserMenu
