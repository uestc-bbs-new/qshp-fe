import { ArrowBackIos } from '@mui/icons-material'
import { Stack } from '@mui/material'

import Link, { LinkProps } from '@/components/Link'

const Back = ({
  text,
  ...props
}: LinkProps & {
  text?: string
}) => (
  <Stack alignItems="flex-start">
    <Link underline="none" {...props}>
      <Stack direction="row" alignItems="center" py={2} pr={2}>
        <ArrowBackIos /> {text || '返回'}
      </Stack>
    </Link>
  </Stack>
)

export default Back
