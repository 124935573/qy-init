
import request from '@/utils/request'
/**
 * 根据字典类型查询字典
 * @param {string} dictTypeCode 数据字典编码
 * @param {string} appCode 应用编码
 * @param {string} domainCode 业务域编码
 * */
export function getDictByType({ dictTypeCode, appCode, domainCode }) {
  return request({
    url: `/data-dict/api/v2/dictionary/${dictTypeCode}`,
    method: 'get',
    params: { appCode, domainCode }
  })
}
