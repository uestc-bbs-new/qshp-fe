import { useRef, useState } from 'react'

import { Box, Button, Stack, TextField } from '@mui/material'

import { parseApiError } from '@/apis/error'
import { kMaxCommentLength, postComment } from '@/apis/thread'
import { PostFloor } from '@/common/interfaces/response'
import { useAppState } from '@/states'
import { handleCtrlEnter } from '@/utils/tools'

const Comment = ({
  post,
  onClose,
  onCompleted,
}: {
  post: PostFloor
  onClose?: () => void
  onCompleted: () => void
}) => {
  const { dispatch } = useAppState()
  const [dialogPending, setDialogPending] = useState(false)
  const [commentError, setCommentError] = useState('')
  const commentMessage = useRef<HTMLInputElement>(null)
  const handleCommentChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) =>
    setCommentError(
      e.target.value.length > kMaxCommentLength
        ? `最长不超过 ${kMaxCommentLength} 字符。`
        : !e.target.value.trim()
          ? '请输入点评内容。'
          : ''
    )

  const sendComment = () => {
    if (commentMessage.current?.value && post && !commentError) {
      setDialogPending(true)
      postComment(post.thread_id, post.post_id, commentMessage.current.value)
        .then(() => {
          onClose && onClose()
          onCompleted()
        })
        .catch((e) => {
          setDialogPending(false)
          const { message } = parseApiError(e)
          dispatch({
            type: 'open snackbar',
            payload: {
              severity: 'error',
              message,
            },
          })
        })
    } else if (!commentError) {
      setCommentError('请输入点评内容。')
    }
  }
  return (
    <Box px={2}>
      <TextField
        fullWidth
        multiline
        required
        autoFocus
        error={!!commentError}
        helperText={commentError}
        inputRef={commentMessage}
        onChange={handleCommentChange}
        onKeyDown={handleCtrlEnter(sendComment)}
      />
      <Stack direction="row" justifyContent="center" my={1}>
        <Button
          variant="contained"
          onClick={sendComment}
          disabled={dialogPending}
        >
          发布
        </Button>
      </Stack>
    </Box>
  )
}

export default Comment
