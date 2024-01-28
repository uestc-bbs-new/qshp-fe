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
    },
  }
)
console.log(darkTheme)

export default darkTheme
