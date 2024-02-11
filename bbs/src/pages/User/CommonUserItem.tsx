import React, { useState } from 'react'

import { ExpandLess, ExpandMore } from '@mui/icons-material'
import {
  Box,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material'

import Avatar from '@/components/Avatar'
import Link from '@/components/Link'
import { pages } from '@/utils/routes'

import { FriendUser } from './types'

type MenuItemDefinition = {
  title: string
  onClick?: () => void
}

const CommonUserItem = ({
  user,
  children,
  menuItems,
}: {
  user: FriendUser
  children?: React.ReactNode
  menuItems?: MenuItemDefinition[]
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = !!anchorEl
  const handleOpenClick = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget as HTMLElement)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box p={0.5}>
      <Stack direction="row" sx={{ mt: 1 }}>
        <Link to={pages.user({ uid: user.uid })} sx={{ mr: 1.2 }}>
          <Avatar alt={user.username} uid={user.uid} size={40} />
        </Link>
        <Box className="flex-1">
          <Stack
            justifyContent="space-between"
            direction="column"
            sx={{ minWidth: 0 }}
          >
            <Stack direction="row">
              <Link
                to={pages.user({ uid: user.uid })}
                color="rgb(33, 117, 243)"
                underline="hover"
                className={'line-clamp-3'}
              >
                <Typography fontSize={16} fontWeight={500}>
                  {user.username}
                </Typography>
              </Link>
              {user.note && (
                <Typography
                  fontSize={16}
                  color="rgb(161, 173, 197)"
                  sx={{ ml: 1 }}
                >
                  ({user.note})
                </Typography>
              )}
            </Stack>
            {children}
          </Stack>
        </Box>
        {menuItems && (
          <Box>
            <ListItemButton
              aria-expanded={open ? 'true' : undefined}
              onClick={handleOpenClick}
              style={{ color: 'rgb(33, 117, 243)' }}
            >
              <Typography fontSize={12}>管理</Typography>
              {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Menu open={open} onClose={handleClose} anchorEl={anchorEl}>
              {menuItems.map((item, index) => (
                <MenuItem
                  key={index}
                  onClick={() => {
                    item.onClick && item.onClick()
                    setAnchorEl(null)
                  }}
                >
                  <ListItemText>{item.title}</ListItemText>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        )}
      </Stack>
    </Box>
  )
}

export default CommonUserItem
