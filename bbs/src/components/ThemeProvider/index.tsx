import React from 'react'

import CssBaseline from '@mui/material/CssBaseline'
import {
  ThemeProvider as MuiTheme,
  StyledEngineProvider,
} from '@mui/material/styles'

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
