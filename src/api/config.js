import http3 from './http3'
import http2 from './http2'


/** 枚举接口 */
export const enumsList = params => http3.get(`/api/enums`, params)
export const enumsAdd = params => http3.post(`/api/enums`, params)
export const enumsDetail = id => http3.get(`/api/enums/${id}`)
export const enumsDel = id => http3.delete(`/api/enums/${id}`)
export const enumsModify = (id, params) => http3.put(`/api/enums/${id}`, params)
/** 获取所有枚举（简化字段） */
export const enumsTotal = params => http2.get('/api/enums.json', { params })