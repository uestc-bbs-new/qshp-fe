import { createTheme } from '@mui/material'

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
})

export default lightTheme
