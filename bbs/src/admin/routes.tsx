import { RouteObject } from 'react-router-dom'

const adminRoutes: RouteObject[] = [
  {
    path: 'admin',
    lazy: () => import('./lazy').then((a) => a.LayoutRoute),
    children: [
      {
        id: 'admin/index',
        index: true,
        lazy: () => import('./lazy').then((a) => a.IndexRoute),
      },
      {
        id: 'admin/global/announcement',
        path: 'announcement',
        lazy: () => import('./lazy').then((a) => a.AnnouncementRoute),
      },
      {
        id: 'admin/global/toplist',
        path: 'toplist',
        lazy: () => import('./lazy').then((a) => a.ToplistRoute),
      },
      {
        id: 'admin/adnavced',
        path: 'advanced',
        lazy: () => import('./lazy').then((a) => a.AdvancedRoute),
      },
      {
        id: 'admin/x/freshman',
        path: 'x/freshman',
        lazy: () => import('./lazy').then((a) => a.xFreshmanRoute),
      },
      {
        id: 'admin/x/anniversary',
        path: 'x/anniversary',
        lazy: () => import('./lazy').then((a) => a.xAnniversaryRoute),
      },
    ],
  },
]

export default adminRoutes
