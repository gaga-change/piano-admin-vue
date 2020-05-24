import http from './http'

/** 枚举接口 */
export const enumsAdd = params => http.post(`/api/enums`, params)
export const enumsDel = id => http.delete(`/api/enums/${id}`)
export const enumsModify = (id, params) => http.put(`/api/enums/${id}`, params)
export const enumsDetail = id => http.get(`/api/enums/${id}`)
export const enumsList = params => http.get(`/api/enums`, params)
/** 获取所有枚举（简化字段） */
export const enumsTotal = params => http.get('/api/enums/enumsTotal', params)

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