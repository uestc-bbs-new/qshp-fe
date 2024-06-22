import React from 'react'

import { PersonAddAlt1 } from '@mui/icons-material'
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar as MuiAvatar,
  Typography,
} from '@mui/material'

import { User } from '@/common/interfaces/base'
import Avatar from '@/components/Avatar'

import { IdasResultEx } from './common'

const UserList = ({
  idasResult,
  disabled,
  showRegister,
  onClick,
  onRegister,
}: {
  idasResult: IdasResultEx
  disabled?: boolean
  showRegister?: boolean
  onClick: (user: User) => void
  onRegister: () => void
}) => (
  <List>
    {idasResult.users?.map((user, index) => (
      <ListItem disableGutters key={index}>
        <ListItemButton disabled={disabled} onClick={() => onClick(user)}>
          <ListItemIcon>
            <Avatar uid={user.uid} />
          </ListItemIcon>
          <ListItemText>
            <Typography>{user.username}</Typography>
          </ListItemText>
        </ListItemButton>
      </ListItem>
    ))}
    {showRegister && (
      <ListItem disableGutters key="new">
        <ListItemButton disabled={disabled} onClick={onRegister}>
          <ListItemIcon>
            <MuiAvatar variant="rounded">
              <PersonAddAlt1 />
            </MuiAvatar>
          </ListItemIcon>
          <Typography>注册新用户</Typography>
        </ListItemButton>
      </ListItem>
    )}
  </List>
)

export default UserList
