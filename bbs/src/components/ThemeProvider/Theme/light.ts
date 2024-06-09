import { createTheme } from '@mui/material'

import baseComponent, { baseTheme } from './base'

const lightTheme = createTheme(
  {
    palette: {
      mode: 'light',
    },
  },
  baseTheme,
  {
    palette: {
      background: {
        default: '#f8faff',
        paper: '#fff',
        paperHighlighted: '#f5f8fe',
      },
      primary: {
        main: '#2174f1',
      },
    },
    components: {
      ...baseComponent,
    },
  }
)

export default lightTheme
