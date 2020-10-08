/**
 * Created by PanJiaChen on 16/11/18.
 */
import router from '../router/index.js'
const { programmeFlag } = require('../settings.js')

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  if (!time) return ''
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if (time.indexOf('T')) {
        time = time.replace('T', ' ')
      }
      if (time.indexOf('Z')) {
        time = time.replace('Z', ' ')
      }
      if (/^[0-9]+$/.test(time)) {
        time = parseInt(time)
      } else {
        time = time.replace(/-/g, '/') // 处理safari与ie兼容
      }
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
  )
}
/**
 * JSON对象转formData
 * @param {Object} JSON对象
  */
export function json2FormData(params) {
  const formData = new FormData()
  Object.keys(params).forEach((key) => {
    formData.append(key, params[key])
  })
  return formData
}

export function createDownload(res, fixedFileName) {
  const data = res
  let fileName
  if (fixedFileName) {
    fileName = `${decodeURIComponent(fixedFileName)}${parseTime(new Date(), '{y}{m}{d}{h}{i}{s}')}.xlsx`
  } else {
    fileName = res.headers['content-disposition']
    fileName = fileName.split(';')[1].split('filename=')[1]
    const fileNameUnicode = res.headers['content-disposition'].split('filename*=')[1]
    if (fileNameUnicode) { // 当存在 filename* 时，取filename* 并进行解码（为了解决中文乱码问题）
      fileName = decodeURIComponent(fileNameUnicode.split("''")[1])
    } else {
      fileName = decodeURIComponent(fileName)
    }
  }

  const blob = new Blob([data])
  if (window.navigator.msSaveOrOpenBlob) {
    navigator.msSaveBlob(blob, fileName)
  } else {
    const link = document.createElement('a')
    link.download = decodeURI(fileName)
    link.href = URL.createObjectURL(blob)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  /* const blob = new Blob([data])
  const link = document.createElement('a')
  const evt = document.createEvent('HTMLEvents')
  evt.initEvent('click', false, false)
  link.href = URL.createObjectURL(blob)
  link.download = decodeURI(fileName)
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  window.URL.revokeObjectURL(link.href) */
}

// 判断所选日期是否大于当前日期
export function judgeDate(tomodifyDate) {
  const selectTime = tomodifyDate + ' 00:00:00'
  return new Date().getTime() - new Date(selectTime).getTime()
}

// 日期年月日格式化
export function formatFullYear(date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year}年${month > 9 ? month : ('0' + month)}月${day > 9 ? day : ('0' + day)}日`
}

/**
 * 判断是否为IE
 */
export function detectIE() {
  var ua = window.navigator.userAgent
  var msie = ua.indexOf('MSIE ')
  if (msie > 0) {
    // IE 10 or older => return version number
    return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10)
  }

  var trident = ua.indexOf('Trident/')
  if (trident > 0) {
    // IE 11 => return version number
    var rv = ua.indexOf('rv:')
    return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10)
  }

  var edge = ua.indexOf('Edge/')
  if (edge > 0) {
    // Edge (IE 12+) => return version number
    return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10)
  }

  // other browser
  return false
}
/*
 *序列化query
 */
export const serialize = data => {
  const list = []
  Object.keys(data).forEach(ele => {
    list.push(`${ele}=${data[ele]}`)
  })
  return list.join('&')
}
/**
*打开新页面，本地开路由，线上开页签
* @param {(string)} path:路径
* @param {(Object)} query:参数
* @param {(string)} pageName:页签名称
* @param {(string)} menuCode:菜单编码
*/
export function openPage(path, query, pageName, menuCode) {
  if (process.env.NODE_ENV === 'development') {
    router.push({
      path: path,
      query
    })
  } else {
    window.parent.postMessage({
      flag: 'addtag',
      extraData: {
        url: programmeFlag + path.substring(1),
        title: pageName,
        query: query ? '&' + serialize(query) : '',
        menuCode: menuCode
      }
    }, '*')
  }
}
