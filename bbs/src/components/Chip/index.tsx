import React from 'react'
import { Box, Typography } from '@mui/material'

import chipColor from './color'

interface Props {
  text: string
  small?: boolean
  type?: string
}

const Chip = ({ text, small, type = 'plate' }: Props) => {
  return (
    <Box className="inline-block">
      <Box
        className={`text-white rounded mr-2`}
        sx={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: chipColor(text, type),
        }}
      >
        <Typography variant="subtitle2" className={small ? 'px-1' : 'px-2'}>
          {text}
        </Typography>
      </Box>
    </Box>
  )
}

export default Chip
