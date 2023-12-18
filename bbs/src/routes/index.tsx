import { useEffect } from 'react'
import {
  RouteObject,
  createBrowserRouter,
  useLocation,
  useNavigationType,
} from 'react-router-dom'

import Edit from '@/pages/Edit'
import Forum from '@/pages/Forum'
import Goto from '@/pages/Goto'
import Home from '@/pages/Home'
import Layout from '@/pages/Layout'
import Message from '@/pages/Message'
import Search from '@/pages/Search'
import Setting from '@/pages/Setting'
import Thread from '@/pages/Thread'

// import NotFound from '@/pages/ErrorPage'

type CustomRouteConfig = RouteObject & { name?: string }

const ScrollToTop = ({
  children,
}: {
  children: Array<React.ReactElement> | React.ReactElement
}) => {
  const location = useLocation()
  const navType = useNavigationType()
  useEffect(() => {
    if (navType != 'POP') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }
  }, [location])
  return <>{children}</>
}

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ScrollToTop>
        <Layout />
      </ScrollToTop>
    ),
    children: [
      { path: '/', id: 'index', element: <Home /> },
      { path: '/search', id: 'search', element: <Search /> },
      { path: '/post/:fid?', id: 'post', element: <Edit /> },
      { path: '/forum/:id', id: 'forum', element: <Forum /> },
      {
        path: '/thread/:id',
        id: 'thread',
        element: <Thread />,
      },
      { path: '/goto/:tidOrPid/:pid?', id: 'goto', loader: Goto },
      { path: '/message', element: <Message /> },
      {
        path: '/setting/:id?',
        id: 'setting',
        element: <Setting />,
      },
    ],
  },
])

export default router
