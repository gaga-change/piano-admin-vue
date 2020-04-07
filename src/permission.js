import NProgress from 'nprogress'

import router from './router'
import store from './store'

import 'nprogress/nprogress.css'

const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (whiteList.includes(to.path)) {
    next()
  } else if (store.getters.userInfo == null) {
    store.dispatch('GetInfo').then(res => {
      if (res) {
        store.dispatch('gitMap');
        router.addRoutes(store.getters.menu)
        next({ ...to, replace: true })
      } else {
        store.dispatch('SetWarehouse', '')
        location.href = `/login`
      }
    })
  } else {
    next()
  }

})

router.afterEach((to, from) => {
  NProgress.done()
})
