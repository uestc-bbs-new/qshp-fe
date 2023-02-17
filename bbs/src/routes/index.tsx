import React from 'react'

import { createBrowserRouter, RouteObject } from 'react-router-dom'

import Layout from '@/pages/Layout'
import Home from '@/pages/Home'
import Search from '@/pages/Search'
import Edit from '@/pages/Edit'
import Forum from '@/pages/Forum'
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
    ] as CustomRouteConfig[],
  },
] as CustomRouteConfig[])

export default router
