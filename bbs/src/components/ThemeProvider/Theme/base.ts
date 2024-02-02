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
    authorName: React.CSSProperties
    authorCustomTitle: React.CSSProperties
    authorGroupTitle: React.CSSProperties
    authorGroupTitlePrompt: React.CSSProperties
    authorGroupSubtitle: React.CSSProperties
    userCardName: React.CSSProperties
    threadItemStat: React.CSSProperties
    threadItemAuthor: React.CSSProperties
    threadItemAuthorLink: React.CSSProperties
  }
  interface TypographyVariantsOptions {
    signinTitle?: React.CSSProperties
    authorName?: React.CSSProperties
    authorCustomTitle?: React.CSSProperties
    authorGroupTitle?: React.CSSProperties
    authorGroupTitlePrompt?: React.CSSProperties
    authorGroupSubtitle?: React.CSSProperties
    userCardName?: React.CSSProperties
    threadItemStat?: React.CSSProperties
    threadItemAuthor?: React.CSSProperties
    threadItemAuthorLink?: React.CSSProperties
  }
}
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    signinTitle: true
    authorName: true
    authorCustomTitle: true
    authorGroupTitle: true
    authorGroupTitlePrompt: true
    authorGroupSubtitle: true
    userCardName: true
    threadItemStat: true
    threadItemAuthor: true
    threadItemAuthorLink: true
  }
}

export const baseColors = {
  signinTitle: '#0268FD',
  authorCustomTitle: '#999999',
  authorGroupTitle: '#666666',
  authorGroupTitlePrompt: '#F26C4F',
  authorGroupSubtitle: '#999999',
}

export const baseTheme: ThemeOptions = {
  typography: {
    signinTitle: {
      fontSize: 36,
      fontWeight: 400,
      color: baseColors.signinTitle,
    },
    authorName: {
      fontSize: 15,
      textAlign: 'center',
    },
    authorCustomTitle: {
      fontSize: 13,
      textAlign: 'justify',
      color: baseColors.authorCustomTitle,
    },
    authorGroupTitle: {
      fontSize: 14,
      color: baseColors.authorGroupTitle,
    },
    authorGroupTitlePrompt: {
      color: baseColors.authorGroupTitlePrompt,
    },
    authorGroupSubtitle: {
      color: baseColors.authorGroupSubtitle,
      fontSize: 13,
    },
    userCardName: {
      color: '#000000',
      fontSize: 15,
      fontWeight: 'bold',
    },
    threadItemStat: {
      color: '#606266',
      fontSize: 14,
    },
    threadItemAuthor: {
      color: '#A1ADC5',
      fontSize: 14,
    },
    threadItemAuthorLink: {
      color: '#A1ADC5',
      fontSize: 14,
    },
  },
}

export default baseComponent
