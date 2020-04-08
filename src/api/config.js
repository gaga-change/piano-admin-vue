import http from './http'
import http2 from './http2'


/** 枚举接口 */
export const enumsList = params => http.get(`/api/enums`, { params })
export const enumsAdd = params => http.post(`/api/enums`, params)
export const enumsDetail = id => http.get(`/api/enums/${id}`)
export const enumsDel = id => http.delete(`/api/enums/${id}`)
export const enumsModify = (id, params) => http.put(`/api/enums/${id}`, params)
/** 获取所有枚举（简化字段） */
export const enumsTotal = params => http2.get('/api/enums.json', { params })