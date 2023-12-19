import { Box, Typography } from '@mui/material'

import chipColor from './color'

interface Props {
  text: string
  size?: 'small' | 'medium' | 'large'
  type?: string
  className?: string
}

const Chip = ({ text, size, type = 'plate', className }: Props) => {
  const typographyClassName = {
    small: 'px-1',
    medium: 'px-2',
    large: 'px-3',
  }[size || 'medium']
  const typographyFontSize = size == 'large' ? 13 : 11
  return (
    <Box className={`inline-block ${className} pl-1`}>
      <Box
        className={`mr-2 rounded text-white`}
        sx={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: chipColor(text, type),
        }}
      >
        <Typography
          variant="subtitle2"
          className={typographyClassName}
          fontSize={typographyFontSize}
        >
          {text}
        </Typography>
      </Box>
    </Box>
  )
}

export default Chip
