import { ScrollRestoration, createBrowserRouter } from 'react-router-dom'

import Continue, { ContinueError, ContinueLoader } from '@/pages/Continue'
import { RegisterHome } from '@/pages/Continue/Register'
import Edit from '@/pages/Edit'
import Forum from '@/pages/Forum'
import Goto from '@/pages/Goto'
import Home from '@/pages/Home'
import Layout from '@/pages/Layout'
import Messages from '@/pages/Messages'
import Chat from '@/pages/Messages/Chat'
import Notifications from '@/pages/Messages/Notifications'
import NotFound from '@/pages/NotFound'
import Search from '@/pages/Search'
import Settings from '@/pages/Settings'
import Thread from '@/pages/Thread'
import User from '@/pages/User'

import routes from './routes'

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
      { path: '*', id: '404', element: <NotFound /> },
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
      {
        path: '/messages',
        element: <Messages />,
        children: [
          {
            id: 'messages',
            index: true,
            element: <Chat />,
          },
          {
            id: 'chat',
            path: 'chat/:plid?',
            element: <Chat />,
          },
          {
            id: 'chat_user',
            path: 'chat/user/:uid?',
            element: <Chat />,
          },
          {
            id: 'posts',
            path: 'posts/:kind?',
            element: <Notifications />,
          },
          {
            id: 'system',
            path: 'system/:kind?',
            element: <Notifications />,
          },
        ],
      },
      {
        path: '/settings/:id?',
        id: 'settings',
        element: <Settings />,
      },
      { path: '/user/:uid/:subPage?', id: 'user', element: <User /> },
      {
        path: '/user/name/:username/:subPage?',
        id: 'userByName',
        element: <User />,
      },
    ],
  },
  {
    path: '/continue/:mode?',
    id: 'continue',
    loader: ContinueLoader,
    element: <Continue />,
    errorElement: <ContinueError />,
  },
  {
    path: '/register',
    id: 'register',
    element: <RegisterHome />,
  },
]

const router = createBrowserRouter(routes.current)

export default router
