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
    ],
  },
]

export default adminRoutes
