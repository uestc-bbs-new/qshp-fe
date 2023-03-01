import { createTheme } from '@mui/material'

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
})

export default darkTheme
