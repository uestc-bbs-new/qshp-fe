import React, { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { RouterProvider } from 'react-router-dom'

import ThemeProvider from './components/ThemeProvider'
import router from './routes'
import useAppStateContext, { AppContext } from './states'
import { UserState } from './states/reducers/stateReducer'
import { registerUserCallback, unregisterUserCallback } from './states/user'
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
    const callback = (newUser?: UserState) => {
      dispatch({ type: 'set user', payload: newUser })
    }
    registerUserCallback(callback)
    return () => unregisterUserCallback(callback)
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <AppContext.Provider value={{ state, dispatch }}>
        <ThemeProvider theme={state.theme}>
          <RouterProvider router={router} />
        </ThemeProvider>
      </AppContext.Provider>
    </QueryClientProvider>
  )
}

export default App
