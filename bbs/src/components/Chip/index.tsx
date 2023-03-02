import { Box, Typography } from '@mui/material'

import chipColor from './color'

interface Props {
  text: string
  small?: boolean
  type?: string
  className?: string
}

const Chip = ({ text, small, type = 'plate', className }: Props) => {
  return (
    <Box className={`inline-block ${className}`}>
      <Box
        className={`mr-2 rounded text-white`}
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
