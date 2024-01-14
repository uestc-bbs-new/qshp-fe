import React, { useState } from 'react'

import { MarkunreadOutlined } from '@mui/icons-material'
import { Badge, Box, Divider, MenuItem } from '@mui/material'

import Tooltip from '@/components/Tooltip'
import { useAppState } from '@/states'
import { pages } from '@/utils/routes'

import { MenuItemLink } from '../Link'

const MessageTabs = () => {
  const [value, setValue] = useState(0)
  const { state } = useAppState()

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <Box
      sx={{ borderBottom: 1, borderColor: 'divider' }}
      className="p-2 w-40 min-w-fit"
    >
      <MenuItem
        component={MenuItemLink}
        to={pages.messages('chat')}
        className="flex justify-between"
      >
        站内信 <Badge color="warning" badgeContent={state.user.new_pm} />
      </MenuItem>
      <Divider variant="middle" flexItem></Divider>
      <MenuItem
        component={MenuItemLink}
        to={pages.messages('posts')}
        className="flex justify-between"
      >
        提醒{' '}
        <Badge color="warning" badgeContent={state.user.new_notification} />
      </MenuItem>
    </Box>
  )
}

const MessagePopover = () => {
  const { state } = useAppState()
  const totalMessages =
    (state.user.new_notification ?? 0) + (state.user.new_pm ?? 0)
  return (
    <>
      <Tooltip title={<MessageTabs />}>
        <Badge badgeContent={totalMessages} className="mx-3" color="warning">
          <MarkunreadOutlined className="text-white" />
        </Badge>
      </Tooltip>
    </>
  )
}

export default MessagePopover
