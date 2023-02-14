import React, { useEffect, useState } from 'react'

import {
  Box,
  Typography,
  IconButton,
  Menu,
  Tabs,
  Tab,
  Badge,
} from '@mui/material'

import { MarkunreadOutlined } from '@mui/icons-material'

import { useAppState } from '@/states'

// function TabPanel(props) {
//   const { children, value, index, ...other } = props

//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`simple-tabpanel-${index}`}
//       aria-labelledby={`simple-tab-${index}`}
//       {...other}
//     >
//       {value === index && (
//         <Box sx={{ p: 3 }}>
//           <Typography>{children}</Typography>
//         </Box>
//       )}
//     </div>
//   )
// }

const Message = () => {
  const [value, setValue] = useState(0)
  const { state } = useAppState()

  // const handleChange = (event, newValue) => {
  //   setValue(newValue)
  // }

  // const handleChangeIndex = (index) => {
  //   setValue(index)
  // }
  return (
    <>
      {/* <IconButton>
                <Badge badgeContent={unread} color="primary">
                  <AlternateEmailIcon color="action" />
                </Badge>
              </IconButton> */}
      <IconButton>
        <Badge badgeContent={state.messages.unread_count} color="primary">
          <MarkunreadOutlined color="action" />
        </Badge>
      </IconButton>

      <Menu
        open={false}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={value}
            // onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="帖子" />
            <Tab label="消息" />
          </Tabs>
        </Box>
        {/* <TabPanel value={value} index={0}>
          Item One
        </TabPanel>
        <TabPanel value={value} index={1}>
          Item Two
        </TabPanel> */}
      </Menu>

      {/* <Menu
                {...bindMenu(popupState)}
                PaperProps={paperProps}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem>
                  <Avatar /> Profile
                </MenuItem>
                <MenuItem>
                  <Avatar /> My account
                </MenuItem>
                <Divider />
                <MenuItem>
                  <ListItemIcon>
                    <AddIcon fontSize="small" />
                  </ListItemIcon>
                  Add another account
                </MenuItem>
                <MenuItem>
                  <ListItemIcon>
                    <AddIcon fontSize="small" />
                  </ListItemIcon>
                  Settings
                </MenuItem>
                <MenuItem>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu> */}
    </>
  )
}

export default Message
