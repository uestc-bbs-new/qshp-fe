import React from 'react'
import {
  StyledEngineProvider,
  ThemeProvider,
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

const Theme = ({ children, theme }: ThemeProps) => {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  )
}

export default Theme
