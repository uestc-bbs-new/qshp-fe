import { css } from '@emotion/react'

import { Theme } from '@mui/material'

export const scrollAnchorStyle = {
  scrollMarginTop: '80px',
}
export const scrollAnchorCss = css({
  scrollMarginTop: '80px',
})

export const scrollAnchorSx = {
  scrollMarginTop: (theme: Theme) => theme.spacing(8 + 2),
}
