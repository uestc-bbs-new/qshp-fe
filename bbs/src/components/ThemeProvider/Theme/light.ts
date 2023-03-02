import { createTheme } from '@mui/material'

import baseComponent from './base'

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#f8faff',
      paper: '#fff',
    },
    primary: {
      main: '#2174f1',
    },
  },
  components: {
    ...baseComponent,
  },
})

export default lightTheme
