import axios from 'axios'
import {
  Notification,
  Message
} from 'element-ui'

let newAxios = axios.create({
  timeout: 15000 // 请求超时时间
})

// 响应拦截器
newAxios.interceptors.response.use(function (response) {
  let data = response.data
  // 系统异常提示（返回的数据为 null）

  return data
}, function (error) {
  let message = error.response.data
  if (error.message === 'timeout of 1500ms exceeded') {
    Notification({
      title: '错误信息',
      message: '请求超时，请稍后再试！',
      type: 'error',
      duration: 5000,
    })
  } if (error.response.status === 401) {
    Message({
      type: 'error',
      message: message || '登录失效，请重新登录',
      onClose: () => {
        location.href = `/login`
      },
      duration: 1500
    })
  } else {
    Message({
      type: 'error',
      message: message || '系统异常',
      duration: 3000
    })
  }
  return Promise.reject(error)
})


const http = {
  get(url, params) {
    return newAxios.get(url, { params }).then(res => res).catch(err => null)
  },
  post(url, params) {
    return newAxios.post(url, params).then(res => res).catch(err => null)
  },
  delete(url, params) {
    return newAxios.delete(url, { params }).then(res => res).catch(err => null)
  },
  put(url, params) {
    return newAxios.put(url, params).then(res => res).catch(err => null)
  }
}

export default http
