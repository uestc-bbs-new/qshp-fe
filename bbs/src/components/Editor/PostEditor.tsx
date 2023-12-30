import Vditor from 'vditor'

import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Alert, Box, Button, Skeleton, Snackbar } from '@mui/material'

import { PostThreadDetails, postThread } from '@/apis/thread'
import { ForumDetails } from '@/common/interfaces/response'
import Editor from '@/components/Editor'
import PostNotice from '@/components/Editor/PostNotice'
import { useSnackbar } from '@/components/Snackbar'
import { pages } from '@/utils/routes'

import { ThreadPostHeader } from './PostHeader'
import PostOptions from './PostOptions'

const PostEditor = ({
  forum,
  forumLoading,
}: {
  forum?: ForumDetails
  forumLoading?: boolean
}) => {
  const navigate = useNavigate()
  const [vd, setVd] = useState<Vditor>() // editor ref

  const {
    props: snackbarProps,
    message: snackbarMessage,
    show: showError,
  } = useSnackbar()
  const postThreadRef = useRef<Partial<PostThreadDetails>>({})
  const [postPending, setPostPending] = useState(false)

  const validateBeforeNewThread = () => {
    if (!postThreadRef.current.forum_id) {
      showError('请选择合适的版块。')
      return false
    }
    if (
      forum?.thread_types?.length &&
      !forum?.optional_thread_type &&
      !postThreadRef.current.type_id
    ) {
      showError('请选择合适的分类。')
      return false
    }
    if (!postThreadRef.current?.subject) {
      showError('请输入标题。')
      return false
    }

    return true
  }

  useEffect(() => {
    postThreadRef.current.forum_id = forum?.fid
  }, [forum?.fid])

  const handleSubmit = async () => {
    if (postPending) {
      return
    }

    if (!validateBeforeNewThread()) {
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
      // |forum_id| must not be undefined because it is already validated.
      forum_id: postThreadRef.current.forum_id as number,
      format: 2,
      message,
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
      <PostOptions forum={forum} valueRef={postThreadRef} />
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
