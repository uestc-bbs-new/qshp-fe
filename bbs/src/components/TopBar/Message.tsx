import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { MarkunreadOutlined } from '@mui/icons-material'
import { Badge, Box, Divider, MenuItem } from '@mui/material'

import Tooltip from '@/components/Tooltip'
import { useAppState } from '@/states'

const MessageTabs = () => {
  const [value, setValue] = useState(0)
  const navigate = useNavigate()

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
        @我的 <Badge color="warning" badgeContent={2} />
      </MenuItem>
      <Divider variant="middle" flexItem></Divider>
      <MenuItem
        onClick={() => navigate('/message')}
        className="flex justify-between"
      >
        我的消息 <Badge color="warning" badgeContent={2} />
      </MenuItem>
    </Box>
  )
}

const MessagePopover = () => {
  const { state } = useAppState()

  return (
    <>
      <Tooltip title={<MessageTabs />}>
        <Badge
          badgeContent={state.messages.unread_count}
          className="mx-3"
          color="warning"
        >
          <MarkunreadOutlined className="text-white" />
        </Badge>
      </Tooltip>
    </>
  )
}

export default MessagePopover
