import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'

import { getUserFrontendSettings } from './apis/user'
import LoginDialog from './components/Login/LoginDialog'
import RegisterDialog from './components/Login/RegisterDialog'
import ThemeProvider from './components/ThemeProvider'
import ImageViewDialog from './dialogs/ImageViewDialog'
import router from './routes'
import useAppStateContext, { AppContext } from './states'
import { BreadcrumbProvider } from './states/breadcrumb'
import {
  getUserFrontendCache,
  updateUserFrontendCache,
} from './states/settings'
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

let frontendSettingsUpdatePending = false

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
    }

    const frontendSettingsCallback = async (details: UserCallbackDetails) => {
      if (details.user?.settings_version != undefined) {
        const cache = await getUserFrontendCache(details.user.uid)
        if (
          cache?._version != details.user.settings_version &&
          !frontendSettingsUpdatePending
        ) {
          frontendSettingsUpdatePending = true
          try {
            const value = await getUserFrontendSettings()
            await updateUserFrontendCache(
              details.user.uid,
              details.user.settings_version,
              value
            )
            dispatch({ type: 'set feSettings', payload: value })
          } finally {
            frontendSettingsUpdatePending = false
          }
        }
      }
    }

    registerUserCallback(callback)
    registerUserCallback(frontendSettingsCallback)
    return () => {
      unregisterUserCallback(callback)
      unregisterUserCallback(frontendSettingsCallback)
    }
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
          <BreadcrumbProvider>
            <>
              <RouterProvider router={router} />
              {state.globalDialog?.kind == 'login' && <LoginDialog open />}
              {state.globalDialog?.kind == 'register' && (
                <RegisterDialog open />
              )}
              {state.globalDialog?.kind == 'image' &&
                state.globalDialog?.imageDetails?.images && (
                  <ImageViewDialog
                    open
                    onClose={() => dispatch({ type: 'close dialog' })}
                    details={state.globalDialog.imageDetails}
                  />
                )}
            </>
          </BreadcrumbProvider>
        </ThemeProvider>
      </AppContext.Provider>
    </QueryClientProvider>
  )
}

export default App
