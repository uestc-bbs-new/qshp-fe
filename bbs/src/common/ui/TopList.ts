import { useMediaQuery } from '@mui/material'

import { kContentWidth } from './base'

export const kSidebarWidth = 480

export const useSidebarInMarginMediaQuery = () =>
  useMediaQuery(`(min-width: ${kContentWidth + kSidebarWidth * 2}px)`)
