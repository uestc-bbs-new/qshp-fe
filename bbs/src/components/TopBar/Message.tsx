import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { MarkunreadOutlined } from '@mui/icons-material'
import { Badge, Box, Divider, MenuItem } from '@mui/material'

import Tooltip from '@/components/Tooltip'
import { useAppState } from '@/states'

const MessageTabs = () => {
  const [value, setValue] = useState(0)
  const navigate = useNavigate()
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
        onClick={() => navigate('/message')}
        className="flex justify-between"
      >
        提醒{' '}
        <Badge color="warning" badgeContent={state.user.new_notification} />
      </MenuItem>
      <Divider variant="middle" flexItem></Divider>
      <MenuItem
        onClick={() => navigate('/message')}
        className="flex justify-between"
      >
        站内信 <Badge color="warning" badgeContent={state.user.new_pm} />
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
