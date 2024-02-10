import React, { useState } from 'react'

import { ExpandLess, ExpandMore } from '@mui/icons-material'
import { Box, ListItemButton, Menu, Stack, Typography } from '@mui/material'

import Avatar from '@/components/Avatar'
import Link from '@/components/Link'
import { useAppState } from '@/states'
import { pages } from '@/utils/routes'

import { FriendUser } from './types'

const CommonUserItem = ({
  user,
  children,
  menuItems,
}: {
  user: FriendUser
  children?: React.ReactNode
  menuItems?: React.ReactNode
}) => {
  const { dispatch } = useAppState()
  const handleClick = () => {
    dispatch({ type: 'set post', payload: '0' })
  }

  const [closeEl, setMenuEl] = useState<null | HTMLElement>(null)
  const [isOpen, setOpen] = useState(false)
  const handleOpenClick = (e: React.MouseEvent<HTMLElement>) => {
    setOpen(!isOpen)
    setMenuEl(e.currentTarget as HTMLElement)
  }
  const handleClose = () => {
    setMenuEl(null)
    setOpen(!isOpen)
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
                onClick={handleClick}
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
              aria-expanded={isOpen ? 'true' : undefined}
              onClick={handleOpenClick}
              style={{ color: 'rgb(33, 117, 243)' }}
            >
              <Typography fontSize={12}>管理</Typography>
              {isOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Menu open={isOpen} onClose={handleClose} anchorEl={closeEl}>
              {menuItems}
            </Menu>
          </Box>
        )}
      </Stack>
    </Box>
  )
}

export default CommonUserItem
