import { useQuery } from '@tanstack/react-query'

import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from 'react'

import { getForumList } from '@/apis/common'

import { State, StateAction, stateReducer } from './reducers/stateReducer'

export type Theme = 'light' | 'dark'

// type AppContext = [state: State, dispatch: React.Dispatch<Action>]

const guestUser = {
  uid: 0,
  username: '游客',
}
const initialState: State = {
  drawer: false, //侧边栏是否打开
  user: guestUser,
  fidNameMap: {},
  forumBreadcumbs: [],
  login: {
    open: false,
  },
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

export const useForumList = () => {
  const { state } = useAppState()
  const { data: forumList, refetch } = useQuery({
    queryKey: ['forumList'],
    queryFn: () => getForumList(),
    initialData: state.forumListCache,
    staleTime: Infinity,
    enabled: !state.forumListCache,
  })
  const previousUid = useRef(state.user.uid)
  useEffect(() => {
    if (previousUid.current != state.user.uid) {
      refetch()
      previousUid.current = state.user.uid
    }
  }, [state.user.uid])
  return forumList
}

export const useSignInChange = (callback: () => void) => {
  const { state } = useAppState()
  useEffect(() => {
    callback()
  }, [state.user.uid])
}

export default useAppStateContext
export { guestUser }
