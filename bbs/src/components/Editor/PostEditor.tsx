import Vditor from 'vditor'

import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  Alert,
  Button,
  Skeleton,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material'

import { editPost, postThread, replyThread } from '@/apis/thread'
import { ForumDetails, PostFloor } from '@/common/interfaces/response'
import Editor from '@/components/Editor'
import PostNotice from '@/components/Editor/PostNotice'
import { useSnackbar } from '@/components/Snackbar'
import { useAppState } from '@/states'
import { pages } from '@/utils/routes'
import { handleCtrlEnter } from '@/utils/tools'

import Avatar from '../Avatar'
import Link from '../Link'
import { ThreadPostHeader } from './PostHeader'
import PostOptions from './PostOptions'
import ReplyQuote from './ReplyQuote'
import { VoteSelection } from './VoteSelection'
import { PostEditorValue } from './types'

export type PostEditorKind = 'newthread' | 'reply' | 'edit'

const Author = ({
  small,
  anonymous,
}: {
  small?: boolean
  anonymous: boolean
}) => {
  const { state } = useAppState()
  const size = small ? 32 : 96
  return (
    <Stack direction={small ? 'row' : 'column'} alignItems="center" mr={2}>
      <Avatar
        uid={anonymous ? 0 : state.user.uid}
        sx={{ width: size, height: size, mr: small ? 1 : undefined }}
        variant="rounded"
      />
      <Typography mt={small ? undefined : 1} textAlign="center">
        {anonymous ? (
          '匿名'
        ) : (
          <Link underline="hover">{state.user.username}</Link>
        )}
      </Typography>
    </Stack>
  )
}

const PostEditor = ({
  forum,
  forumLoading,
  kind,
  threadId,
  postId,
  replyPost,
  initialValue,
  onSubmitted,
  smallAuthor,
  autoFocus,
}: {
  forum?: ForumDetails
  forumLoading?: boolean
  kind?: PostEditorKind
  threadId?: number
  postId?: number
  replyPost?: PostFloor
  initialValue?: PostEditorValue
  onSubmitted?: () => void
  smallAuthor?: boolean
  autoFocus?: boolean
}) => {
  kind = kind || 'newthread'
  if (kind == 'reply' && !threadId) {
    return <></>
  }

  const navigate = useNavigate()
  const buttonText = { newthread: '发布主题', reply: '发表回复', edit: '保存' }[
    kind
  ]
  const [vd, setVd] = useState<Vditor>() // editor ref

  const {
    props: snackbarProps,
    message: snackbarMessage,
    show: showError,
  } = useSnackbar()
  const valueRef = useRef<PostEditorValue>(initialValue || {})
  const [postPending, setPostPending] = useState(false)
  const [anonymous, setAnonymous] = useState(!!initialValue?.is_anonymous)

  // 帖子类型状态
  const [typeState, setTypeState] = useState({
    isVote: false,
  })

  const validateBeforeNewThread = () => {
    if (!valueRef.current.forum_id) {
      showError('请选择合适的版块。')
      return false
    }
    if (
      forum?.thread_types?.length &&
      !forum?.optional_thread_type &&
      !valueRef.current.type_id
    ) {
      showError('请选择合适的分类。')
      return false
    }
    if (!valueRef.current?.subject) {
      showError('请输入标题。')
      return false
    }

    return true
  }

  useEffect(() => {
    valueRef.current.forum_id = forum?.fid
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
        ...valueRef.current,
        // |forum_id| must not be undefined because it is already validated.
        forum_id: valueRef.current.forum_id as number,
        message,
        format: 2,
      })
        .then((result) => {
          vd?.setValue('')
          navigate(pages.thread(result.thread_id))
        })
        .catch(handleError)
    } else if (kind == 'reply' && threadId) {
      replyThread({
        thread_id: threadId,
        post_id: postId,
        message: (valueRef.current.quoteMessagePrepend || '') + message,
        is_anonymous: valueRef.current.is_anonymous,
      })
        .then(() => {
          vd?.setValue('')
          setPostPending(false)
          onSubmitted && onSubmitted()
        })
        .catch(handleError)
    } else if (kind == 'edit' && threadId && postId) {
      editPost({
        thread_id: threadId,
        post_id: postId,
        ...valueRef.current,
        message,
      })
        .then(() => {
          onSubmitted && onSubmitted()
        })
        .catch(handleError)
    }
  }

  const handleOptionsChange = () => {
    setAnonymous(!!valueRef.current.is_anonymous)
  }

  return (
    <>
      {forumLoading ? (
        <Skeleton height={53} />
      ) : (
        <PostNotice forum={forum} position={kind} />
      )}
      <Stack direction="row" flexShrink={1} minHeight="1em">
        {!smallAuthor && <Author anonymous={anonymous} />}
        <Stack flexGrow={1}>
          <ThreadPostHeader
            kind={kind}
            selectedForum={forum}
            initialValue={initialValue}
            valueRef={valueRef}
            onSubmit={handleSubmit}
          />
          {replyPost && (replyPost.position > 1 || !replyPost.is_first) && (
            <ReplyQuote post={replyPost} valueRef={valueRef} />
          )}
          <Editor
            autoFocus={autoFocus}
            minHeight={300}
            initialValue={initialValue?.message}
            setVd={setVd}
            onKeyDown={handleCtrlEnter(handleSubmit)}
          />
          <PostOptions
            forum={forum}
            initialValue={initialValue}
            valueRef={valueRef}
            onChanged={handleOptionsChange}
          />
        </Stack>
      </Stack>
      {kind === 'newthread' ? (
        <VoteSelection
          className="ml-24"
          isVote={typeState.isVote}
          changeIsVote={(e) => {
            setTypeState({ ...typeState, isVote: e })
          }}
        ></VoteSelection>
      ) : (
        <></>
      )}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent={smallAuthor ? 'flex-end' : 'center'}
        mt={1.5}
      >
        {smallAuthor && <Author small anonymous={anonymous} />}
        <Button
          variant="contained"
          disabled={postPending}
          onClick={handleSubmit}
        >
          {postPending ? '请稍候...' : buttonText}
        </Button>
      </Stack>
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
