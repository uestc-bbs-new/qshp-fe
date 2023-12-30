import Vditor from 'vditor'

import { createRef, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Skeleton,
  Snackbar,
} from '@mui/material'

import { PostThreadDetails, postThread } from '@/apis/thread'
import { ForumDetails } from '@/common/interfaces/response'
import Editor from '@/components/Editor'
import PostNotice from '@/components/Editor/PostNotice'
import { useSnackbar } from '@/components/Snackbar'
import { pages } from '@/utils/routes'

import { ThreadPostHeader } from './PostHeader'

const PostEditor = ({
  forum,
  forumLoading,
}: {
  forum?: ForumDetails
  forumLoading?: boolean
}) => {
  const navigate = useNavigate()
  const [vd, setVd] = useState<Vditor>() // editor ref

  const threadTypes = forum?.thread_types || []
  const {
    props: snackbarProps,
    message: snackbarMessage,
    show: showError,
  } = useSnackbar()
  const postThreadRef = useRef<Partial<PostThreadDetails>>({})
  const anonymousRef = createRef<HTMLInputElement>()
  const [postPending, setPostPending] = useState(false)

  useEffect(() => {
    postThreadRef.current.forum_id = forum?.fid
  }, [forum?.fid])

  const handleSubmit = async () => {
    if (postPending) {
      return
    }
    if (!postThreadRef.current.forum_id) {
      showError('请选择合适的版块。')
      return
    }
    if (
      threadTypes.length > 0 &&
      !forum?.optional_thread_type &&
      !postThreadRef.current.type_id
    ) {
      showError('请选择合适的分类。')
      return
    }
    if (!postThreadRef.current?.subject) {
      showError('请输入标题。')
      return
    }
    const message = vd?.getValue()
    if (!message) {
      showError('请输入内容。')
      return
    }

    setPostPending(true)
    postThread({
      ...postThreadRef.current,
      forum_id: postThreadRef.current.forum_id,
      format: 2,
      message,
      is_anonymous: anonymousRef.current?.checked,
    })
      .then((result) => {
        vd?.setValue('')
        navigate(pages.thread(result.thread_id))
      })
      .catch((err) => {
        setPostPending(false)
      })
  }

  return (
    <>
      {forumLoading ? (
        <Skeleton height={53} />
      ) : (
        <>
          <PostNotice forum={forum} position="newthread" />
        </>
      )}
      <ThreadPostHeader selectedForum={forum} valueRef={postThreadRef} />
      <Editor minHeight={300} setVd={setVd} />
      <Box>
        {forum?.can_post_anonymously && (
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
      <Snackbar
        {...snackbarProps}
        autoHideDuration={5000}
        anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
        style={{ position: 'absolute', bottom: '60px' }}
      >
        <Alert severity="error">{snackbarMessage}</Alert>
      </Snackbar>
    </>
  )
}

export default PostEditor
