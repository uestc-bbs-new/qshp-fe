import { useEffect, useRef, useState } from 'react'

import {
  Autocomplete,
  Chip,
  DialogContentText,
  Stack,
  TextField,
} from '@mui/material'

import { searchUsers } from '@/apis/search'

type FriendType = {
  username: string
  uid: number
}

export default function ChooseFriends() {
  const [selectedChips, setSelectedChips] = useState(0)
  const timer = useRef<number | null>(null)
  const [friendList, setFriendList] = useState<FriendType[]>([])

  useEffect(() => {
    ;(async () => {
      const res = await searchUsers({ query: '', withFriends: true })
      console.log(res)
      setFriendList(res.rows)
    })()
  }, [])

  console.log()
  return (
    <Stack>
      <Autocomplete
        fullWidth
        multiple
        disableCloseOnSelect
        freeSolo
        filterSelectedOptions
        options={friendList.map((option) => option.username)}
        renderTags={(value: readonly string[], getTagProps) => {
          setSelectedChips(value.length)
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
                    setFriendList(res.rows)
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
