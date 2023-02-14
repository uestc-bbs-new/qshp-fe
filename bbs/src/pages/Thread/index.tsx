import React from 'react'
import { Box, Typography, Divider } from '@mui/material'

import Chip from '@/components/Chip'
import Floor from './Floor'

function Thread() {
  return (
    <>
      <Box className="mb-6">
        <Box>
          <Chip text={'123'} />
          {'title'}
        </Box>
        <Typography>TagIcon, Time, Author</Typography>
      </Box>
      <Box className="bg-white rounded drop-shadow-md p-3">
        <Floor></Floor>
        <Divider />
      </Box>
    </>
  )
}
export default Thread
