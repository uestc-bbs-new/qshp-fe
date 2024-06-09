import { Fragment, useState } from 'react'

import SendIcon from '@mui/icons-material/Send'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material'

import AddRecipient from './AddRecipient'

const StartConversation = () => {
  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }
  return (
    <Fragment>
      {/* 点击按钮打开对话框 */}
      <Button
        sx={{ fontSize: '14px', width: 180 }}
        variant="contained"
        onClick={handleClickOpen}
      >
        <SendIcon sx={{ mr: 1 }} />
        <span style={{ marginRight: '6px' }}>开始聊天</span>
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          minWidth: '50%', // 设置宽度为屏幕宽度的40%
          maxWidth: '60%',
          margin: 'auto', // 水平居中
        }}
        PaperProps={{
          //需要注意一下，这里还需要修改！
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault()
            const formData = new FormData(event.currentTarget)
            const formJson = Object.fromEntries((formData as any).entries())
            const email = formJson.email
            console.log(email)
            handleClose()
          },
        }}
      >
        <DialogTitle style={{ fontWeight: 'bold', color: '#2175F3' }}>
          <span
            style={{
              display: 'inline-block',
              width: '6px',
              height: '14px',
              backgroundColor: '#2175F3',
              marginRight: '4px',
            }}
          ></span>
          开始聊天
        </DialogTitle>
        <DialogContent>
          <Stack direction="row">
            <AddRecipient></AddRecipient>
          </Stack>
          <DialogContentText marginBottom={1}></DialogContentText>
          <TextField
            fullWidth
            id="outlined-multiline-static"
            label="内容*"
            placeholder="请填写发送内容"
            multiline
            rows={5}
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>关闭</Button>
          <Button type="submit">发送</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}

export default StartConversation
