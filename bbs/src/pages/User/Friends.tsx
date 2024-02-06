import {
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

//import { UserInfo } from '@/common/interfaces/response'
import PostFriend from '@/components/PostFriend'

function Friends() {
  //const test = {} as UserInfo

  return (
    <>
      <Box sx={{ height: 1400 }}>
        <Stack direction="row" justifyContent={'space-between'} sx={{ p: 1.5 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography fontSize={16} fontWeight="600" color="rgb(95, 97, 102)">
              查找好友
            </Typography>
            <TextField
              size="small"
              placeholder="输入用户名"
              sx={{ width: 600 }}
            />
            <Button variant="contained" sx={{ whiteSpace: 'nowrap' }}>
              搜索
            </Button>
          </Stack>

          <Typography color="rgb(33, 117, 243)" className="mt-3">
            邀请好友
          </Typography>
        </Stack>
        <Divider />
        <PostFriend friend />
        <PostFriend friend />
        <PostFriend friend />
      </Box>
    </>
  )
}
export default Friends
