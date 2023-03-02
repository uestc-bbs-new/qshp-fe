import { Box, Stack } from '@mui/material'

import Avatar from '@/components/Avatar'

import Footer from './Footer'

type props = {
  children: React.ReactElement
}

const Floor = ({ children }: props) => {
  return (
    <Box className="py-2">
      <Stack direction="row">
        <Box className="w-40">
          <Avatar
            alt="Remy Sharp"
            uid={2}
            sx={{ width: 120, height: 120 }}
            variant="rounded"
          />
          {/* <Typography  */}
        </Box>
        <Box className="flex-1">{children}</Box>
        <Footer floor={0} />
      </Stack>
    </Box>
  )
}

export default Floor
