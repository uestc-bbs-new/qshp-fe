import React, { createContext, useContext, useReducer } from 'react'

import { State, StateAction, stateReducer } from './reducers/stateReducer'

export type Theme = 'light' | 'dark'

// type AppContext = [state: State, dispatch: React.Dispatch<Action>]
const initialState = {
  messages: {
    unread_count: 1,
  },
  drawer: false, //侧边栏是否打开
  navList: [],
  users: {
    uid: 1,
    name: '',
  },
  theme: (localStorage.getItem('theme') as Theme) || 'light',
  selectedPost: '',
}

export const AppContext = createContext<{
  state: State
  dispatch: React.Dispatch<StateAction>
}>({
  state: initialState,
  dispatch: () => null,
})

const useAppStateContext = () => useReducer(stateReducer, initialState)

export const useAppState = () =>
  useContext<{
    state: State
    dispatch: React.Dispatch<StateAction>
  }>(AppContext)

export default useAppStateContext
