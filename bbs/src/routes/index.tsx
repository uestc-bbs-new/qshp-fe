import {
  RouteObject,
  ScrollRestoration,
  createBrowserRouter,
  redirect,
} from 'react-router-dom'

import adminRoutes from '@/admin/routes'
import Anniversary from '@/ext/anniversary'
import betRoutes from '@/ext/bet/routes'
import { LuckyDraw } from '@/ext/freshman'
import Continue, { ContinueError, ContinueLoader } from '@/pages/Continue'
import {
  EmailContinue,
  EmailContinueError,
  EmailContinueLoader,
} from '@/pages/Continue/Email'
import { RegisterHome } from '@/pages/Continue/Register'
import Renew from '@/pages/Continue/Renew'
import {
  ResetPasswordEmailHome,
  ResetPasswordHome,
} from '@/pages/Continue/ResetPassword'
import Edit from '@/pages/Edit'
import Forum from '@/pages/Forum'
import Goto, { GotoError } from '@/pages/Goto'
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
import { Welcome } from '@/pages/Welcome'
import { kCalendarTid } from '@/utils/calendar'
import { isPreviewRelease } from '@/utils/releaseMode'
import { pages } from '@/utils/routes'

import routes from './routes'

const indexLoader = ({ request }: { request: Request }) => {
  const url = new URL(request.url)
  const uidMatch = url.search.match(/^\?([0-9]+)$/)
  if (uidMatch) {
    return redirect(pages.user({ uid: parseInt(uidMatch[1]) }))
  }
  return redirect('/new')
}

const freshmanGuideLoader = () => redirect(pages.thread(2344547))

const devPages: RouteObject[] = [
  {
    path: '/settings/:id?',
    id: 'settings',
    element: <Settings />,
  },
]

const devMessagesPages: RouteObject[] = [
  {
    id: 'messages_chat',
    path: 'chat/:plid?',
    element: <Chat />,
  },
  {
    id: 'messages_chat_user',
    path: 'chat/user/:uid?',
    element: <Chat />,
  },
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
      { path: '/', loader: indexLoader },
      { path: '/new', id: 'index', element: <Home /> },
      { path: '/search/:type?', id: 'search', element: <Search /> },
      { path: '/post/:fid?', id: 'post', element: <Edit /> },
      { path: '/forum/:id', id: 'forum', element: <Forum /> },
      {
        path: '/thread/:id',
        id: 'thread',
        element: <Thread />,
      },
      {
        path: '/goto/:tidOrPid/:pid?',
        id: 'goto',
        loader: Goto,
        errorElement: <GotoError />,
      },
      {
        path: '/messages',
        element: <Messages />,
        children: [
          {
            id: 'messages',
            index: true,
            element: isPreviewRelease ? <Notifications /> : <Chat />,
          },
          {
            id: 'messages_posts',
            path: 'posts/:kind?',
            element: <Notifications />,
          },
          {
            id: 'messages_system',
            path: 'system/:kind?',
            element: <Notifications />,
          },
          ...(isPreviewRelease ? [] : devMessagesPages),
        ],
      },
      { path: '/user/:uid/:subPage?', id: 'user', element: <User /> },
      {
        path: '/user/name/:username/:subPage?',
        id: 'userByName',
        element: <User />,
      },
      ...adminRoutes,
      {
        path: '/x',
        children: [
          {
            path: '',
            loader: () => redirect('/'),
          },
          ...(isPreviewRelease ? [] : betRoutes),
        ],
      },
      {
        path: '/renew',
        id: 'renew',
        element: <Renew />,
      },
      {
        path: '/freshman/luckydraw',
        id: 'x_freshman_luckydraw',
        element: <LuckyDraw />,
      },
      {
        path: 'anniversary/18',
        id: 'x_anniversary_18',
        element: <Anniversary />,
      },
      ...(isPreviewRelease ? [] : devPages),

      // Legacy PHPWind handlers for backward compatibility.
      {
        path: '/job.php',
        id: 'legacy_phpwind_job',
        lazy: () => import('./legacy/lazy').then((a) => a.Job),
        element: <NotFound />,
      },
      {
        path: '/read.php',
        id: 'legacy_phpwind_read',
        lazy: () => import('./legacy/lazy').then((a) => a.Read),
        element: <NotFound />,
      },
      {
        path: '/u.php',
        id: 'legacy_phpwind_u',
        lazy: () => import('./legacy/lazy').then((a) => a.U),
        element: <NotFound />,
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
    path: '/continue/email/:verify',
    id: 'continue_email',
    loader: EmailContinueLoader,
    element: <EmailContinue />,
    errorElement: <EmailContinueError />,
  },
  {
    path: '/register',
    id: 'register',
    element: <RegisterHome />,
  },
  {
    path: '/welcome',
    id: 'welcome',
    element: <Welcome />,
  },
  {
    path: '/resetpassword',
    id: 'resetpassword',
    element: <ResetPasswordHome />,
  },
  {
    path: '/resetpassword/email',
    id: 'resetpassword_email',
    element: <ResetPasswordEmailHome />,
  },

  // Special redirects
  {
    path: '/freshman/guide',
    loader: freshmanGuideLoader,
  },
  {
    path: '/freshman_guide',
    loader: freshmanGuideLoader,
  },
  {
    path: '/freshman-guide',
    loader: freshmanGuideLoader,
  },
  {
    path: '/bus',
    loader: () => redirect(pages.thread(1430861)),
  },
  {
    path: '/calendar',
    loader: () => redirect(pages.thread(kCalendarTid)),
  },
  // Legacy redirects
  {
    path: '/graduate_bind/frontend',
    loader: () => redirect(pages.renew),
  },
  {
    path: '/graduate_bind/frontend/index.html',
    loader: () => redirect(pages.renew),
  },
]

const router = createBrowserRouter(routes.current)

export default router
