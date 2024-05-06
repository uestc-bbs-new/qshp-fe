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
    ],
  },
]

export default adminRoutes
