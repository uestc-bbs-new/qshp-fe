import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'

import LoginDialog from './components/Login/LoginDialog'
import ThemeProvider from './components/ThemeProvider'
import router from './routes'
import useAppStateContext, { AppContext } from './states'
import {
  UserCallbackDetails,
  registerUserCallback,
  unregisterUserCallback,
} from './states/user'
import { checkCookie } from './utils/cookie'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  const [state, dispatch] = useAppStateContext()

  useEffect(() => {
    checkCookie()
  })

  useEffect(() => {
    const callback = (details: UserCallbackDetails) => {
      if (details.requireSignIn) {
        dispatch({ type: 'open login', payload: '请您登录后继续浏览。' })
      }
      dispatch({ type: 'set user', payload: details.user })
    }
    registerUserCallback(callback)
    return () => unregisterUserCallback(callback)
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <AppContext.Provider value={{ state, dispatch }}>
        <ThemeProvider theme={state.theme}>
          <>
            <RouterProvider router={router} />
            <LoginDialog open={state.login.open} />
          </>
        </ThemeProvider>
      </AppContext.Provider>
    </QueryClientProvider>
  )
}

export default App
