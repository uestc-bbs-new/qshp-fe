import { Fragment, useEffect, useRef, useState } from 'react'

import SendIcon from '@mui/icons-material/Send'
import {
  Autocomplete,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material'

import { sendChatMessage } from '@/apis/messages'
// import AddRecipient from './AddRecipient'
import { searchUsers } from '@/apis/search'

const StartConversation = () => {
  const [open, setOpen] = useState(false)
  const [selectedChips, setSelectedChips] = useState<string[]>([])
  const [message, setMessage] = useState('')
  const timer = useRef<number | null>(null)
  const [friendList, setFriendList] = useState([{ username: '好友1', uid: 1 }])

  const [groupChatTitle, setGroupChatTitle] = useState('')

  useEffect(() => {
    ;(async () => {
      const res = await searchUsers({ query: '', withFriends: true })
      setFriendList([...(res.friends ? res.friends : []), ...res.rows])
    })()
  }, [])

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
            {/* <AddRecipient></AddRecipient> */}
            <Stack>
              <Autocomplete
                fullWidth
                multiple
                disableCloseOnSelect
                freeSolo
                filterSelectedOptions
                options={friendList.map((option) => option.username)}
                renderTags={(value: string[], getTagProps) => {
                  setSelectedChips(value)
                  return value.map((option: string, index: number) => (
                    <Chip
                      variant="outlined"
                      label={option}
                      {...getTagProps({ index })}
                      key={index}
                    />
                  ))
                }}
                renderInput={(params) => (
                  <div>
                    <TextField
                      {...params}
                      fullWidth
                      margin="dense"
                      label="收件人*"
                      placeholder="请选择好友或正确填写收件人用户名后回车"
                      onChange={async (e) => {
                        if (timer.current === null) {
                          timer.current = setTimeout(async () => {
                            const res = await searchUsers({
                              query: e.target.value,
                              withFriends: true,
                            })
                            setFriendList([
                              ...(res.friends ? res.friends : []),
                              ...res.rows,
                            ])
                            timer.current = null
                          }, 300)
                        }
                      }}
                    />
                    <DialogContentText marginBottom={1}>
                      注意：输入多个用户名时请使用
                      <strong>回车</strong>
                      将不同用户名分隔开
                    </DialogContentText>
                  </div>
                )}
              />
              {selectedChips.length >= 2 && (
                <TextField
                  fullWidth
                  id="outlined-textarea"
                  label="群聊标题*"
                  placeholder="请输入群聊标题，不超过80字"
                  margin="dense"
                  multiline
                  onChange={(e) => {
                    setGroupChatTitle(e.target.value)
                  }}
                />
              )}
            </Stack>
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
            onChange={(e) => {
              setMessage(e.target.value)
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>关闭</Button>
          <Button
            type="submit"
            onClick={() => {
              // let chatMsg = {
              //   usernames: selectedChips,
              //   message: message,
              // }
              // if (selectedChips.length >= 2){
              //   chatMsg.subject = groupChatTitle
              // }
              sendChatMessage({
                usernames: selectedChips,
                message: message,
                subject: groupChatTitle,
              })
            }}
          >
            发送
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}

export default StartConversation
