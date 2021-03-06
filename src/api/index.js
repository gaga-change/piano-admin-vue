import http from './http'
import store from '../store'

/** 更新字典 */
const updateMap = res => {
  store.dispatch('gitMap')
  return res
}

/** 获取所有枚举（简化字段） */
export const enumsTotal = params => http.get('/api/enums/enumsTotal', params)

/** 查询所有用户（老师&学生） */
export const personList = params => http.get('/api/persons', params)
export const personDetail = id => http.get(`/api/persons/${id}`)

/** 老师接口 */
export const teachersAdd = params => http.post(`/api/teachers`, params)
export const teachersModify = (id, params) => http.put(`/api/teachers/${id}`, params)
export const teachersDetail = id => http.get(`/api/teachers/${id}`)
export const teachersList = params => http.get(`/api/teachers`, params)

/** 课程接口 */
export const coursesAdd = params => http.post(`/api/courses`, params)
export const coursesModify = (id, params) => http.put(`/api/courses/${id}`, params)
export const coursesDetail = id => http.get(`/api/courses/${id}`)
export const coursesList = params => http.get(`/api/courses`, params)
/** 获取周期内的课程 */
export const coursesActivateArea = params => http.get(`/api/courses/coursesActivateArea`, params)
/** 获取某个某天的所有课程 */
export const coursesFindByPersonAndDay = params => http.get(`/api/courses/findByPersonAndDay`, params)
/** 查询某人某个月的所有课程 */
export const coursesFindByPersonAndMonth = params => http.get(`/api/courses/findByPersonAndMonth`, params)

/** 学生接口 */
export const studentsAdd = params => http.post(`/api/students`, params)
export const studentsModify = (id, params) => http.put(`/api/students/${id}`, params)
export const studentsDetail = id => http.get(`/api/students/${id}`)
export const studentsList = params => http.get(`/api/students`, params)

/** 抢课单接口 */
export const takeCoursesAdd = params => http.post(`/api/takeCourses`, params)
// export const takeCoursesDel = id => http.delete(`/api/takeCourses/${id}`)
export const takeCoursesModify = (id, params) => http.put(`/api/takeCourses/${id}`, params)
// export const takeCoursesDetail = id => http.get(`/api/takeCourses/${id}`)
export const takeCoursesList = params => http.get(`/api/takeCourses`, params)

/** 订单接口 */
export const ordersAdd = params => http.post(`/api/orders`, params)
export const ordersModify = (id, params) => http.put(`/api/orders/${id}`, params)
export const ordersDetail = id => http.get(`/api/orders/${id}`)
export const ordersList = params => http.get(`/api/orders`, params)
export const findByStudentAndNoComplete = params => http.get(`/api/orders/findByStudentAndNoComplete`, params)

/** 商品接口 */
export const productsAdd = params => http.post(`/api/products`, params).then(updateMap)
export const productsModify = (id, params) => http.put(`/api/products/${id}`, params).then(updateMap)
export const productsDetail = id => http.get(`/api/products/${id}`)
export const productsList = params => http.get(`/api/products`, params)

/** 工资规则接口 */
export const bonusRulesAdd = params => http.post(`/api/bonusRules`, params)
export const bonusRulesModify = (id, params) => http.put(`/api/bonusRules/${id}`, params)
export const bonusRulesDetail = id => http.get(`/api/bonusRules/${id}`)
export const bonusRulesList = params => http.get(`/api/bonusRules`, params)

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
export const teacherTypesAdd = params => http.post(`/api/teacherTypes`, params).then(updateMap)
export const teacherTypesModify = (id, params) => http.put(`/api/teacherTypes/${id}`, params).then(updateMap)
export const teacherTypesDetail = id => http.get(`/api/teacherTypes/${id}`)
export const teacherTypesList = params => http.get(`/api/teacherTypes`, params)

/** 课时长 */
export const classTimesAdd = params => http.post(`/api/classTimes`, params).then(updateMap)
export const classTimesModify = (id, params) => http.put(`/api/classTimes/${id}`, params).then(updateMap)
export const classTimesDetail = id => http.get(`/api/classTimes/${id}`)
export const classTimesList = params => http.get(`/api/classTimes`, params)

/** 课类别 */
export const classTypesAdd = params => http.post(`/api/classTypes`, params).then(updateMap)
export const classTypesModify = (id, params) => http.put(`/api/classTypes/${id}`, params).then(updateMap)
export const classTypesDetail = id => http.get(`/api/classTypes/${id}`)
export const classTypesList = params => http.get(`/api/classTypes`, params)

/** 获取待审核人数 */
export const dashboardReadyDataNum = params => http.get(`/api/dashboard/readyDataNum`, params)

/** 分享日志列表 */
export const sharesList = params => http.get(`/api/shares`, params)

/** 登录 */
export const userlogin = params => http.post(`/api/auth/login`, params)
/** 退出登录 */
export const logout = () => http.get(`/api/auth/logout`)
/** 获取用户信息 */
export const getInfo = () => http.get(`/api/auth/account`)
/** 微信标签同步 */
export const wxTeacherTagsSync = () => http.get(`/api/wx/teacher/tagsSync`)
/** 微信标签同步 */
export const wxStudentTagsSync = () => http.get(`/api/wx/student/tagsSync`)
