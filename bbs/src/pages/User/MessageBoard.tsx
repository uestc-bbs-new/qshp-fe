import {
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

import { Thread } from '@/common/interfaces/response'
import PostFriend from '@/components/PostFriend'

function MessageBoard() {
  const test = {} as Thread

  return (
    <Box sx={{ height: 1400 }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ p: 2 }}>
        <Typography fontSize={16} fontWeight="600" color="rgb(95, 97, 102)">
          留言板
        </Typography>
        <TextField size="small" placeholder="请输入留言" sx={{ width: 624 }} />
        <Button variant="contained" sx={{ whiteSpace: 'nowrap' }}>
          留言
        </Button>
      </Stack>

      <Divider style={{ backgroundColor: '#eae8ed' }} />
      <PostFriend message />
    </Box>
  )
}
export default MessageBoard
