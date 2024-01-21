import { Forum, ForumDetails } from '@/common/interfaces/response'

import { guestUser } from '..'

export type UserState = {
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

type LoginDialogState = {
  open: boolean
  prompt?: string
}

type FidNameMap = { [fid: number]: string }

export type State = {
  drawer: boolean
  forumListCache?: Forum[]
  fidNameMap: FidNameMap
  user: UserState
  forumBreadcumbs: ForumBreadcumbEntry[]
  activeForum?: ForumDetails
  activeThread?: ThreadBreadcumbEntry
  login: LoginDialogState
  theme: 'light' | 'dark'
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
    case 'set forumListCache': {
      const fidNameMap: FidNameMap = {}
      const addToMap = (forum: Forum) => {
        fidNameMap[forum.fid] = forum.name
        forum.children?.length && forum.children.forEach(addToMap)
      }
      ;(action.payload as Forum[]).forEach(addToMap)
      return { ...state, forumListCache: action.payload, fidNameMap }
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
    case 'open login':
      return {
        ...state,
        login: {
          open: true,
          prompt: action.payload,
        },
      }
    case 'close login':
      return {
        ...state,
        login: { open: false },
      }
    default:
      return state
  }
}
