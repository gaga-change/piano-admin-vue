const _import = require('../_import_' + process.env.NODE_ENV)
/* Layout */
import Layout from '../../views/layout/Layout'

export default [
  {
    path: '/commodity',
    component: Layout,
    redirect: 'commodity/commodityList',
    meta: { title: '商品管理', noCache: true, icon: 'deliver' },
    hidden: false,
    children: [
      {
        name: 'commodityList',
        path: 'commodityList',
        meta: { title: '商品列表', noCache: true },
        component: _import('commodity/commodityList'),
        hidden: false,
      },
    ]
  },
  {
    path: '/configManage',
    component: Layout,
    redirect: 'enumList',
    meta: { title: '系统配置中心', noCache: true, icon: 'info' },
    hidden: false,
    children: [
      {
        name: 'enumList',
        path: 'enumList',
        meta: { title: '枚举配置', noCache: true },
        component: _import('configManage/enumList'),
        hidden: false,
      }
    ]
  },
]
