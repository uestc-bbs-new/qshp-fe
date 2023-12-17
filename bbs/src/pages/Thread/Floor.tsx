import { Alert, Box, Stack, Typography } from '@mui/material'

import { type PostFloor } from '@/common/interfaces/response'
import Avatar from '@/components/Avatar'
import UserCard from '@/components/UserCard'
import { chineseTime } from '@/utils/dayjs'

import Footer from './Footer'

type props = {
  children: React.ReactElement
  item: PostFloor
  set_reply: (data: number) => void
}

const Floor = ({ children, item, set_reply }: props) => {
  return (
    <Box className="py-4">
      <Stack direction="row">
        <Box className="w-40 flex justify-center pr-4">
          <UserCard item={item}>
            <div>
              <Avatar
                className="m-auto"
                alt="Remy Sharp"
                uid={item.author_id}
                sx={{ width: 48, height: 48 }}
                variant="rounded"
              />
              <div className="text-center text-blue-500">{item.author}</div>
            </div>
          </UserCard>

          {/* <Typography  */}
        </Box>
        <Box className="flex-1" minWidth="1em">
          <div className="text-sm text-slate-300 flex justify-between">
            <div>{chineseTime(item.dateline * 1000)}</div>
            <div className="flex flex-row gap-3 justify-between">
              <div
                className="hover:text-blue-500"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  navigator.clipboard.writeText(
                    window.location.href.split('#')[0] + '#' + item.position
                  )
                }}
              >
                分享
              </div>
              <div>#{item.position}</div>
            </div>
          </div>
          <PostStatus post={item} />
          {children}
          <Footer post={item} set_reply={set_reply} />
        </Box>
      </Stack>
    </Box>
  )
}

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
    </>
  )
}

export default Floor
