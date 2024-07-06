import { keyframes } from '@emotion/react'

import { Chip, SxProps, Theme } from '@mui/material'

import { pages } from '@/utils/routes'

import Link from '../Link'

const digestAnimation = keyframes`
from {
  background-position-x: 0%;
}
to {
  background-position-x: 200%;
}
`

const DigestAuthor = ({
  username,
  sx,
}: {
  username: string
  sx?: SxProps<Theme>
}) => (
  <Link
    underline="none"
    to={pages.searchThreads({ author: username, digest: true })}
  >
    <Chip
      label="精华帖作者"
      variant="threadItemDigest"
      sx={{
        background:
          'linear-gradient(0deg, rgba(255, 214, 102, 0) 1.654%, rgba(255, 122, 69, 0.2) 32.773%, rgba(255, 214, 102, 0) 49.647%, rgba(255, 214, 102, 0) 50.353%, rgba(255, 122, 69, 0.2) 67.227%, rgba(255, 214, 102, 0) 98.346%), linear-gradient(90deg, rgb(250, 219, 20), rgb(253, 235, 82) 29.898%, rgb(255, 251, 143) 50%, rgb(253, 235, 82) 70.102%, rgb(250, 219, 20) 100%)',
        p: 0.25,
        borderRadius: '0.75em',
        backgroundSize: '200% 100%',
        animation: `${digestAnimation} 2s linear infinite`,
        ...sx,
      }}
    />
  </Link>
)

export default DigestAuthor
