import { MouseEvent, useState } from 'react'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import SendIcon from '@mui/icons-material/Send'
import { Button, Menu, MenuItem } from '@mui/material'

const StartConversation = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  return (
    <div>
      <Button
        sx={{ fontSize: '14px', width: 180 }}
        id="basic-button"
        aria-controls={open ? 'demo-positioned-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        variant="contained"
      >
        <SendIcon sx={{ mr: 1 }} />
        <span style={{ marginRight: '6px' }}>开始聊天</span>
        <ExpandMoreIcon />
      </Button>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem sx={{ fontSize: '14px', width: 180 }} onClick={handleClose}>
          发起私聊
        </MenuItem>
        <MenuItem sx={{ fontSize: '14px', width: 180 }} onClick={handleClose}>
          发起群聊
        </MenuItem>
      </Menu>
    </div>
  )
}

export default StartConversation
