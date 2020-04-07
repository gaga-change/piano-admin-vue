import Vue from 'vue'
import Router from 'vue-router'
import luos_router from './localRouter/luos_router'

const _import = require('./_import_' + process.env.NODE_ENV)
Vue.use(Router)

import Layout from '../views/layout/Layout'


export const constantRouterMap = [
  { path: '/login', component: () => import('../views/login/index'), hidden: true },
  // { path: '/login', redirect: '/csj_login', hidden: true },
  { path: '/404', component: _import('404'), hidden: true },
  { path: '/401', component: _import('401'), hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: 'dashboard',
    hidden: true,
    children: [
      {
        name: 'dashboard',
        path: '/dashboard',
        meta: { title: '主页', noCache: true },
        component: _import('dashboard/index')
      }
    ]
  },
  ...luos_router
]

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  ...luos_router,
  { path: '*', redirect: '/404', hidden: true }
]

