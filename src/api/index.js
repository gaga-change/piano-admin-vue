import http from './http'

/** 商品列表 */
export const commodityCreate = params => http.post(`/api/commodity`, params)
export const commodityDel = id => http.delete(`/api/commodity/${id}`)
export const commodityModify = (id, params) => http.put(`/api/commodity/${id}`, params)
export const commodityDetail = id => http.get(`/api/commodity/${id}`)
export const commodityList = params => http.get(`/api/commodity`, params)


/** 枚举接口 */
export const enumsAdd = params => http.post(`/api/enums`, params)
export const enumsDel = id => http.delete(`/api/enums/${id}`)
export const enumsModify = (id, params) => http.put(`/api/enums/${id}`, params)
export const enumsDetail = id => http.get(`/api/enums/${id}`)
export const enumsList = params => http.get(`/api/enums`, params)
/** 获取所有枚举（简化字段） */
export const enumsTotal = params => http.get('/api/enumsTotal', params)

/** 登录 */
export const userlogin = params => http.post(`/api/auth/login`, params)
/** 退出登录 */
export const logout = () => http.post(`/api/auth/logout`)
/** 获取用户信息 */
export const getInfo = () => http.get(`/api/auth/account`)