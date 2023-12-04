import { Forum } from '@/common/interfaces/response'

import { guestUser } from '..'

export type UserState = {
  uid: number
  username: string
  new_pm?: number
  new_notification?: number
}

export type State = {
  selectedPost: string
  drawer: boolean
  navList: Forum[]
  user: UserState
  theme: 'light' | 'dark'
}

export interface StateAction {
  readonly type: string
  readonly payload?: any
}

export const stateReducer = (state: State, action: StateAction) => {
  switch (action.type) {
    case 'clear':
      return {
        ...state,
        navList: [],
      }
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
          action.payload.new_notification != state.user.new_notification)
      ) {
        return {
          ...state,
          user: action.payload,
        }
      }
      return state
    }
    case 'set navList':
      return { ...state, navList: action.payload }
    case 'set theme':
      return { ...state, theme: action.payload }
    case 'set drawer':
      return { ...state, drawer: !state.drawer }
    case 'set post':
      return { ...state, selectedPost: action.payload }
    default:
      return state
  }
}
