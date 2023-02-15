import React from 'react'

const Home = React.lazy(() => import('@/pages/Home'))
const Search = React.lazy(() => import('@/pages/Search'))
const Edit = React.lazy(() => import('@/pages/Edit'))
const Forum = React.lazy(() => import('@/pages/Forum'))
const Thread = React.lazy(() => import('@/pages/Thread'))
// import NotFound from '@/pages/ErrorPage'

const routes = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/search',
    component: Search,
  },
  {
    path: '/home',
    component: Home,
  },
  {
    path: '/edit',
    component: Edit,
  },
  //   // {
  //   //   path: "/article",
  //   //   component: Article,
  //   // },
  {
    path: '/forum/:fid',
    component: Forum,
  },
  {
    path: '/thread/:tid',
    component: Thread,
  },
  //   {
  //     path: '*',
  //     component: NotFound,
  //   },
]

export default routes
