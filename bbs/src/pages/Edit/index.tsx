import Vditor from 'vditor'

import { createRef, useEffect, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  Snackbar,
  Stack,
  TextField,
} from '@mui/material'

import { getForumDetails } from '@/apis/common'
import { postThread } from '@/apis/thread'
import { ForumDetails } from '@/common/interfaces/response'
import Card from '@/components/Card'
import Editor from '@/components/Editor'
import { PostNotice } from '@/components/PostNotice'
import { useSnackbar } from '@/components/Snackbar'
import { useAppState } from '@/states'
import { pages } from '@/utils/routes'

import { ForumSelect } from './ForumSelect'

const Edit = () => {
  const { dispatch } = useAppState()
  const [typeId, setTypeId] = useState('')
  const [vd, setVd] = useState<Vditor>() // editor ref
  const routeParam = useParams()
  const routeState = useLocation().state
  const [openForumSelect, setOpenForumSelect] = useState(false)
  const [query, setQuery] = useState({
    fid: routeParam.fid,
  })
  const {
    data: selectedForum,
    isFetching: forumLoading,
    refetch,
  } = useQuery<ForumDetails>(['forumDetails', query], async () => {
    if (query.fid) {
      if (
        query.fid == routeState?.forum?.fid &&
        routeState.forum.can_post_thraed
      ) {
        return routeState.forum
      }
      const forum = await getForumDetails(query.fid)
      if (forum.can_post_thread) {
        return forum
      }
    }
    return undefined
  })
  const threadTypes = selectedForum?.thread_types || []
  const {
    props: snackbarProps,
    message: snackbarMessage,
    show: showError,
  } = useSnackbar()
  const subjectRef = useRef<HTMLInputElement>()
  const anonymousRef = createRef<HTMLInputElement>()
  const [postPending, setPostPending] = useState(false)
  const navigate = useNavigate()
  useEffect(() => {
    setQuery({ fid: routeParam.fid })
  }, [routeParam.fid])

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
          is_anonymous: anonymousRef.current?.checked,
        },
        typeId ? { type_id: typeId } : {}
      )
    )
      .then((result) => {
        vd?.setValue('')
        navigate(pages.thread(result.thread_id))
      })
      .catch((err) => {
        setPostPending(false)
      })
  }

  return (
    <Box className="flex-1" mt={2} position="relative">
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
                  onClick={() => setOpenForumSelect(true)}
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
          <Box>
            {selectedForum?.can_post_anonymously && (
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox inputRef={anonymousRef} />}
                  label="匿名发帖"
                />
              </FormGroup>
            )}
          </Box>
          <Box className="text-center">
            <Button disabled={postPending} onClick={handleSubmit}>
              {postPending ? '请稍候...' : '发布主题'}
            </Button>
          </Box>
        </>
      </Card>
      <Snackbar
        {...snackbarProps}
        autoHideDuration={5000}
        anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
        style={{ position: 'absolute', bottom: '60px' }}
      >
        <Alert severity="error">{snackbarMessage}</Alert>
      </Snackbar>
      <ForumSelect
        open={openForumSelect}
        selectedFid={selectedForum?.fid}
        onCompleted={(fid: number | undefined) => {
          if (fid != selectedForum?.fid) {
            navigate(`/post/${fid}`)
          }
          setOpenForumSelect(false)
        }}
      />
    </Box>
  )
}

export default Edit
