import { Stack, Typography } from '@mui/material'

import emptyList from '@/assets/empty-list.png'

const EmptyList = ({
  text,
  noPadding,
}: {
  text?: string
  noPadding?: boolean
}) => (
  <Stack alignItems="center" sx={noPadding ? undefined : { py: 5 }}>
    <img src={emptyList} />
    <Typography variant="emptyListText" mt={1.5}>
      {text || '暂无内容'}
    </Typography>
  </Stack>
)

export default EmptyList
