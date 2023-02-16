import React from 'react'

import { createBrowserRouter } from 'react-router-dom'

import Layout from '@/pages/Layout'
import Home from '@/pages/Home'
import Search from '@/pages/Search'
import Edit from '@/pages/Edit'
import Forum from '@/pages/Forum'
import Thread from '@/pages/Thread'
// import NotFound from '@/pages/ErrorPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/search', element: <Search /> },
      { path: '/edit', element: <Edit /> },
      { path: '/forum/:id', element: <Forum /> },
      { path: '/thread/:id', element: <Thread /> },
    ],
  },
])

export default router
