/* eslint-disable react/jsx-key */
import * as React from 'react'

import CheckBoxIcon from '@mui/icons-material/CheckBox'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import {
  Autocomplete,
  Chip,
  DialogContentText,
  Stack,
  TextField,
} from '@mui/material'

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />
const checkedIcon = <CheckBoxIcon fontSize="small" />

export default function ChooseFriends() {
  const [selectedChips, setSelectedChips] = React.useState(0)
  return (
    <Stack>
      <Autocomplete
        fullWidth
        multiple
        disableCloseOnSelect
        freeSolo
        options={FriendList.map((option) => option.friendname)}
        renderTags={(value: readonly string[], getTagProps) => {
          setSelectedChips(value.length)
          return value.map((option: string, index: number) => (
            <Chip
              variant="outlined"
              label={option}
              {...getTagProps({ index })}
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
            />
            <DialogContentText marginBottom={1}>
              注意：输入多个用户名时请使用
              <strong>回车</strong>
              将不同用户名分隔开
            </DialogContentText>
          </div>
        )}
      />
      {selectedChips >= 2 && (
        <TextField
          fullWidth
          id="outlined-textarea"
          label="群聊标题*"
          placeholder="请输入群聊标题，不超过80字"
          margin="dense"
          multiline
        />
      )}
    </Stack>
  )
}

const FriendList = [
  { friendname: '好友1', addtime: 1 },
  { friendname: '好友2', addtime: 2 },
  { friendname: '好友3', addtime: 3 },
  { friendname: '好友4', addtime: 4 },
  { friendname: '好友5', addtime: 5 },
  { friendname: '好友6', addtime: 6 },
  { friendname: '好友7', addtime: 7 },
  { friendname: '好友8', addtime: 8 },
  { friendname: '好友9', addtime: 9 },
  { friendname: '好友10', addtime: 10 },
  { friendname: '好友11', addtime: 11 },
  { friendname: '好友12', addtime: 12 },
  { friendname: '好友13', addtime: 13 },
  { friendname: '好友14', addtime: 14 },
]
