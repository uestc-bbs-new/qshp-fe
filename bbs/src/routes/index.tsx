import { ScrollRestoration, createBrowserRouter } from 'react-router-dom'

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

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <Layout />
        <ScrollRestoration />
      </>
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
      { path: '/messages', id: 'messages', element: <Message /> },
      {
        path: '/settings/:id?',
        id: 'settings',
        element: <Setting />,
      },
    ],
  },
])

export default router
