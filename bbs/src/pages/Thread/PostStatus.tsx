import { Alert, Typography } from '@mui/material'

import { PostFloor } from '@/common/interfaces/response'

const PostStatus = ({ post }: { post: PostFloor }) => {
  return (
    <>
      {post.warned && (
        <Alert severity="warning">
          <Typography>本帖被管理员或版主警告</Typography>
        </Alert>
      )}
      {post.blocked && (
        <Alert severity="warning">
          <Typography>本帖被管理员或版主屏蔽</Typography>
        </Alert>
      )}
      {post.hidden_reply && (
        <Alert severity="info">
          <Typography>此帖仅作者可见</Typography>
        </Alert>
      )}
      {post.password && (
        <Alert severity="info">
          <Typography>本帖为密码帖</Typography>
        </Alert>
      )}
      {post.invisible && (
        <Alert severity="warning">
          <Typography>本帖已删除</Typography>
        </Alert>
      )}
    </>
  )
}

export default PostStatus
