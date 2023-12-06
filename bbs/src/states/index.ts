import React, { createContext, useContext, useReducer } from 'react'

import { State, StateAction, stateReducer } from './reducers/stateReducer'

export type Theme = 'light' | 'dark'

// type AppContext = [state: State, dispatch: React.Dispatch<Action>]

const guestUser = {
  uid: 0,
  username: '游客',
}
const initialState: State = {
  drawer: false, //侧边栏是否打开
  navList: [],
  user: guestUser,
  forumBreadcumbs: [],
  theme: (localStorage.getItem('theme') as Theme) || 'light',
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
export { guestUser }
