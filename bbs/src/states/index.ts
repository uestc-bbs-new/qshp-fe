import React, { createContext, useContext, useReducer } from 'react'

interface State {
  messages: { unread_count: number }
  drawer: boolean
  navList: Array<object>
  users: { uid: number; name: string }
  theme: 'light' | 'dark'
}

interface Action {
  readonly type: string
  readonly payload?: any
}

const reducer = (state: State, action: Action) => {
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
    default:
      return state
  }
}

const initialState: State = {
  messages: {
    unread_count: 1,
  },
  drawer: true, //侧边栏是否打开
  navList: [],
  users: {
    uid: 1,
    name: '',
  },
  theme: 'light', // light, dark
}

const useAppStateContext = () => useReducer(reducer, initialState)

export const AppContext = createContext({})

export const useAppState = () => useContext(AppContext)

export default useAppStateContext
