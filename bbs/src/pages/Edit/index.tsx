import Vditor from 'vditor'

import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  Snackbar,
  Stack,
  TextField,
} from '@mui/material'

import { getForumDetails } from '@/apis/common'
import { PostThreadDetails, postThread } from '@/apis/thread'
import { ForumDetails } from '@/common/interfaces/response'
import Card from '@/components/Card'
import Editor from '@/components/Editor'
import { PostNotice } from '@/components/PostNotice'
import { useAppState } from '@/states'

const Edit = () => {
  const { dispatch } = useAppState()
  const [typeId, setTypeId] = useState('')
  const [vd, setVd] = useState<Vditor>() // editor ref
  const routeParam = useParams()
  const routeState = useLocation().state
  const [selectedForum, setSelectedForum] = useState<ForumDetails | undefined>(
    routeState?.forum?.fid ? routeState.forum : undefined
  )
  const threadTypes = selectedForum?.thread_types || []
  const shouldFetchForumDetails = routeParam.fid && !selectedForum
  const [forumLoading, setForumLoading] = useState(shouldFetchForumDetails)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const subjectRef = useRef<HTMLInputElement>()
  const [postPending, setPostPending] = useState(false)
  const navigate = useNavigate()

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
  useEffect(() => {
    dispatch({ type: 'set forum', payload: selectedForum })
  }, [selectedForum])

  const handleSubmit = async () => {
    if (postPending) {
      return
    }
    if (!selectedForum) {
      showError('请选择合适的版块。')
      return
    }
    if (
      threadTypes.length > 0 &&
      !selectedForum.optional_thread_type &&
      !typeId
    ) {
      showError('请选择合适的分类。')
      return
    }
    if (!subjectRef.current?.value) {
      showError('请输入标题。')
      return
    }
    const message = vd?.getValue()
    if (!message) {
      showError('请输入内容。')
      return
    }

    setPostPending(true)
    postThread(
      Object.assign(
        {
          forum_id: selectedForum.fid,
          subject: subjectRef.current.value,
          message,
          format: 2,
        },
        typeId ? { type_id: typeId } : {}
      ) as PostThreadDetails
    )
      .then((result) => {
        vd?.setValue('')
        navigate(`/thread/${result.thread_id}`)
      })
      .catch((err) => {
        setPostPending(false)
      })
  }
  const showError = (message: string) => {
    setSnackbarMessage(message)
    setSnackbarOpen(true)
  }

  return (
    <Box className="flex-1" mt={2}>
      <Card>
        <>
          {forumLoading ? (
            <Skeleton height={53} />
          ) : (
            <>
              {selectedForum?.post_notice.newthread && (
                <Box pt={2}>
                  <PostNotice forum={selectedForum} position="newthread" />
                </Box>
              )}
              <Stack direction="row" className="pb-4" pt={2}>
                <TextField
                  value={selectedForum?.name || '请选择版块'}
                  sx={{ minWidth: '12em' }}
                />
                {threadTypes.length > 0 && (
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
                <TextField fullWidth label="标题" inputRef={subjectRef} />
              </Stack>
            </>
          )}
          <Editor minHeight={300} setVd={setVd} />
          <Box className="text-center">
            <Button disabled={postPending} onClick={handleSubmit}>
              {postPending ? '请稍候...' : '发布主题'}
            </Button>
          </Box>
        </>
      </Card>
      <Snackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        autoHideDuration={5000}
        anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
      >
        <Alert severity="error">{snackbarMessage}</Alert>
      </Snackbar>
    </Box>
  )
}

export default Edit
