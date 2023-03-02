import { createTheme } from '@mui/material'

import baseComponent from './base'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#292e39',
      paper: '#292e39',
    },
    primary: {
      main: '#313742',
    },
  },
  components: {
    ...baseComponent,
  },
})

export default darkTheme
