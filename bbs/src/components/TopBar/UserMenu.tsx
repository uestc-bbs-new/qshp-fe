import { useRef, useState } from 'react'

import {
  DarkMode,
  LightMode,
  Logout,
  Person,
  SavedSearch,
  Settings,
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
import Separated from '../Separated'
import { MessageTabs } from './Message'
import { getTotalMessages } from './messages'

const MenuContent = ({ small }: { small?: boolean }) => {
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
      <Separated
        separator={
          <Divider
            variant="middle"
            flexItem
            sx={small ? { '.MuiMenuItem-root+&': { my: 0 } } : undefined}
          />
        }
      >
        <MenuItem component={MenuItemLink} to={pages.user()}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          个人空间
        </MenuItem>
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
        {/* {!isPreviewRelease && (
          <MenuItem>
            <ListItemIcon>
              <TransferWithinAStation fontSize="small" />
            </ListItemIcon>
            切换账号
          </MenuItem>
        )} */}
        <MenuItem
          component={MenuItemLink}
          to={isPreviewRelease ? '/home.php?mod=spacecp' : pages.settings()}
          external={isPreviewRelease}
          target={isPreviewRelease ? '_blank' : undefined}
        >
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          设置
        </MenuItem>
        <MenuItem onClick={logout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          退出登录
        </MenuItem>
      </Separated>
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
        style={{ maxHeight: `${window.innerHeight - 64}px` }}
        // We have to use !important to override Popover's left attribute in inline style.
        slotProps={{ paper: { sx: { left: 'auto !important', right: 0 } } }}
      >
        <MessageTabs small />
        <MenuContent small />
      </Popover>
    </Box>
  )
}

export default UserMenu
