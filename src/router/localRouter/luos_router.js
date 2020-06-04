const _import = require('../_import_' + process.env.NODE_ENV)
/* Layout */

import Layout from '../../views/layout/Layout'

export default [
  {
    path: '/teacher',
    component: Layout,
    redirect: 'teacherList',
    meta: { title: '教师管理', icon: 'el-icon-setting' },
    hidden: false,
    children: [
      {
        name: 'teacherList',
        path: 'teacherList',
        meta: { title: '教师列表', noCache: false, icon: 'el-icon-user' },
        component: _import('teacher/teacherList'),
        hidden: false,
      },
      {
        name: 'teacherTotalCourse',
        path: 'teacherTotalCourse',
        meta: { title: '教师课程统计', noCache: false },
        component: _import('teacher/teacherTotalCourse'),
        hidden: true,
      },
    ]
  },
  {
    path: '/student',
    component: Layout,
    redirect: 'studentList',
    meta: { title: '学生管理', icon: 'el-icon-setting' },
    hidden: false,
    children: [
      {
        name: 'studentList',
        path: 'studentList',
        meta: { title: '学生列表', noCache: false, icon: 'el-icon-user' },
        component: _import('student/studentList'),
        hidden: false,
      },
    ]
  },
  {
    path: '/course',
    component: Layout,
    redirect: 'courseList',
    meta: { title: '课程管理', icon: 'el-icon-setting' },
    hidden: false,
    children: [
      {
        name: 'autoCrateCourse',
        path: 'autoCrateCourse',
        meta: { title: '智能建课', noCache: false, icon: 'el-icon-edit-outline' },
        component: _import('course/autoCrateCourse'),
        hidden: false,
      },
      {
        name: 'courseList',
        path: 'courseList',
        meta: { title: '课程列表', noCache: false, icon: 'el-icon-document' },
        component: _import('course/courseList'),
        hidden: false,
      },
      {
        name: 'leaveAreaList',
        path: 'leaveAreaList',
        meta: { title: '请假管理', noCache: false, icon: 'el-icon-document' },
        component: _import('leaveArea/leaveAreaList'),
        hidden: false,
      },
    ]
  },
  {
    path: '/share',
    component: Layout,
    redirect: 'shareList',
    meta: { title: '分享管理', icon: 'el-icon-setting' },
    hidden: false,
    children: [
      {
        name: 'shareList',
        path: 'shareList',
        meta: { title: '分享日志', noCache: false, icon: 'el-icon-document' },
        component: _import('share/shareList'),
        hidden: false,
      }
    ]
  },
  {
    path: '/configManage',
    component: Layout,
    redirect: 'teacherTypeList',
    meta: { title: '系统配置中心', icon: 'el-icon-setting' },
    hidden: false,
    children: [
      {
        name: 'teacherTypeList',
        path: 'teacherTypeList',
        meta: { title: '教师类型', noCache: false, icon: 'el-icon-edit' },
        component: _import('dict/teacherType/teacherTypeList'),
        hidden: false,
      },
      {
        name: 'classTimeList',
        path: 'classTimeList',
        meta: { title: '课时长', noCache: false, icon: 'el-icon-edit' },
        component: _import('dict/classTime/classTimeList'),
        hidden: false,
      },
      {
        name: 'classTypeList',
        path: 'classTypeList',
        meta: { title: '课类型', noCache: false, icon: 'el-icon-edit' },
        component: _import('dict/classType/classTypeList'),
        hidden: false,
      },
      {
        name: 'bonusRuleList',
        path: 'bonusRuleList',
        meta: { title: '工资规则', noCache: false, icon: 'el-icon-edit' },
        component: _import('dict/bonusRule/bonusRuleList'),
        hidden: false,
      },
      {
        name: 'settingPage',
        path: 'settingPage',
        meta: { title: '系统设置', noCache: true, icon: 'el-icon-monitor' },
        component: _import('setting/settingPage'),
        hidden: false,
      },
    ]
  },
]
