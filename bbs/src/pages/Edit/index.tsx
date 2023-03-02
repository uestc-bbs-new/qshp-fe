import Vditor from 'vditor'

import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import {
  Box,
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
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
  const [vd, setVd] = useState<Vditor>() // editor ref
  const routeParam = useParams()

  useEffect(() => {
    // default init group and forums to 水手之家 if no route params found
  }, [])

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
              {groupItem.length > 0 ? (
                groupItem.map((item) => (
                  <MenuItem key={item.name} value={item.fid}>
                    {item.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="">请选择板块</MenuItem>
              )}
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
