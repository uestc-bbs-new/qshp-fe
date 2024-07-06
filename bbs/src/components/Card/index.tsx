import { forwardRef } from 'react'

import { Box, BoxProps, Divider, Typography, useTheme } from '@mui/material'

type props = BoxProps & {
  children: React.ReactElement
  header?: string
  tiny?: boolean
  className?: string
}

const CardHead = ({ header }: { header: string }) => {
  return (
    <>
      <Box className="px-2 py-4">
        <Typography>{header}</Typography>
      </Box>
      <Divider />
    </>
  )
}

const Card = forwardRef(function Card(
  { children, header, tiny, className, ...other }: props,
  ref
) {
  const theme = useTheme()
  return (
    <Box
      {...other}
      ref={ref}
      className={`rounded-lg shadow-lg ${className}`}
      sx={{
        px: tiny ? 0.875 : 1.75,
        ...other.sx,
      }}
      style={{
        ...other.style,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      {header ? <CardHead header={header} /> : <></>}
      <Box>{children}</Box>
    </Box>
  )
})

export default Card
