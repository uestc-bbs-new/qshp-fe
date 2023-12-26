import { useState } from 'react'

import { Button, Stack } from '@mui/material'

import { votePost } from '@/apis/thread'
import { PostFloor } from '@/common/interfaces/response'

type FooterProps = {
  post: PostFloor
  onReply?: () => void
  onComment?: () => void
}

const Footer = ({ post, onReply, onComment }: FooterProps) => {
  const [support, setSupport] = useState(post.support)
  const [oppose, setOppose] = useState(post.oppose)

  const vote = async (supportPost: boolean) => {
    if (
      await votePost({
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
      <Button variant="text" onClick={onComment}>
        点评
      </Button>
      <Button variant="text" onClick={onReply}>
        回复
      </Button>
      {post.position > 1 && (
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
