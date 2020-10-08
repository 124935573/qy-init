import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/user/userInfo',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

/**
 * 根据关键字(用户名称)模糊查询用户列表
 * @param {string} keyWord 查询关键字
 * */
export function queryUserList(keyWord) {
  return request({
    url: '/api/v1/user/keyWord',
    method: 'get',
    params: { keyWord }
  })
}
