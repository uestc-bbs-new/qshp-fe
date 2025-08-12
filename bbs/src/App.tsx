import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'

import LoginDialog from './components/Login/LoginDialog'
import RegisterDialog from './components/Login/RegisterDialog'
import Renew2025Dialog from './components/Login/Renew2025Dialog'
import ThemeProvider from './components/ThemeProvider'
import ImageViewDialog from './dialogs/ImageViewDialog'
import router from './routes'
import useAppStateContext, { AppContext } from './states'
import {
  UserCallbackDetails,
  registerUserCallback,
  unregisterUserCallback,
} from './states/user'
import { persistedStates } from './utils/storage'
import { useSystemThemeChange } from './utils/theme'

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
    const callback = (details: UserCallbackDetails) => {
      if (details.requireSignIn) {
        dispatch({
          type: 'open dialog',
          payload: { kind: 'login', prompt: '请您登录后继续浏览。' },
        })
      }
      dispatch({ type: 'set user', payload: details.user })
      if (details.user?.user_class == 'gtest') {
        dispatch({ type: 'open dialog', payload: { kind: 'renew2025' } })
      }
    }
    registerUserCallback(callback)
    return () => unregisterUserCallback(callback)
  }, [])

  useSystemThemeChange((theme) => {
    if (persistedStates.theme == 'auto') {
      dispatch({ type: 'set theme', payload: theme })
    }
  })

  return (
    <QueryClientProvider client={queryClient}>
      <AppContext.Provider value={{ state, dispatch }}>
        <ThemeProvider theme={state.theme}>
          <>
            <RouterProvider router={router} />
            {state.globalDialog?.kind == 'login' && <LoginDialog open />}
            {state.globalDialog?.kind == 'register' && <RegisterDialog open />}
            {state.globalDialog?.kind == 'image' &&
              state.globalDialog?.imageDetails?.images && (
                <ImageViewDialog
                  open
                  onClose={() => dispatch({ type: 'close dialog' })}
                  details={state.globalDialog.imageDetails}
                />
              )}
            {state.globalDialog?.kind == 'renew2025' && (
              <Renew2025Dialog open />
            )}
          </>
        </ThemeProvider>
      </AppContext.Provider>
    </QueryClientProvider>
  )
}

export default App
