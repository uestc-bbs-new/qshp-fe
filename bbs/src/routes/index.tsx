import { RouteObject, createBrowserRouter } from 'react-router-dom'

import Edit from '@/pages/Edit'
import Forum from '@/pages/Forum'
import Home from '@/pages/Home'
import Layout from '@/pages/Layout'
import Message from '@/pages/Message'
import Search from '@/pages/Search'
import Thread from '@/pages/Thread'

// import NotFound from '@/pages/ErrorPage'

type CustomRouteConfig = RouteObject & { name?: string }

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', name: '清水河畔', element: <Home /> },
      { path: '/search', name: '搜索帖子', element: <Search /> },
      { path: '/edit/:id?', name: '编辑帖子', element: <Edit /> },
      { path: '/forum/:id', name: '论坛分区', element: <Forum /> },
      { path: '/thread/:id', name: '内容详情', element: <Thread /> },
      { path: '/message', name: '消息', element: <Message /> },
    ] as CustomRouteConfig[],
  },
] as CustomRouteConfig[])

export default router
