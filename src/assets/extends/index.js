import { hasPermission } from './haspermission'

const EXTENDS = {}
EXTENDS.install = Vue => {
  // 判断是否具有操作权限
  Vue.prototype.$haspermission = hasPermission
}

export { EXTENDS }
