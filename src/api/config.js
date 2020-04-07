import http from './http'
import http2 from './http2'


/** 枚举接口 */
export const enumsList = params => http.get(`/gaga/api/enums`, { params })
export const enumsAdd = params => http.post(`/gaga/api/enums`, params)
export const enumsDetail = id => http.get(`/gaga/api/enums/${id}`)
export const enumsDel = id => http.delete(`/gaga/api/enums/${id}`)
export const enumsModify = (id, params) => http.put(`/gaga/api/enums/${id}`, params)
/** 获取所有枚举（简化字段） */
export const enumsTotal = params => http2.get('/gaga/api/enums.json', { params })