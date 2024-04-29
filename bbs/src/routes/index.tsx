import {
  ScrollRestoration,
  createBrowserRouter,
  redirect,
} from 'react-router-dom'

import Continue, { ContinueError, ContinueLoader } from '@/pages/Continue'
import { RegisterHome } from '@/pages/Continue/Register'
import Renew from '@/pages/Continue/Renew'
import { ResetPasswordHome } from '@/pages/Continue/ResetPassword'
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
import { isIdasRelease } from '@/utils/releaseMode'

import routes from './routes'

const pages = [
  { path: '/', loader: () => redirect('/new') },
  { path: '/new', id: 'index', element: <Home /> },
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
]

const idasPreviewPages = [
  { path: '/', loader: () => (location.href = '/forum.php') },
]

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
      ...(isIdasRelease ? idasPreviewPages : pages),

      {
        path: '/renew',
        id: 'renew',
        element: <Renew />,
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
  {
    path: '/resetpassword',
    id: 'resetpassword',
    element: <ResetPasswordHome />,
  },
]

const router = createBrowserRouter(routes.current)

export default router
