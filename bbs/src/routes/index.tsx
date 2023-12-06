import { useEffect } from 'react'
import {
  RouteObject,
  createBrowserRouter,
  useLocation,
  useNavigationType,
} from 'react-router-dom'

import Edit from '@/pages/Edit'
import Forum from '@/pages/Forum'
import Home from '@/pages/Home'
import Layout from '@/pages/Layout'
import Message from '@/pages/Message'
import Search from '@/pages/Search'
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
      { path: '/', id: 'index', name: '清水河畔', element: <Home /> },
      { path: '/search', id: 'search', name: '搜索帖子', element: <Search /> },
      { path: '/edit/:id?', name: '编辑帖子', element: <Edit /> },
      { path: '/forum/:id', id: 'forum', name: '论坛分区', element: <Forum /> },
      {
        path: '/thread/:id',
        id: 'thread',
        name: '内容详情',
        element: <Thread />,
      },
      { path: '/message', name: '消息', element: <Message /> },
    ] as CustomRouteConfig[],
  },
] as CustomRouteConfig[])

export default router
