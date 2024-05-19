import { SxProps, ThemeOptions } from '@mui/material'

const rootElement = document.getElementById('root')

const threadItemLabelCommonStyle = {
  height: 'auto',
  lineHeight: 20 / 14,
  borderRadius: '0.5em',
  fontSize: 14,
  color: 'white',
  '& .MuiChip-label': {
    padding: '0 0.5em',
  },
}

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
  MuiButton: {
    variants: [
      {
        props: { variant: 'dialogOk' },
      },
      {
        props: { variant: 'dialogCancel' },
      },
    ],
  },
  MuiChip: {
    variants: [
      {
        props: { variant: 'threadItemDigest' },
        style: {
          ...threadItemLabelCommonStyle,
          color: '#4285f4',
          background:
            'linear-gradient(90.00deg, rgba(255, 214, 102, 0) 3.308%,rgba(255, 122, 69, 0.2) 65.546%,rgba(255, 214, 102, 0) 99.294%),linear-gradient(90.00deg, rgb(250, 219, 20),rgb(253, 235, 82) 59.796%,rgb(255, 251, 143) 100%)',
        },
      },
      {
        props: { variant: 'threadItemHot' },
        style: {
          ...threadItemLabelCommonStyle,
          background:
            'linear-gradient(90.00deg, rgb(255, 133, 192),rgba(255, 133, 192, 0) 100%),linear-gradient(270.00deg, rgba(250, 140, 22, 0.8) 0%,rgba(250, 84, 28, 0.8) 99.237%)',
        },
      },
      {
        props: { variant: 'threadItemRecommended' },
        style: {
          ...threadItemLabelCommonStyle,
          background:
            'linear-gradient(270.00deg, rgba(250, 173, 20, 0.8) 0%,rgba(250, 173, 20, 0) 100%),rgba(245, 108, 108, 0.6)',
        },
      },
      {
        props: { variant: 'threadItemExcellent' },
        style: {
          ...threadItemLabelCommonStyle,
          background:
            'linear-gradient(90.00deg, rgba(123, 225, 136, 0),rgb(123, 225, 136) 100%),rgba(33, 117, 243, 0.6)',
        },
      },
      {
        props: { variant: 'threadItemFreshman' },
        style: {
          ...threadItemLabelCommonStyle,
          background:
            'linear-gradient(270.00deg, rgb(217, 247, 190) 0%,rgba(217, 247, 190, 0) 100%),rgb(92, 219, 211)',
        },
      },
    ],
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
    threadItemSubject: React.CSSProperties
    threadItemSummary: React.CSSProperties
    threadItemForum: React.CSSProperties
    userProfileHeading: React.CSSProperties
    userProfileField: React.CSSProperties
    userProfileText: React.CSSProperties
    userItemSummary: React.CSSProperties
    userItemDetails: React.CSSProperties
    userAction: React.CSSProperties
    emptyListText: React.CSSProperties
    dialogTitle: React.CSSProperties
    replyCredit: React.CSSProperties
    replyCreditDetails: React.CSSProperties
    drawerItemText: React.CSSProperties
    drawerHeading: React.CSSProperties
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
    threadItemSubject?: React.CSSProperties
    threadItemSummary?: React.CSSProperties
    threadItemForum?: React.CSSProperties
    userProfileHeading?: React.CSSProperties
    userProfileField?: React.CSSProperties
    userProfileText?: React.CSSProperties
    userItemSummary?: React.CSSProperties
    userItemDetails?: React.CSSProperties
    userAction?: React.CSSProperties
    emptyListText?: React.CSSProperties
    dialogTitle?: React.CSSProperties
    replyCredit?: React.CSSProperties
    replyCreditDetails?: React.CSSProperties
    drawerItemText?: React.CSSProperties
    drawerHeading?: React.CSSProperties
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
    threadItemSubject: true
    threadItemSummary: true
    threadItemForum: true
    userProfileHeading: true
    userProfileField: true
    userProfileText: true
    userItemSummary: true
    userItemDetails: true
    userAction: true
    emptyListText: true
    dialogTitle: true
    replyCredit: true
    replyCreditDetails: true
    drawerItemText: true
    drawerHeading: true
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    dialogOk: true
    dialogCancel: true
  }
}

declare module '@mui/material/Chip' {
  interface ChipPropsVariantOverrides {
    threadItemDigest: true
    threadItemHot: true
    threadItemRecommended: true
    threadItemExcellent: true
    threadItemFreshman: true
  }
}

declare module '@mui/material/styles' {
  interface Theme {
    commonSx: {
      headerCardGradient: SxProps
    }
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    commonSx?: {
      headerCardGradient?: SxProps
    }
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
  mixins: {
    toolbar: {
      minHeight: 64,
    },
  },
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
    threadItemAuthor: {
      color: '#A1ADC5',
      fontSize: 14,
    },
    threadItemAuthorLink: {
      color: '#A1ADC5',
      fontSize: 14,
    },
    threadItemSubject: {
      color: '#303133',
      fontWeight: 500,
      fontSize: 16,
    },
    threadItemSummary: {
      color: '#606266',
      fontSize: 14,
    },
    threadItemStat: {
      color: '#606266',
      fontSize: 14,
    },
    threadItemForum: {
      color: 'rgba(33, 117, 243, 0.6)',
      fontSize: 14,
    },
    userProfileHeading: {
      fontSize: 16,
      fontWeight: 500,
      color: '#303133',
    },
    userProfileField: {
      fontSize: 14,
      color: '#303133',
    },
    userProfileText: {
      fontSize: 14,
      color: '#5F6166',
    },
    userItemSummary: {
      fontSize: 14,
      color: '#5F6166',
    },
    userAction: {
      fontSize: 16,
      fontWeight: 500,
      color: '#5F6166',
    },
    userItemDetails: {
      fontSize: 12,
      fontWeight: 500,
      color: '#A1ADC5',
    },
    emptyListText: {
      fontSize: 14,
      color: '#B5AEAE',
    },
    dialogTitle: {
      fontSize: 20,
      fontWeight: 500,
      color: '#2175F3',
    },
    replyCredit: {
      fontSize: 14,
      color: '#F26B4E',
    },
    replyCreditDetails: {
      fontSize: 16,
      color: '#F26B4E',
    },
    drawerItemText: {
      color: '#000000',
    },
    drawerHeading: {
      color: '#18181b',
      fontWeight: 700,
    },
  },

  commonSx: {
    headerCardGradient: {
      background: `linear-gradient(90deg, #E4EEFE, #FFFFFF 100%)`,
    },
  },
}

export default baseComponent
