import { useQuery } from '@tanstack/react-query'

import React from 'react'

import { MarkunreadOutlined } from '@mui/icons-material'
import { Badge, Box, Divider, List, ListItem, MenuItem } from '@mui/material'

import { getMessagesSummary } from '@/apis/common'
import Tooltip from '@/components/Tooltip'
import { useAppState } from '@/states'
import { pages } from '@/utils/routes'

import { MenuItemLink } from '../Link'

const MessageTabs = () => {
  const { state } = useAppState()

  const { data } = useQuery({
    queryKey: ['messagesSummary'],
    queryFn: () => getMessagesSummary(),
  })

  return (
    <Box
      sx={{ borderBottom: 1, borderColor: 'divider' }}
      minWidth="40px"
      maxWidth="200px"
    >
      <MenuItem
        component={MenuItemLink}
        to={pages.messages('chat')}
        className="flex justify-between"
      >
        站内信{' '}
        <Badge
          color="warning"
          badgeContent={state.user.new_pm_legacy ? '' : undefined}
        />
      </MenuItem>
      <Divider variant="middle" flexItem></Divider>
      <MenuItem
        component={MenuItemLink}
        to={pages.messages('posts')}
        className="flex justify-between"
      >
        提醒{' '}
        <Badge
          color="warning"
          badgeContent={
            (state.user.new_notification || 0) +
            (state.user.new_grouppm_legacy ? 1 : 0)
          }
        />
      </MenuItem>
      <List>
        {data?.new_notifications
          ?.slice(0, 5)
          .map((item, index) => (
            <ListItem key={index}>{item.html_message}</ListItem>
          ))}
      </List>
    </Box>
  )
}

const MessagePopover = () => {
  const { state } = useAppState()
  const totalMessages =
    (state.user.new_notification ?? 0) +
    (state.user.new_pm_legacy ? 1 : 0) +
    (state.user.new_grouppm_legacy ? 1 : 0)
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
