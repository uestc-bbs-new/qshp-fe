import { Forum } from '@/common/interfaces/response'

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
        user: { uid: 0, name: '游客' },
      }
    case 'set user': {
      return {
        ...state,
        user: action.payload,
      }
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
