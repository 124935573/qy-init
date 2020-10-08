import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'

import '@/styles/element-variables.scss'

import App from './App'
import store from './store'
import router from './router'
import qupComponent from 'qup-component'
import defaultSettings from '@/settings'
import { Message } from 'element-ui'
import { openPage } from '@/utils/index'
import inputDirectives from '@/directives/inputfilter' // 全局输入框指令

import '@/permission' // permission control
import 'babel-polyfill'

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
import { mockXHR } from '../mock'
if (process.env.NODE_ENV === 'production') {
  mockXHR()
}

Vue.prototype.defaultSettings = defaultSettings
Vue.prototype.isProduction = defaultSettings.isProduction
Vue.prototype.singleJudge = (array, warnTxt, single = false) => {
  if (array.length < 1) {
    Message.warning(`请选择【${warnTxt}】项`)
    return false
  }
  if (single && array.length > 1) {
    Message.warning(`该操作仅可单选`)
    return false
  }
  return true
}
Vue.prototype.openPage = openPage
// 刷新token
Vue.prototype.refreshToken = (extraData = {}, callBack) => {
  if (callBack) {
    const url = location.pathname
    extraData = { ...extraData, ...{ url }}
  }
  window.parent.postMessage({
    flag: 'refreshToken',
    extraData
  }, '*')
  window.resetToken = () => {
    callBack && callBack()
  }
}

Vue.use(ElementUI)
Vue.use(qupComponent)
Vue.use(inputDirectives) // 过滤输入字符

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
