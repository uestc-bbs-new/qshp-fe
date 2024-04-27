import { useQuery } from '@tanstack/react-query'

import React from 'react'

import { MarkunreadOutlined } from '@mui/icons-material'
import { Badge, Box, Divider, List, MenuItem } from '@mui/material'

import { getMessagesSummary } from '@/apis/messages'
import Tooltip from '@/components/Tooltip'
import ConversationItem from '@/pages/Messages/Chat/ConversationItem'
import NotificationItem from '@/pages/Messages/Notifications/NotificationItem'
import { useAppState } from '@/states'
import { isIdasRelease } from '@/utils/releaseMode'
import { pages } from '@/utils/routes'

import { MenuItemLink } from '../Link'

const kChatCount = 3
const kNotificationCount = 5

const MessageTabs = () => {
  const { state } = useAppState()

  const { data } = useQuery({
    queryKey: ['messagesSummary'],
    queryFn: () => getMessagesSummary(),
  })

  if (isIdasRelease) {
    return <></>
  }
  return (
    <Box
      sx={{ borderBottom: 1, borderColor: 'divider' }}
      p={1}
      minWidth="140px"
      maxWidth="300px"
    >
      <MenuItem
        component={MenuItemLink}
        to={pages.messages('chat')}
        className="flex justify-between"
      >
        站内信{' '}
        <Badge
          color="warning"
          badgeContent={
            data?.new_messages?.chat ||
            (state.user.new_pm_legacy ? '' : undefined)
          }
        />
      </MenuItem>
      {!!data?.new_chats?.length && (
        <List>
          {data?.new_chats
            ?.slice(0, kChatCount)
            .map((item, index) => (
              <ConversationItem key={index} chat={item} lite summary />
            ))}
        </List>
      )}
      <Divider />
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
      {!!data?.new_notifications?.length && (
        <List>
          {data?.new_notifications
            ?.slice(0, kNotificationCount)
            .map((item, index) => (
              <NotificationItem key={index} item={item} summary />
            ))}
        </List>
      )}
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
      <Tooltip
        title={<MessageTabs />}
        slotProps={{ tooltip: { sx: { fontSize: '1em' } } }}
      >
        <Badge badgeContent={totalMessages} className="mx-3" color="warning">
          <MarkunreadOutlined className="text-white" />
        </Badge>
      </Tooltip>
    </>
  )
}

export default MessagePopover
