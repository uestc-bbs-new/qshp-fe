import Vditor from 'vditor'

import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  Alert,
  Box,
  Button,
  Skeleton,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material'

import { PostThreadDetails, postThread, replyThreads } from '@/apis/thread'
import { ForumDetails } from '@/common/interfaces/response'
import Editor from '@/components/Editor'
import PostNotice from '@/components/Editor/PostNotice'
import { useSnackbar } from '@/components/Snackbar'
import { useAppState } from '@/states'
import { pages } from '@/utils/routes'

import Avatar from '../Avatar'
import Link from '../Link'
import { ThreadPostHeader } from './PostHeader'
import PostOptions from './PostOptions'

export type PostEditorKind = 'newthread' | 'reply'

const PostEditor = ({
  forum,
  forumLoading,
  kind,
  threadId,
  postId,
  onReplied,
}: {
  forum?: ForumDetails
  forumLoading?: boolean
  kind?: PostEditorKind
  threadId?: number
  postId?: number
  onReplied?: () => void
}) => {
  kind = kind || 'newthread'
  if (kind == 'reply' && !threadId) {
    return <></>
  }

  const navigate = useNavigate()
  const { state } = useAppState()
  const buttonText = kind == 'newthread' ? '发布主题' : '发表回复'
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

  const handleError = () => {
    setPostPending(false)
  }

  const handleSubmit = async () => {
    if (postPending) {
      return
    }

    if (kind == 'newthread' && !validateBeforeNewThread()) {
      return
    }

    const message = vd?.getValue() || ''
    if (!message.trim()) {
      showError('请输入内容。')
      return
    }

    setPostPending(true)
    if (kind == 'newthread') {
      postThread({
        ...postThreadRef.current,
        // |forum_id| must not be undefined because it is already validated.
        forum_id: postThreadRef.current.forum_id as number,
        message,
        format: 2,
      })
        .then((result) => {
          vd?.setValue('')
          navigate(pages.thread(result.thread_id))
        })
        .catch(handleError)
    } else if (kind == 'reply' && threadId) {
      replyThreads({
        thread_id: threadId,
        post_id: postId,
        message,
        format: 2,
        is_anonymous: postThreadRef.current.is_anonymous,
      })
        .then(() => {
          vd?.setValue('')
          setPostPending(false)
          onReplied && onReplied()
        })
        .catch(handleError)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key == 'Enter') {
      handleSubmit()
    }
  }

  return (
    <>
      {forumLoading ? (
        <Skeleton height={53} />
      ) : (
        <>
          <PostNotice forum={forum} position={kind} />
        </>
      )}
      <ThreadPostHeader
        kind={kind}
        selectedForum={forum}
        valueRef={postThreadRef}
      />
      <Stack direction="row">
        <Box mr={2}>
          <Avatar
            uid={state.user.uid}
            sx={{ width: 96, height: 96 }}
            variant="rounded"
          />
          <Link underline="hover">
            <Typography mt={1} textAlign="center">
              {state.user.username}
            </Typography>
          </Link>
        </Box>
        <Editor minHeight={300} setVd={setVd} onKeyDown={handleKeyDown} />
      </Stack>
      <PostOptions forum={forum} valueRef={postThreadRef} />
      <Box className="text-center">
        <Button disabled={postPending} onClick={handleSubmit}>
          {postPending ? '请稍候...' : buttonText}
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
