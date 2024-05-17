import { Theme } from '@mui/material'

export const kAppBarTop = 80

export const scrollAnchorCss = {
  scrollMarginTop: `${kAppBarTop}px`,
}

export const scrollAnchorSx = {
  scrollMarginTop: (theme: Theme) => theme.spacing(8 + 2),
}
