import { ScrollRestoration, createBrowserRouter } from 'react-router-dom'

import Continue, { ContinueLoader } from '@/pages/Continue'
import Edit from '@/pages/Edit'
import Forum from '@/pages/Forum'
import Goto from '@/pages/Goto'
import Home from '@/pages/Home'
import Layout from '@/pages/Layout'
import Messages from '@/pages/Messages'
import Search from '@/pages/Search'
import Settings from '@/pages/Settings'
import Thread from '@/pages/Thread'

import routes from './routes'

// import NotFound from '@/pages/ErrorPage'

routes.current = [
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
      { path: '/messages', id: 'messages', element: <Messages /> },
      {
        path: '/settings/:id?',
        id: 'settings',
        element: <Settings />,
      },
      {
        path: '/continue',
        id: 'continue',
        loader: ContinueLoader,
        element: <Continue />,
      },
    ],
  },
]

const router = createBrowserRouter(routes.current)

export default router
