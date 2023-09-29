import { Box, Typography } from '@mui/material'

const EmptySearch = () => {
  return (
    <Box className="flex-1">
      <Typography>清水河畔</Typography>
      <Box className="shadow">
        <Typography>没有发现任何搜索结果。</Typography>
      </Box>
    </Box>
  )
}

export default EmptySearch
