import { Box, Divider } from '@mui/material'

import { Thread } from '@/common/interfaces/response'
import PostFriend from '@/components/PostFriend'

function Favorites() {
  const test = {} as Thread

  return (
    <Box sx={{ height: 1400 }}>
      <Box sx={{ height: 25 }}></Box>
      <Divider />
      <PostFriend favorate />
    </Box>
  )
}
export default Favorites
