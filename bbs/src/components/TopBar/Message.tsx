import React, { useState } from 'react'

import { MarkunreadOutlined } from '@mui/icons-material'
import { Badge, Box, Tab, Tabs, Typography } from '@mui/material'

import Tooltip from '@/components/Tooltip'
import { useAppState } from '@/states'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

const MessageTabs = () => {
  const [value, setValue] = useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="@我的" />
          <Tab label="消息" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        Item One
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
    </>
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
