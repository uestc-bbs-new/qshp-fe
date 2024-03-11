import React from 'react'

import { Box } from '@mui/material'

export const PostOptionsBlock = ({
  children,
}: {
  children?: React.ReactNode
}) => (
  <Box
    px={2.5}
    py={1.5}
    sx={(theme) => ({
      backgroundColor:
        theme.palette.mode == 'light' ? 'rgb(232, 243, 255)' : 'black',
    })}
  >
    {children}
  </Box>
)
