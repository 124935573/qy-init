import request from '@/utils/request'

// 删除
export function removeItem(params) {
  return request({
    url: '/api/ConfigAttribute/DelConfigPartTypeAttributes',
    method: 'get',
    params
  })
}

// 保存
export function saveItem(data) {
  return request({
    url: '/api/ConfigAttribute/SaveConfigPartTypeAttributes',
    method: 'post',
    data
  })
}
