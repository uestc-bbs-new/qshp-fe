import { Box, Stack } from '@mui/material'

import Avatar from '@/components/Avatar'
import UserCard from '@/components/UserCard'

import Footer from './Footer'

type props = {
  children: React.ReactElement
}

const Floor = ({ children }: props) => {
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
      <Footer floor={0} />
    </Box>
  )
}

export default Floor
