import { useState } from 'react'

import { Button, Stack } from '@mui/material'

import { votePost } from '@/apis/thread'
import { ForumDetails, PostFloor } from '@/common/interfaces/response'
import { useAppState } from '@/states'

type FooterProps = {
  forumDetails?: ForumDetails
  post: PostFloor
  onReply?: () => void
  onComment?: () => void
  onEdit?: () => void
}

const Footer = ({
  forumDetails,
  post,
  onReply,
  onComment,
  onEdit,
}: FooterProps) => {
  const { state } = useAppState()
  const [support, setSupport] = useState(post.support)
  const [oppose, setOppose] = useState(post.oppose)

  const canReply = forumDetails?.can_post_reply

  const vote = async (supportPost: boolean) => {
    if (
      await votePost({
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
  return (
    <Stack direction="row" mt={1}>
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
    </Stack>
  )
}

export default Footer
