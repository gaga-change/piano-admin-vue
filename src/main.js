import 'normalize.css/normalize.css'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss'
import '@/permission'

import App from './App'
import BarCode from '@/components/BarCode/index'
import BaseForm from '@/components/BaseForm'
import BaseList from '@/components/BaseList'
import BasePrintTable from '@/components/BasePrintTable'
import BaseTable from '@/components/BaseTable'
import DetailItem from '@/components/DetailItem'
import DoubleList from '@/components/DoubleList'
import { EXTENDS } from './assets/extends'
import ElementUI from 'element-ui'
import ItemTitle from '@/components/ItemTitle/index'
import PrintTableDialog from '@/components/PrintTableDialog'
import SearchForm from '@/components/SearchForm'
import Vue from 'vue'
import { cloneDeep } from 'lodash';
import locale from 'element-ui/lib/locale/lang/zh-CN'
import moment from 'moment'
import router from './router'
import store from './store'

const { MessageBox } = ElementUI
Vue.component('BaseTable', BaseTable);
Vue.component('SearchForm', SearchForm);
Vue.component('BaseList', BaseList);
Vue.component('DoubleList', DoubleList);
Vue.component('PrintTableDialog', PrintTableDialog);
Vue.component('BasePrintTable', BasePrintTable);
Vue.component('DetailItem', DetailItem);
Vue.component('BaseForm', BaseForm);
/** 拷贝时分 到另一个时间， 默认 秒和毫秒为0, 不改变目标本身 */
Vue.prototype.$copyHour = (target, date) => {
  date = new Date(date)
  target = new Date(target)
  let hour = date.getHours()
  let min = date.getMinutes()
  target.setHours(hour)
  target.setMinutes(min)
  return target
}
Vue.prototype.$doubleNum = num => num < 10 ? `0${num}` : num
Vue.prototype.$copy = obj => cloneDeep(obj)
Vue.prototype.$moment = moment
Vue.prototype.$apiConfirm = (msg, api) => new Promise((resolve, reject) => {
  MessageBox.confirm(msg || '此操作将永久删除该行, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    beforeClose: (action, instance, done) => {
      if (action === 'confirm') {
        instance.confirmButtonLoading = true
        api().then((res) => {
          setTimeout(() => {
            instance.confirmButtonLoading = false
          }, 300)
          done()
          resolve(res)
        })
      } else {
        done()
      }
    }
  }).then(() => {
  }).catch(() => {
    resolve(null)
  })
})

Vue.filter('date', function (value, format) {
  if (!value) return ''
  return moment(value).format(format || "YYYY-MM-DD HH:mm:ss")
})

// 列表多选按钮 扩大点击有效范围
document.body.addEventListener('click', function (e) {
  let parentNode = e.target.parentNode
  if (e.target.className && ~e.target.className.indexOf('el-table-column--selection')) {
    let label = e.target.children[0].children
    label && label[0] && label[0].click && label[0].click()
  } else if (parentNode.className && ~parentNode.className.indexOf('el-table-column--selection')) {
    let label = parentNode.children[0].children
    label && label[0] && label[0].click && label[0].click()
  }
})

Vue.use(ElementUI, { locale, size: 'mini' })
Vue.use(EXTENDS)
Vue.use(ItemTitle);
Vue.use(BarCode);

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
