import http from './http'


// import { applist, deleteApp, latestApp } from '@/api/dictionaryinfo'

/** 配置接口 */
export const applist = params => http.post(`/app/api/appVersion/findPage`, params)
export const newApp = params => http.post(`/app/api/appVersion/createAppVersion`, params)
export const appDetail = id => http.get(`/app/api/appVersion/detail/${id}`)
export const modifyApp = params => http.post(`/app/api/appVersion/editAppVersion`, params)
export const deleteApp = id => http.get(`/app/api/appVersion/delete/${id}`)
export const latestApp = id => http.get(`/app/api/appVersion/updateStatus/${id}`)