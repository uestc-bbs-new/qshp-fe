import React from 'react'
import { Box, Stack } from '@mui/material'

import Avatar from '@/components/Avatar'

const Floor = () => {
  return (
    <Box className="py-2">
      <Stack direction="row">
        <Box className="px-2 w-40">
          <Avatar
            alt="Remy Sharp"
            src="https://mui.com/static/images/avatar/1.jpg"
            sx={{ width: 120, height: 120 }}
            variant="rounded"
          />
          {/* <Typography  */}
        </Box>
        <Box className="flex-1">21</Box>
      </Stack>
    </Box>
  )
}

export default Floor
