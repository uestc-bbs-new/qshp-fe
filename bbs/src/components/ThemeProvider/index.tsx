import React from 'react'
import {
  StyledEngineProvider,
  ThemeProvider as MuiTheme,
} from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import darkTheme from './Theme/dark'
import lightTheme from './Theme/light'

interface ThemeProps {
  children: React.ReactNode
  theme: string
}

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
