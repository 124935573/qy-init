import axios from 'axios'
import { Message, Loading } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
let loading = null
function startLoading() { // 使用Element loading-start 方法
  loading = Loading.service({
    lock: true,
    text: '查询中……',
    background: 'rgba(0, 0, 0, 0.1)'
  })
}
function endLoading() { // 使用Element loading-close 方法
  loading.close()
}

const excludeApis = ['/data-dict/api', '/ucenter/api'] // 外部api地址

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 18000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (config.showLoading) {
      startLoading()
    }

    excludeApis.forEach(path => {
      if (config.url.indexOf(path) === 0) {
        config.baseURL = ''
      }
    })
    
    // let each request carry token
    config.headers['Authorization'] = `Bearer ${getToken()}`
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    if (loading) {
      endLoading()
    }
    const res = response.data
    const status = Number(response.status) || 200
    const message = res.msg
    if (status === 401 || res.code === 401 || res.code === '401') {
      store.dispatch('user/resetToken').then(() => {
        Message({
          message: message === '' || message === 'error' ? '身份验证错误，请重新登录' : message,
          type: 'error',
          duration: 1500,
          onClose: function() {
            location.reload()
          }
        })
      })
      return
    }
    if (response.config.responseType === 'arraybuffer') {
      return response
    }

    if (status !== 200 || res.success === 0) {
      Message({
        message: message,
        type: 'error'
      })
      return Promise.reject(new Error(message))
    }

    return res
  },
  error => {
    console.log('err', error) // for debug
    if (loading) {
      endLoading()
    }
    if (error.message.indexOf('401') > -1) {
      window.parent.postMessage({
        flag: 'refreshToken',
        extraData: {}
      }, '*')
      return
    }
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
