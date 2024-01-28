import { ThemeOptions } from '@mui/material'

const rootElement = document.getElementById('root')

const baseComponent = {
  MuiCssBaseline: {
    styleOverrides: {
      // TODO: 更改滚动条样式
      body: {
        scrollbarWidth: 'thin',
      },
    },
  },
  // this should be set to make tailwind work to the mui component
  MuiPopover: {
    defaultProps: {
      container: rootElement,
    },
  },
  MuiPopper: {
    defaultProps: {
      container: rootElement,
    },
  },
  MuiDialog: {
    defaultProps: {
      container: rootElement,
    },
  },
}

declare module '@mui/material/styles' {
  interface TypographyVariants {
    signinTitle: React.CSSProperties
  }
  interface TypographyVariantsOptions {
    signinTitle?: React.CSSProperties
  }
}
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    signinTitle: true
  }
}

export const baseColors = {
  signinTitle: '#0268FD',
}

export const baseTheme: ThemeOptions = {
  typography: {
    signinTitle: {
      fontSize: 36,
      fontWeight: 400,
      color: baseColors.signinTitle,
    },
  },
}

export default baseComponent
