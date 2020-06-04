<template>
  <div
    v-loading="loading"
    class="TeacherTotalCourse"
  >
    <div>
      <item-title>基本信息</item-title>
      <detail-item
        :config="teacherConfig"
        :detail="detail"
        :labelWidth="80"
      />
    </div>
    <br>
    <item-title>课程查询</item-title>
    <!-- 选择月份 -->

    <el-date-picker
      v-model="month"
      type="month"
      placeholder="选择月"
      @change="handleMonthChange"
    >
    </el-date-picker>

    <!-- 展示所有课程 -->
    <!-- 显示个人每个状态的次数 -->
    <!-- 显示课程数量、课时量 -->
    <div class="f12 coursesDetailItmes mb5 mt20">
      <span>总课时： {{courseTimetotal.totoalTime}}分钟</span>
      <span>完成课时： {{courseTimetotal.passTime}}分钟</span>
      <span>课数： {{courses.length}}</span>
      <span
        v-for="item in statusNum"
        :key="'statusNum' + item.value"
      >
        {{item.name}} : {{item.num || 0}}
      </span>
      <span
        v-for="item in courseStatusNum"
        :key="'courseStatusNum' + item.value"
      >
        {{item.name}} : {{item.num || 0}}
      </span>
    </div>
    <div class="f12 coursesDetailItmes mb5 mt5">
      <span>基本工资： {{basePrice}} 元</span>
      <span>奖金： {{bonusPrice}} 元</span>
      <span>总工资: {{totalPrice}} 元</span>
    </div>
    <base-table
      :data="courses"
      :config="tableConfig"
    ></base-table>
  </div>
</template>
<script>
import { coursesFindByPersonAndMonth, teachersDetail, coursesList, bonusRulesList } from '@/api';
import { mapGetters } from 'vuex'

const teacherConfig = [
  { label: "姓名", prop: "name", width: 120 },
  { label: "手机号码", prop: "phone" },
  { label: "学校", prop: "school" },
  { label: "专业", prop: "major" },
  { label: "类型", prop: "type.name" },
  { label: "状态", prop: "status", type: "enum", enum: "personStatusMap" },
  { label: "创建时间", prop: "createdAt", type: "time", width: 140 },
  { label: "修改时间", prop: "updatedAt", type: "time", width: 140 },
  { label: "备注", prop: "remark" }
];

const tableConfig = [
  { label: "日期", prop: "startTime", type: 'time', format: 'YYYY-MM-DD', width: 100 },
  { label: "开始时间", prop: "startTime", type: 'time', format: 'HH:mm' },
  { label: "结束时间", prop: "endTime", type: 'time', format: 'HH:mm' },
  { label: "教师", prop: "teacher.name" },
  { label: "学生", prop: "student.name" },
  { label: "老师状态", prop: "teacherStatus", type: "enum", enum: "coursePersonStatusMap" },
  { label: "学生状态", prop: "studentStatus", type: "enum", enum: "coursePersonStatusMap" },
  { label: "状态", prop: "status", type: "enum", enum: "courseStatusMap" },
  { label: "课类别", prop: "classType.name" },
  { label: "课时长", prop: "classTime.name" },
  { label: "创建时间", prop: "createdAt", type: "time", width: 140 },
  { label: "修改时间", prop: "updatedAt", type: "time", width: 140 },
  { label: "备注", prop: "remark" }
]

export default {
  name: "teacherTotalCourse",
  data() {
    return {
      coursesDetailConfig: [],
      tableConfig,
      teacherConfig,
      loading: false,
      id: this.$route.query.id,
      month: new Date(),
      detail: {},
      courses: [],
      bonusList: [],
      priceRuleConfig: null
    }
  },
  computed: {
    ...mapGetters([
      'mapConfig',
    ]),
    // 个人各状态的数量
    statusNum() {
      const map = this.$copy(this.mapConfig['coursePersonStatusMap']) || []
      this.courses.forEach(course => {
        const item = map.find(v => v.value === course.teacherStatus)
        if (item) {
          item.num = item.num || 0
          item.num++
        }
      })
      return map
    },
    // 课程各状态的数量
    courseStatusNum() {
      const map = this.$copy(this.mapConfig['courseStatusMap']) || []
      // {name, value}
      this.courses.forEach(course => {
        const item = map.find(v => v.value === course.status)
        if (item) {
          item.num = item.num || 0
          item.num++
        }
      })
      return map
    },
    // 课时
    courseTimetotal() {
      const res = { totoalTime: 0, passTime: 0 }
      this.courses.forEach((item) => {
        if (item.status === 1) {
          res.passTime += item.classTime.time
        }
        res.totoalTime += item.classTime.time
      })
      return res
    },
    // 基本工资
    basePrice() {
      if (this.priceRuleConfig && this.detail.type) {
        return this.courses.reduce((price, item) => {
          item.status === 1 && (price += this.priceRuleConfig[this.detail.type._id][item.classTime._id])
          return price
        }, 0)
      } else {
        return 0
      }
    },
    // 奖金
    bonusPrice() {
      if (this.courses) {
        const num = Math.floor(this.courseTimetotal.passTime / 50)
        let price = 0
        if (num >= 100) {
          price = 1100
        } else if (num >= 80) {
          price = 800
        } else if (num >= 50) {
          price = 500
        } else if (num >= 20) {
          price = 200
        }
        price += this.courses.filter(v => v.studentStatus === 4).length * 7 // 学生旷课加7元
        return price
      } else {
        return 0
      }
    },
    totalPrice() {
      return this.bonusPrice + this.basePrice
    }
  },
  created() {
    this.getCourseByMonth()
    this.personDetail()
    this.initBonusRule()
  },
  methods: {
    /** 获取规则 */
    initBonusRule() {
      const priceRuleConfig = {}
      bonusRulesList({ pageSize: 999, pageNum: 1 }).then(res => {
        if (!res) return
        this.bonusList = res.list
        res.list.forEach(item => {
          if (item.teacherType && item.classTime) {
            priceRuleConfig[item.teacherType._id] = priceRuleConfig[item.teacherType._id] || {}
            priceRuleConfig[item.teacherType._id][item.classTime._id] = item.price
          }
        })
        this.priceRuleConfig = priceRuleConfig
      })
    },
    /** 月份选择改变 */
    handleMonthChange() {
      this.getCourseByMonth()
    },
    getCourseByMonth() {
      this.loading = true
      coursesFindByPersonAndMonth({ person: this.id, month: this.month }).then(res => {
        this.loading = false
        if (!res) return
        this.courses = res
      })
    },
    /** 获取教师个人信息 */
    personDetail() {
      teachersDetail(this.id).then(res => {
        if (!res) return
        this.detail = res
      })
    }
  },
  activated() {
    if (!this.$store.state.tagsView.isNew) {
      this.getCourseByMonth()
      this.personDetail()
      this.initBonusRule()
    }
  },
}
</script>

<style lang="scss">
.TeacherTotalCourse {
  .coursesDetailItmes {
    span {
      margin-right: 15px;
    }
  }
}
</style>