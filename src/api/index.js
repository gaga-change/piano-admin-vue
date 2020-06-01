import http from './http'
import store from '../store'

/** 枚举接口 */
export const enumsAdd = params => http.post(`/api/enums`, params)
export const enumsDel = id => http.delete(`/api/enums/${id}`)
export const enumsModify = (id, params) => http.put(`/api/enums/${id}`, params)
export const enumsDetail = id => http.get(`/api/enums/${id}`)
export const enumsList = params => http.get(`/api/enums`, params)
/** 获取所有枚举（简化字段） */
export const enumsTotal = params => http.get('/api/enums/enumsTotal', params)

/** 查询所有用户（老师&学生） */
export const personList = params => http.get('/api/persons', params)
export const personDetail = id => http.get(`/api/persons/${id}`)

/** 老师接口 */
export const teachersAdd = params => http.post(`/api/teachers`, params)
export const teachersDel = id => http.delete(`/api/teachers/${id}`)
export const teachersModify = (id, params) => http.put(`/api/teachers/${id}`, params)
export const teachersDetail = id => http.get(`/api/teachers/${id}`)
export const teachersList = params => http.get(`/api/teachers`, params)

/** 课程接口 */
export const coursesAdd = params => http.post(`/api/courses`, params)
export const coursesDel = id => http.delete(`/api/courses/${id}`)
export const coursesModify = (id, params) => http.put(`/api/courses/${id}`, params)
export const coursesDetail = id => http.get(`/api/courses/${id}`)
export const coursesList = params => http.get(`/api/courses`, params)
/** 获取周期内的课程 */
export const coursesActivateArea = params => http.get(`/api/courses/coursesActivateArea`, params)
/** 获取某个某天的所有课程 */
export const coursesFindByPersonAndDay = params => http.get(`/api/courses/findByPersonAndDay`, params)

/** 学生接口 */
export const studentsAdd = params => http.post(`/api/students`, params)
export const studentsDel = id => http.delete(`/api/students/${id}`)
export const studentsModify = (id, params) => http.put(`/api/students/${id}`, params)
export const studentsDetail = id => http.get(`/api/students/${id}`)
export const studentsList = params => http.get(`/api/students`, params)

/** 时间规则接口 */
export const spaceRulesUpdate = params => http.post(`/api/spaceRules/spaceRulesUpdate`, params)
export const spaceRulesList = params => http.get(`/api/spaceRules`, params)
export const getSelfSpaceAreaInSpaceRule = params => http.get(`/api/spaceRules/getSelfSpaceAreaInSpaceRule`, params)
export const getSpaceArea = params => http.get(`/api/spaceRules/getSpaceArea`, params)
/** 时间规则自动清理 */
export const spaceRulesClearNoTeacherOrStudent = params => http.post(`/api/spaceRules/spaceRulesClearNoTeacherOrStudent`, params)

/** 请假接口 */
export const leaveAreasAdd = params => http.post(`/api/leaveAreas`, params)
export const leaveAreasDel = id => http.delete(`/api/leaveAreas/${id}`)
export const leaveAreasModify = (id, params) => http.put(`/api/leaveAreas/${id}`, params)
export const leaveAreasDetail = id => http.get(`/api/leaveAreas/${id}`)
export const leaveAreasList = params => http.get(`/api/leaveAreas`, params)

/** 教师类型 */
export const teacherTypesAdd = params => http.post(`/api/teacherTypes`, params).then(res => {
  store.dispatch('gitMap')
  return res
})
export const teacherTypesModify = (id, params) => http.put(`/api/teacherTypes/${id}`, params).then(res => {
  store.dispatch('gitMap')
  return res
})
export const teacherTypesDetail = id => http.get(`/api/teacherTypes/${id}`)
export const teacherTypesList = params => http.get(`/api/teacherTypes`, params)

/** 课时长 */
export const classTimesAdd = params => http.post(`/api/classTimes`, params).then(res => {
  store.dispatch('gitMap')
  return res
})
export const classTimesModify = (id, params) => http.put(`/api/classTimes/${id}`, params).then(res => {
  store.dispatch('gitMap')
  return res
})
export const classTimesDetail = id => http.get(`/api/classTimes/${id}`)
export const classTimesList = params => http.get(`/api/classTimes`, params)

/** 课类别 */
export const classTypesAdd = params => http.post(`/api/classTypes`, params).then(res => {
  store.dispatch('gitMap')
  return res
})
export const classTypesModify = (id, params) => http.put(`/api/classTypes/${id}`, params).then(res => {
  store.dispatch('gitMap')
  return res
})
export const classTypesDetail = id => http.get(`/api/classTypes/${id}`)
export const classTypesList = params => http.get(`/api/classTypes`, params)

/** 获取待审核人数 */
export const dashboardReadyDataNum = params => http.get(`/api/dashboard/readyDataNum`, params)

/** 分享日志列表 */
export const sharesList = params => http.get(`/api/shares`, params)

/** 登录 */
export const userlogin = params => http.post(`/api/auth/login`, params)
/** 退出登录 */
export const logout = () => http.post(`/api/auth/logout`)
/** 获取用户信息 */
export const getInfo = () => http.get(`/api/auth/account`)
/** 微信标签同步 */
export const wxTeacherTagsSync = () => http.get(`/api/wx/teacher/tagsSync`)
/** 微信标签同步 */
export const wxStudentTagsSync = () => http.get(`/api/wx/student/tagsSync`)