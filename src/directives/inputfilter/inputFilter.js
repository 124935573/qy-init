/**
 *  实现功能
 *  1、默认情况下只禁止空格输入
 *  2、限制只能输入整数
 *  3、限制只能输入整数和小数（价格类）
 *  4、限制只能输入手机号
 *  5、限制最大值和最小值(抛出错误给回调函数)
 */

import { Message } from 'element-ui'
const showError = (msg) => {
  Message({
    message: msg,
    type: 'error',
    duration: 3 * 1000,
    showClose: true
  })
}

const addListener = function(el, type, fn) {
  // el.addEventListener(type, fn, false)
  el.addEventListener(type, () => {
    fn()
    el.dispatchEvent(new Event('input'))
  }, false)
}
// 默认情况下只禁止空格输入
const spaceFilter = function(el) {
  addListener(el, 'keyup', () => {
    el.value = el.value.replace(/\s+/, '')
  })
}

// 限制只能输入整数
const intFilter = function(el) {
  addListener(el, 'keyup', () => {
    el.value = el.value.replace(/\D/g, '')
  })
}
// 限制只能输入整数和小数（价格类）
const priceFilter = function(el) {
  addListener(el, 'keyup', () => {
    el.value = el.value.replace(/[^\d.]*/g, '')
    if (isNaN(el.value)) {
      el.value = ''
    }
  })
}
// 限制所有特殊字符
const specialFilter = function(el) {
  addListener(el, 'keyup', () => {
    el.value = el.value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, '')
  })
}

// 限制指定特殊字符
const specialCharFilter = function(el) {
  addListener(el, 'keyup', () => {
    el.value = el.value.replace(/[`~!@#$%^&*()\-+=<>?:"{}|,./;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/g, '').replace(/\s/g, '')
  })
}

// 限制只能输入手机号
const phoneFilter = function(el) {
  addListener(el, 'blur', () => {
    if (!el.value) {
      return
    }
    const phoneReg = new RegExp('^(13|14|15|16|17|18|19)[0-9]{9}$')
    if (!phoneReg.test(el.value)) {
      showError('手机号输入错误')
      el.value = ''
    }
  })
}
// 限制输入url
const urlFilter = function(el) {
  addListener(el, 'blur', () => {
    if (!el.value) {
      return
    }
    const urlReg = /(^#)|(^http(s*):\/\/[^\s]+\.[^\s]+)/
    if (!urlReg.test(el.value)) {
      showError('url输入错误')
      el.value = ''
    }
  })
}
export default {
  bind(el, binding) {
    if (el.tagName.toLowerCase() !== 'input' && el.tagName.toLowerCase() !== 'textarea') {
      el = el.getElementsByTagName('input')[0] || el.getElementsByTagName('textarea')[0]
    }
    if (el) {
      spaceFilter(el)
      switch (binding.arg) {
        case 'int':
          intFilter(el)
          break
        case 'price':
          priceFilter(el)
          break
        case 'phone':
          phoneFilter(el)
          break
        case 'url':
          urlFilter(el)
          break
        case 'special':
          specialFilter(el)
          break
        case 'special-char':
          specialCharFilter(el)
          break
        default:
          specialFilter(el)
          break
      }
    }
  }
}
