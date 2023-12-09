import Vditor from 'vditor'

import { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'

import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  Stack,
  TextField,
} from '@mui/material'

import { getForumDetails } from '@/apis/common'
import { Forum, ForumDetails } from '@/common/interfaces/response'
import Card from '@/components/Card'
import Editor from '@/components/Editor'
import { useAppState } from '@/states'

const Edit = () => {
  const { state } = useAppState()
  const [group, setGroup] = useState('')
  const [typeId, setTypeId] = useState('')
  const [groupItem, setGroupItem] = useState<Forum[]>([])
  const [vd, setVd] = useState<Vditor>() // editor ref
  const routeParam = useParams()
  const routeState = useLocation().state
  const [selectedForum, setSelectedForum] = useState<ForumDetails | undefined>(
    routeState?.forum?.fid ? routeState.forum : undefined
  )
  const shouldFetchForumDetails = routeParam.fid && !selectedForum
  const [forumLoading, setForumLoading] = useState(shouldFetchForumDetails)

  useEffect(() => {
    if (shouldFetchForumDetails && routeParam.fid) {
      getForumDetails(routeParam.fid)
        .then((forum) => {
          if (forum.can_post_thread) {
            setSelectedForum(forum)
          }
          setForumLoading(false)
        })
        .catch(() => setForumLoading(false))
    }
  }, [])

  const handleSubmit = () => {
    console.log(vd?.getValue())
  }

  return (
    <Box className="flex-1">
      <Card>
        <>
          {forumLoading ? (
            <Skeleton height={53} />
          ) : (
            <Stack direction="row" className="pb-4">
              <TextField
                value={selectedForum?.name || '请选择版块'}
                sx={{ minWidth: '12em' }}
              />
              {(selectedForum?.thread_types || []).length > 0 && (
                <FormControl sx={{ minWidth: `12em` }}>
                  <InputLabel id="post-typeid-label">请选择分类</InputLabel>
                  <Select
                    value={typeId}
                    label="请选择分类"
                    labelId="post-typeid-label"
                    onChange={(e) => setTypeId(e.target.value)}
                  >
                    {selectedForum?.thread_types.map((item) => (
                      <MenuItem key={item.name} value={item.type_id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              <TextField fullWidth hiddenLabel placeholder="主题标题" />
            </Stack>
          )}
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
