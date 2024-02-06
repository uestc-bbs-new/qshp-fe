import { Box, Divider, Stack, Typography } from '@mui/material'

import { Thread } from '@/common/interfaces/response'
import PostFriend from '@/components/PostFriend'
import Separated from '@/components/Separated'

function UserThreads() {
  const thread = ['主题', '回复', '点评']
  const test = {} as Thread

  return (
    <Box sx={{ height: 1400 }}>
      <Stack direction="row">
        <Separated
          separator={
            <Divider
              orientation="vertical"
              variant="middle"
              flexItem
              className="mx-2"
            />
          }
        >
          {thread.map((names, index) => (
            <Typography
              key={index}
              fontSize={12}
              sx={{ p: 0.5, minWidth: 12 }}
              style={{ color: 'rgb(145, 156, 164)' }}
            >
              {names}
            </Typography>
          ))}
        </Separated>
      </Stack>
      <Divider />
      <PostFriend thread />
      <PostFriend thread />
      <PostFriend thread />
    </Box>
  )
}
export default UserThreads
