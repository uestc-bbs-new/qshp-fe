import React, { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { RouterProvider } from 'react-router-dom'

import useAppStateContext, { AppContext } from './states'
import { checkCookie } from './utils/cookie'
import ThemeProvider from './components/ThemeProvider'
import router from './routes'

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
