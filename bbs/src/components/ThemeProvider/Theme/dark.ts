import { createTheme, lighten } from '@mui/material'

import baseComponent, { baseColors, baseTheme } from './base'

const darkTheme = createTheme(
  {
    palette: {
      mode: 'dark',
    },
  },
  baseTheme,
  {
    palette: {
      background: {
        default: '#292e39',
        paper: '#313742',
      },
    },
    components: {
      ...baseComponent,
    },
    typography: {
      signinTitle: {
        color: lighten(baseColors.signinTitle, 0.3),
      },
      authorCustomTitle: {
        color: lighten(baseColors.authorCustomTitle, 0.3),
      },
      authorGroupTitle: {
        color: lighten(baseColors.authorGroupTitle, 0.9),
      },
      authorGroupTitlePrompt: {
        color: lighten(baseColors.authorGroupTitlePrompt, 0.2),
      },
      authorGroupSubtitle: {
        color: lighten(baseColors.authorGroupSubtitle, 0.3),
      },
      userCardName: {
        color: '#ffffff',
      },
    },
  }
)
console.log(darkTheme)

export default darkTheme
