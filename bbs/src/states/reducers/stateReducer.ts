import { ForumDetails } from '@/common/interfaces/forum'
import { Announcement } from '@/common/interfaces/response'
import { getTotalMessages } from '@/utils/messages'

import { guestUser } from '..'

let uniqueKey = 0
const newUniqueKey = () => ++uniqueKey

export type UserState = {
  uninitialized?: boolean
  uid: number
  username: string
  new_pm?: number // This field is not yet available while Discuz! is still running
  new_pm_legacy?: boolean
  new_grouppm_legacy?: boolean
  new_notification?: number
}

type ThreadBreadcumbEntry = {
  thread_id: number
  subject: string
}

type GlobalDialogState = {
  kind?: 'login' | 'register' | 'image'
  prompt?: string
  imageDetails?: string
}

type GlobalSnackbarState = {
  message: string
  severity?: 'success' | 'warning' | 'error'
  key: number
}

type TopListViewState = {
  open?: boolean
  mounted?: boolean
  alwaysOpen?: boolean
  noTransition?: boolean
  manuallyOpened?: boolean
}

export type State = {
  drawer: boolean
  user: UserState
  userBreadcumbs?: {
    uid?: number
    username?: string
    self?: boolean
    subPage?: string
    subPageTitle?: string
  }
  activeForum?: ForumDetails
  activeThread?: ThreadBreadcumbEntry
  globalDialog?: GlobalDialogState
  globalSnackbar?: GlobalSnackbarState
  toplistView?: TopListViewState
  theme: 'light' | 'dark'
  announcement?: Announcement[]
}

export interface StateAction {
  readonly type: string
  readonly payload?: any
}

export const stateReducer = (state: State, action: StateAction): State => {
  switch (action.type) {
    case 'set user': {
      if (!action.payload && state.user != guestUser) {
        navigator.clearAppBadge && navigator.clearAppBadge()
        return {
          ...state,
          user: guestUser,
        }
      } else if (
        action.payload &&
        (action.payload.uid != state.user.uid ||
          action.payload.username != state.user.username ||
          action.payload.new_pm != state.user.new_pm ||
          action.payload.new_pm_legacy != state.user.new_pm_legacy ||
          action.payload.new_grouppm_legacy != state.user.new_grouppm_legacy ||
          action.payload.new_notification != state.user.new_notification)
      ) {
        const total = getTotalMessages(action.payload)
        navigator.setAppBadge && navigator.setAppBadge(total)
        return {
          ...state,
          user: action.payload,
          ...(action.payload.uid && { login: { open: false } }),
        }
      }
      return state
    }
    case 'set theme':
      return { ...state, theme: action.payload }
    case 'set drawer':
      return { ...state, drawer: !state.drawer }
    case 'set forum':
      if (state.activeForum?.fid == action.payload?.fid) {
        return state
      }
      return {
        ...state,
        activeForum: action.payload,
      }
    case 'set breadcumbs/user':
      return { ...state, userBreadcumbs: action.payload }
    case 'set thread':
      return { ...state, activeThread: action.payload }
    case 'open dialog':
      return {
        ...state,
        globalDialog: action.payload,
      }
    case 'close dialog':
      return {
        ...state,
        globalDialog: undefined,
      }
    case 'open toplist':
      return {
        ...state,
        toplistView: {
          ...action.payload,
          open: true,
          mounted: true,
        },
      }
    case 'close toplist':
      return {
        ...state,
        toplistView: {
          ...state.toplistView,
          ...action.payload,
          open: false,
        },
      }
    case 'open snackbar':
      return {
        ...state,
        globalSnackbar: { ...action.payload, key: newUniqueKey() },
      }
    case 'close snackbar':
      return {
        ...state,
        globalSnackbar: undefined,
      }
    case 'set announcement':
      return {
        ...state,
        announcement: action.payload,
      }
    default:
      return state
  }
}
