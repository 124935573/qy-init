
import request from '@/utils/request'
import { json2FormData } from '@/utils'

/**
 * 查询当前用户可使用的按钮权限
 * @param {string} menuCode 菜单编码
 * @param {string} btnGroupCode 按钮组编码
 */
export function queryBtnList(menuCode, btnGroupCode) {
  return request({
    url: `/ucenter/api/v2/button/currentUser?menuCode=${menuCode}&buttonGroupCode=${btnGroupCode}`,
    method: 'get'
  })
}
