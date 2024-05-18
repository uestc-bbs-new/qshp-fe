import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  Alert,
  Button,
  Card,
  Skeleton,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  debounce,
  useMediaQuery,
} from '@mui/material'

import { editPost, postThread, replyThread } from '@/apis/thread'
import { ExtCreditMap, extCreditNames } from '@/common/interfaces/base'
import { ForumDetails } from '@/common/interfaces/forum'
import { PostFloor } from '@/common/interfaces/response'
import Editor, { EditorHandle } from '@/components/Editor'
import PostNotice from '@/components/Editor/PostNotice'
import { useSnackbar } from '@/components/Snackbar'
import { useAppState } from '@/states'
import { pages } from '@/utils/routes'
import { handleCtrlEnter } from '@/utils/tools'

import Avatar from '../Avatar'
import Link from '../Link'
import {
  LegacyPostRenderer,
  renderLegacyPostToDangerousHtml,
} from '../RichText'
import { ThreadPostHeader } from './PostHeader'
import PostOptions from './PostOptions'
import ReplyQuote from './ReplyQuote'
import { PostEditorKind, PostEditorValue } from './types'

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
        size={size}
        sx={{ mr: small ? 1 : undefined }}
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

const convertLegacySmilies = (message: string) =>
  message.replace(/\[(?:s|a):(\d+)\]/g, '![$1](s)')
const convertLegacySimple = (message: string) =>
  convertLegacySmilies(message)
    .replace(/\[attach(?:img)?\](\d+)\[\/attach(?:img)?\]/g, '![](a:$1)')
    .replace(/\[url=home\.php\?mod=space&uid=(\d+)\]/g, '[url=/user/$1]')

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
  smallAuthor = smallAuthor || useMediaQuery('(max-width: 640px)')
  if (kind == 'reply' && !threadId) {
    return <></>
  }
  if (kind == 'edit' && initialValue && initialValue.format != 2) {
    initialValue = { ...initialValue }
    if (initialValue.format == 1 || initialValue.format == -1) {
      initialValue.format = 2
    }
    if (
      initialValue.format == 2 &&
      initialValue.smileyoff == 0 &&
      initialValue.message
    ) {
      initialValue.message = convertLegacySmilies(initialValue.message)
    }
  }

  const navigate = useNavigate()
  const { dispatch } = useAppState()
  const buttonText = { newthread: '发布主题', reply: '发表回复', edit: '保存' }[
    kind
  ]
  const editor = useRef<EditorHandle>(null)

  const {
    props: snackbarProps,
    message: snackbarMessage,
    show: showError,
  } = useSnackbar()
  const valueRef = useRef<PostEditorValue>({ ...initialValue })
  const [postPending, setPostPending] = useState(false)
  const [anonymous, setAnonymous] = useState(!!initialValue?.is_anonymous)

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

    let message = editor.current?.vditor?.getValue() || ''
    if (valueRef.current.format == 0) {
      message = valueRef.current.message || ''
    }
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
        attachments: editor.current?.attachments,
      })
        .then((result) => {
          editor.current?.vditor?.setValue('')
          editor.current?.attachments?.splice(0)
          notifyCreditsUpdate(result.ext_credits_update)
          navigate(pages.thread(result.thread_id))
        })
        .catch(handleError)
    } else if (kind == 'reply' && threadId) {
      replyThread({
        thread_id: threadId,
        post_id: postId,
        message: (valueRef.current.quoteMessagePrepend || '') + message,
        is_anonymous: valueRef.current.is_anonymous,
        attachments: editor.current?.attachments,
      })
        .then((result) => {
          editor.current?.vditor?.setValue('')
          editor.current?.attachments?.splice(0)
          notifyCreditsUpdate(result.ext_credits_update)
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
        attachments: editor.current?.attachments,
      })
        .then(() => {
          onSubmitted && onSubmitted()
        })
        .catch(handleError)
    }
  }

  const notifyCreditsUpdate = (updates?: ExtCreditMap) => {
    if (updates) {
      let hasNegative = false
      const message = extCreditNames
        .map((k) => {
          const v = updates[k]
          if (!v) {
            return ''
          }
          if (v < 0) {
            hasNegative = true
          }
          return `${k} ${v > 0 ? `+${v}` : v}`
        })
        .filter((text) => !!text)
        .join('，')
      if (message) {
        dispatch({
          type: 'open snackbar',
          payload: {
            severity: hasNegative ? 'warning' : 'success',
            message,
          },
        })
      }
    }
  }

  const [editLegacy, setEditLegacy] = useState(initialValue?.format == 0)
  const [legacyMessage, setLegacyMessage] = useState(initialValue?.message)
  const [legacyHtml, setLegacyHtml] = useState<string>()
  const legacyPost = editLegacy &&
    postId && {
      post_id: postId,
      smileyoff: initialValue?.smileyoff || 0,
      format: 0,
      message: legacyMessage || '',
      attachments: initialValue?.attachments,
    }
  const switchLegacyEdit = (legacy: boolean) => {
    if (!legacyHtml && !legacy && legacyPost) {
      console.log(convertLegacySimple(legacyPost.message))
      setLegacyHtml(
        renderLegacyPostToDangerousHtml(
          {
            ...legacyPost,
            message: convertLegacySimple(legacyPost.message),
          },
          undefined,
          useMediaQuery('(max-width: 640px)') ? 'small' : 'default'
        )
      )
    }
    setEditLegacy(legacy)
    valueRef.current.format = legacy ? 0 : 2
  }
  const updateLegacyPreview = useMemo(
    () =>
      debounce(() => {
        setLegacyMessage(valueRef.current.message)
      }, 300),
    []
  )

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
          {initialValue?.format == 0 && (
            <>
              <Alert severity="info">
                本帖在旧版河畔发表。您可以编辑旧版代码并预览效果，或转换为新版并重新调整格式。
              </Alert>
              <Tabs
                sx={{ my: 0.5 }}
                value={editLegacy ? 0 : 2}
                onChange={(_, value) => switchLegacyEdit(value == 0)}
              >
                <Tab label="编辑旧版代码" value={0} />
                <Tab label="转换为新版并调整格式" value={2} />
              </Tabs>
            </>
          )}
          {editLegacy && legacyPost && (
            <Stack>
              <TextField
                multiline
                defaultValue={legacyMessage}
                onChange={(e) => {
                  valueRef.current.message = e.target.value
                  updateLegacyPreview()
                }}
                maxRows={16}
              />
              <Card
                elevation={3}
                sx={{ maxHeight: '35vh', overflow: 'auto', mt: 1 }}
              >
                <LegacyPostRenderer post={legacyPost} />
              </Card>
            </Stack>
          )}
          {!editLegacy && (
            <Editor
              autoFocus={autoFocus}
              minHeight={300}
              initialValue={
                initialValue?.format == 0 ? undefined : initialValue?.message
              }
              initialHtml={legacyHtml}
              initialAttachments={initialValue?.attachments}
              onKeyDown={handleCtrlEnter(handleSubmit)}
              ref={editor}
            />
          )}
          <PostOptions
            kind={kind}
            forum={forum}
            initialValue={initialValue}
            valueRef={valueRef}
            onAnonymousChanged={() =>
              setAnonymous(!!valueRef.current.is_anonymous)
            }
          />
        </Stack>
      </Stack>
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
