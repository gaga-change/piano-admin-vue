const _import = require('../_import_' + process.env.NODE_ENV)
/* Layout */
import Layout from '../../views/layout/Layout'

export default [
  {
    path: '/teacher',
    component: Layout,
    redirect: 'teacherList',
    meta: { title: '教师管理', noCache: true, icon: 'deliver' },
    hidden: false,
    children: [
      {
        name: 'teacherList',
        path: 'teacherList',
        meta: { title: '教师列表', noCache: true },
        component: _import('teacher/teacherList'),
        hidden: false,
      },
    ]
  },
  {
    path: '/student',
    component: Layout,
    redirect: 'studentList',
    meta: { title: '学生管理', noCache: true, icon: 'deliver' },
    hidden: false,
    children: [
      {
        name: 'studentList',
        path: 'studentList',
        meta: { title: '学生列表', noCache: true },
        component: _import('student/studentList'),
        hidden: false,
      },
    ]
  },
  {
    path: '/course',
    component: Layout,
    redirect: 'courseList',
    meta: { title: '课程管理', noCache: true },
    hidden: false,
    children: [
      {
        name: 'autoCrateCourse',
        path: 'autoCrateCourse',
        meta: { title: '智能建课', noCache: true },
        component: _import('course/autoCrateCourse'),
        hidden: false,
      },
      {
        name: 'courseList',
        path: 'courseList',
        meta: { title: '课程列表', noCache: true },
        component: _import('course/courseList'),
        hidden: false,
      },
      {
        name: 'spaceAreaList',
        path: 'spaceAreaList',
        meta: { title: '空闲时间列表', noCache: true },
        component: _import('spaceArea/spaceAreaList'),
      },

    ]
  },
  {
    path: '/configManage',
    component: Layout,
    redirect: 'enumList',
    meta: { title: '系统配置中心', noCache: true },
    hidden: false,
    children: [
      {
        name: 'enumList',
        path: 'enumList',
        meta: { title: '枚举配置', noCache: true },
        component: _import('configManage/enumList'),
        hidden: false,
      },
      {
        name: 'settingPage',
        path: 'settingPage',
        meta: { title: '系统设置', noCache: true },
        component: _import('setting/settingPage'),
        hidden: false,
      },
    ]
  },
]
