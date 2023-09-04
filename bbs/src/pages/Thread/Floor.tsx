import { Box, Stack } from '@mui/material'

import Avatar from '@/components/Avatar'
import UserCard from '@/components/UserCard'

import Footer from './Footer'

type props = {
  children: React.ReactElement
  floor: number
  set_reply: (data: number) => void
}

const Floor = ({ children, floor, set_reply }: props) => {
  return (
    <Box className="py-4">
      <Stack direction="row">
        <Box className="w-40 flex justify-center pr-4">
          <UserCard uid={2}>
            <Avatar
              alt="Remy Sharp"
              uid={2}
              sx={{ width: 48, height: 48 }}
              variant="rounded"
            />
          </UserCard>
          {/* <Typography  */}
        </Box>
        <Box className="flex-1">{children}</Box>
      </Stack>
      <Footer floor={floor} set_reply={set_reply} />
    </Box>
  )
}

export default Floor
