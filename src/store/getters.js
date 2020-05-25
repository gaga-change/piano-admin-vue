const _import = require('@/router/_import_' + process.env.NODE_ENV)
import Layout from '@/views/layout/Layout'
import { reportCenterUrl } from '@/utils'
import { deepExistMenu } from '@/utils/deepSortMenu'

import { asyncRouterMap } from '@/router'

const getters = {
  sidebar: state => state.app.sidebar,
  userInfo: state => state.user.userInfo,
  chooseWarehouse: state => state.user.chooseWarehouse || sessionStorage.getItem('warehouse'),
  warehouseMap: state => state.user.warehouseMap,
  visitedViews: state => state.tagsView.visitedViews,
  mapConfig: state => state.map.mapConfig,
  arrivalBill: state => state.tempData.arrivalBill,
  menu: state => {
    // let bakmenus = state.user.userInfo && state.user.userInfo.menus && state.user.userInfo.menus || []
    // let bakmenu = deepExistMenu(bakmenus, asyncRouterMap)
    // const menutemp = []
    // bakmenu.forEach(item => {
    //   const subchildren = []
    //   if (item.children && item.children.length) {
    //     item.children.forEach(subitem => {
    //       subchildren.push({
    //         path: subitem.path,
    //         component: subitem.component ? _import(subitem.component) : null,
    //         name: subitem.code,
    //         meta: JSON.parse(subitem.meta),
    //         outLinkUrl: subitem.outLinkUrl ? reportCenterUrl(subitem.outLinkUrl) : '',
    //         hidden: subitem.hidden === 'true'
    //       })
    //     })
    //   }
    //   menutemp.push({
    //     path: item.path,
    //     component: item.component === 'Layout' ? Layout : null,
    //     redirect: item.redirect,
    //     name: item.code,
    //     outLinkUrl: item.outLinkUrl ? reportCenterUrl(item.outLinkUrl) : '',
    //     hidden: item.hidden === 'true',
    //     alwaysShow: item.alwaysShow,
    //     meta: JSON.parse(item.meta),
    //     children: subchildren
    //   })
    // })
    // menutemp.push({
    //   path: '*', redirect: '/404', hidden: true
    // })
    return []
  },
  totalmenu: state => {
    let bakmenus = state.user.userInfo && state.user.userInfo.menus && state.user.userInfo.menus || []
    let totalmenu = deepExistMenu(bakmenus, asyncRouterMap)
    const nameArray = []
    if (!totalmenu) {
      return []
    }
    function getnameArray(totalmenu) {
      totalmenu.map(item => {
        if (item.children && item.children.length > 0) {
          getnameArray(item.children)
        } else {
          nameArray.push(item.name)
        }
      })
    }
    getnameArray(totalmenu)
    return nameArray
  },
}
export default getters
