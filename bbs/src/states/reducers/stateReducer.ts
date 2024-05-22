import { ForumDetails } from '@/common/interfaces/forum'
import { Announcement } from '@/common/interfaces/response'

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

type ForumBreadcumbEntry = {
  forum_id: number
  name: string
  top: boolean
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
  forumBreadcumbs: ForumBreadcumbEntry[]
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
      {
        const newForums: ForumBreadcumbEntry[] = []
        const forum = action.payload as ForumDetails | undefined
        if (forum?.fid) {
          console.log(forum.parents)
          newForums.unshift(
            ...forum.parents
              .concat([])
              .reverse()
              .map((parent, index) => ({
                forum_id: parent.fid,
                name: parent.name,
                top: index === 0,
              })),
            { forum_id: forum.fid, name: forum.name, top: false }
          )
        }
        return {
          ...state,
          activeForum: action.payload,
          forumBreadcumbs: newForums,
        }
      }
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
