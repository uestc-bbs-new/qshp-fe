import { Forum } from '@/common/interfaces/response'

export type State = {
  selectedPost: string
  messages: { unread_count: number }
  drawer: boolean
  navList: Forum[]
  users: { uid: number; name: string }
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
        messages: { unread_count: 0 },
        navList: [],
        users: { uid: -1, name: 'nobody' },
      }
    case 'set user': {
      return {
        ...state,
        users: action.payload,
      }
    }
    case 'set messages': {
      return {
        ...state,
        messages: { unread_count: action.payload },
      }
    }
    // case 'read messages': {
    //   const messages = [
    //     ...action.payload.messages,
    //     // ...state.rooms[action.payload.id].messages,
    //   ]
    //   return {
    //     ...state,
    //     messages: { unread_count: 0 },
    //   }
    // }
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
