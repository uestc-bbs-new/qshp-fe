import React, { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter } from 'react-router-dom'

import useAppStateContext, { AppContext } from './states'
import Theme from './Theme'
import { checkCookie } from './utils/cookie'
import Layout from './pages/Layout'

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
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AppContext.Provider value={{ state, dispatch }}>
          <Theme theme={state.theme}>
            <Layout />
          </Theme>
        </AppContext.Provider>
      </QueryClientProvider>
    </BrowserRouter>
  )
}

export default App
