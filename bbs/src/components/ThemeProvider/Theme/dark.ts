import { createTheme, lighten } from '@mui/material'

import baseComponent, { baseColors, baseTheme } from './base'

const darkTheme = createTheme(
  {
    palette: {
      mode: 'dark',
    },
  },
  baseTheme,
  {
    palette: {
      background: {
        default: '#141516',
        paper: '#292B2D',
      },
    },
    components: {
      ...baseComponent,
    },
    typography: {
      signinTitle: {
        color: '#3B8AFF',
      },
      authorCustomTitle: {
        color: lighten(baseColors.authorCustomTitle, 0.3),
      },
      authorGroupTitle: {
        color: lighten(baseColors.authorGroupTitle, 0.9),
      },
      authorGroupTitlePrompt: {
        color: lighten(baseColors.authorGroupTitlePrompt, 0.2),
      },
      authorGroupSubtitle: {
        color: lighten(baseColors.authorGroupSubtitle, 0.3),
      },
      userCardName: {
        color: '#ffffff',
      },
      threadItemAuthor: {
        color: '#8B97A4',
      },
      threadItemSubject: {
        color: '#FFFFFF',
      },
      threadItemSummary: {
        color: lighten('#606266', 0.7),
      },
      threadItemStat: {
        color: lighten('#606266', 0.7),
      },
      threadItemForum: {
        color: 'rgba(144, 202, 249, 0.7)',
      },
    },
    commonSx: {
      headerCardGradient: {
        background: `linear-gradient(90deg, rgba(32, 99, 212, 0.6), rgba(0, 0, 0, 0) 100%)`,
      },
    },
  }
)
console.log(darkTheme)

export default darkTheme
