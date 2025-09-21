import { useEffect, useState } from 'react'

import { Box, Button, Stack } from '@mui/material'

import { parseApiError } from '@/apis/error'
import { DEPRECATED_votePost, ratePost } from '@/apis/thread'
import { ForumDetails } from '@/common/interfaces/forum'
import { PostFloor, Thread } from '@/common/interfaces/response'
import { useAppState } from '@/states'

import { FavoriteDialog } from './dialogs/Favorite'
import { RateDialog } from './dialogs/Rate'

const Footer = ({
  forumDetails,
  threadDetails,
  post,
  onReply,
  onComment,
  onEdit,
  onReport,
  onRateCompleted,
}: {
  forumDetails?: ForumDetails
  threadDetails?: Thread
  post: PostFloor
  onReply?: () => void
  onComment?: () => void
  onEdit?: () => void
  onReport?: () => void
  onRateCompleted?: () => void
}) => {
  const canReply =
    (forumDetails?.can_post_reply && threadDetails?.can_reply) || true

  const { state, dispatch } = useAppState()
  const [support, setSupport] = useState(post.support)
  const [oppose, setOppose] = useState(post.oppose)
  useEffect(() => {
    setSupport(post.support)
  }, [post.support])
  useEffect(() => {
    setOppose(post.oppose)
  }, [post.oppose])

  const vote = async (supportPost: boolean) => {
    if (
      await DEPRECATED_votePost({
        tid: post.thread_id,
        pid: post.post_id,
        support: supportPost,
      })
    ) {
      if (supportPost) {
        setSupport(support + 1)
      } else {
        setOppose(oppose + 1)
      }
    }
  }

  const [specialRatePending, setSpecialRatePending] = useState(false)
  const handleSpecialRate = async () => {
    setSpecialRatePending(true)
    try {
      await ratePost(post.post_id, {
        credits: {
          水滴: 50,
          威望: 1,
        },
        reason: '清水河畔官方红包楼奖励🧧',
        notify: true,
      })
      onRateCompleted && onRateCompleted()
    } catch (e) {
      const { message, severity } = parseApiError(e)
      dispatch({
        type: 'open snackbar',
        payload: {
          severity,
          message,
        },
      })
    } finally {
      setSpecialRatePending(false)
    }
  }

  const [favoriteDialog, setFavoriteDialog] = useState(false)
  const [rateDialog, setRateDialog] = useState(false)

  if (!state.user.uid) {
    return <Box pt={1} />
  }
  return (
    <Stack
      direction="row"
      flexWrap="wrap"
      mt={1}
      sx={{
        '@media (max-width: 355px)': {
          '& .MuiButton-root': {
            minWidth: 48,
            px: 1,
          },
        },
      }}
    >
      {canReply && (
        <>
          <Button variant="text" onClick={onComment}>
            点评
          </Button>
          <Button variant="text" onClick={onReply}>
            回复
          </Button>
          {post.author_id == state.user.uid && (
            <Button variant="text" onClick={onEdit}>
              编辑
            </Button>
          )}
        </>
      )}
      {(post.position > 1 || !post.is_first) && (
        <>
          <Button variant="text" onClick={() => vote(true)}>
            支持{!!support && ` (${support})`}
          </Button>
          <Button variant="text" onClick={() => vote(false)}>
            反对{!!oppose && ` (${oppose})`}
          </Button>
        </>
      )}
      {!!post.is_first && (
        <Button variant="text" onClick={() => setFavoriteDialog(true)}>
          收藏
          {!!threadDetails?.favorite_times &&
            ` (${threadDetails.favorite_times})`}
        </Button>
      )}
      {favoriteDialog && (
        <FavoriteDialog
          open
          onClose={() => setFavoriteDialog(false)}
          post={post}
        />
      )}
      <Button variant="text" onClick={() => setRateDialog(true)}>
        评分
      </Button>
      {forumDetails?.can_moderate && post.thread_id == 463952 && (
        <Button
          variant="text"
          onClick={handleSpecialRate}
          disabled={specialRatePending}
        >
          🧧红包楼奖励
        </Button>
      )}

      <Box flexGrow={1} flexShrink={1} />

      {post.author_id != state.user.uid && (
        <Button variant="text" onClick={onReport}>
          举报
        </Button>
      )}

      {rateDialog && (
        <RateDialog
          open
          onClose={() => setRateDialog(false)}
          onComplete={onRateCompleted}
          post={post}
        />
      )}
    </Stack>
  )
}

export default Footer
