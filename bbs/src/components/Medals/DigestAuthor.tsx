import { Chip, SxProps, Theme } from '@mui/material'

const DigestAuthor = ({ sx }: { sx?: SxProps<Theme> }) => (
  <Chip label="精华帖作者" variant="threadItemDigest" sx={sx} />
)

export default DigestAuthor
