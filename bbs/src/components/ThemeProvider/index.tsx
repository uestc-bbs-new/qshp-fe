import React from 'react'
import {
  StyledEngineProvider,
  ThemeProvider as MuiTheme,
  createTheme,
} from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

interface ThemeProps {
  children: React.ReactNode
  theme: string
}

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})

const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
})

const ThemeProvider = ({ children, theme }: ThemeProps) => {
  return (
    <StyledEngineProvider injectFirst>
      <MuiTheme theme={theme === 'dark' ? darkTheme : lightTheme}>
        <CssBaseline />
        {children}
      </MuiTheme>
    </StyledEngineProvider>
  )
}

export default ThemeProvider
