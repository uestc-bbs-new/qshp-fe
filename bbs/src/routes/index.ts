import React from 'react'

import Home from '@/pages/Home'
import Search from '@/pages/Search'
import Edit from '@/pages/Edit'
import Forum from '@/pages/Forum'
import Thread from '@/pages/Thread'
// import NotFound from '@/pages/ErrorPage'

const routes = [
  {
    path: '/',
    name: '首页',
    component: Home,
  },
  {
    path: '/search',
    name: '搜索',
    component: Search,
  },
  {
    path: '/edit',
    name: '编辑',
    component: Edit,
  },
  //   // {
  //   //   path: "/article",
  //   //   component: Article,
  //   // },
  {
    path: '/forum/:fid',
    name: '论坛',
    component: Forum,
  },
  {
    path: '/thread/:tid',
    name: '帖子',
    component: Thread,
  },
  //   {
  //     path: '*',
  //     component: NotFound,
  //   },
]

export default routes
