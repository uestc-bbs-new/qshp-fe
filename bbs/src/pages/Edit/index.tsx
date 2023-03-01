import Vditor from 'vditor'

import React, { useState } from 'react'

import {
  Box,
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

import { Forum } from '@/common/interfaces/response'
import Card from '@/components/Card'
import Editor from '@/components/Editor'
import { useAppState } from '@/states'

// TODO：set default group and forums due to the route params
const Edit = () => {
  const { state } = useAppState()
  const [group, setGroup] = useState('')
  const [forum, setForum] = useState('')
  const [groupItem, setGroupItem] = useState<Forum[]>([])
  const [vd, setVd] = useState<Vditor>()

  const handleSubmit = () => {
    console.log(vd?.getValue())
  }

  const handleGroupChange = (event: SelectChangeEvent) => {
    setGroup(event.target.value)

    const targetGroup: Forum | undefined = state.navList.find(
      (item) => item.fid.toString() === event.target.value.toString()
    )

    if (targetGroup) {
      setGroupItem(targetGroup.forums as Forum[])
    }
  }

  const handleForumChange = (event: SelectChangeEvent) => {
    setForum(event.target.value)
  }

  return (
    <Box className="flex-1">
      <Card>
        <>
          <Stack direction="row" className="pb-4">
            <Select value={group} onChange={handleGroupChange}>
              {state.navList.map((item) => (
                <MenuItem key={item.name} value={item.fid}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
            <Select value={forum} onChange={handleForumChange}>
              {groupItem.map((item) => (
                <MenuItem key={item.name} value={item.fid}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
            <TextField fullWidth hiddenLabel placeholder="主题标题" />
          </Stack>
          <Editor minHeight={300} setVd={setVd} />
          <Box className="text-center">
            <Button onClick={handleSubmit}>发布主题</Button>
          </Box>
        </>
      </Card>
    </Box>
  )
}

export default Edit
