<template>
  <div class="AutoCrateCourse">
    <el-form
      :inline="false"
      :model="formData"
      :rules="rules"
      label-width="100px"
      ref="form"
    >
      <el-form-item label="排课对象">
        <el-radio-group
          v-model="chooseTeacherOrStudent"
          @change="handleChooseTeacherOrStudentChange"
        >
          <el-radio :label="1">老师排课</el-radio>
          <el-radio :label="2">学生排课</el-radio>
        </el-radio-group>
      </el-form-item>
      <template>
        <template v-if="chooseTeacherOrStudent === 1">
          <el-form-item
            label="老师"
            prop="teacher"
          >
            <el-select
              style="width: 200px"
              @change="baseChange"
              v-model="formData.teacher"
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="teacherConfig.remoteMethod"
              :loading="teacherConfig.loading"
            >
              <el-option
                v-for="item in teacherConfig.list"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item
            label="学生"
            prop="student"
          >
            <el-select
              style="width: 200px"
              v-model="formData.student"
              @change="baseChange"
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="studentConfig.remoteMethod"
              :loading="studentConfig.loading"
            >
              <el-option
                v-for="item in studentConfig.list"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </template>
      </template>
      <el-form-item
        label="选择日期"
        prop="date"
      >
        <!-- <el-calendar :range="['2019-03-04', '2019-03-24']"> -->
        <el-date-picker
          @change="baseChange"
          style="width: 200px"
          v-model="formData.date"
          type="date"
          placeholder="选择日期"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item
        label="时间区间"
        prop="spaceArea"
        v-loading="spaceAreasListLoading"
        v-if="spaceAreas"
      >
        <el-radio-group
          v-model="formData.spaceArea"
          @change="handelSpaceAreaChange"
        >
          <el-radio
            v-for="item in spaceAreas"
            :key="item._id"
            :label="item._id"
          >{{`${item.startTimeString}-${item.endTimeString}`}}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="选择时段"
        v-loading="matchSpaceAreasLoading"
        v-if="matchSpaceAreas"
        prop="checkArea"
      >
        <el-radio-group
          v-model="formData.checkArea"
          @change="handleCheckAreaChange"
        >
          <el-radio
            :label="item._id"
            v-for="item in matchSpaceAreas"
            :key="item._id"
          >{{item.areaString[0]}} - {{item.areaString[1]}}（{{item.minute}}分钟），{{item.person.kind === 'teacher' ?
            `教师：${item.person.name}` : `学生：${item.person.name}`}}
          </el-radio>
        </el-radio-group>
        <span v-if="matchSpaceAreas.length === 0">没有可以匹配的人</span>
      </el-form-item>
      <el-form-item
        label="课类别"
        prop="classType"
      >
        <el-radio-group v-model="formData.classType">
          <el-radio
            :label="item.value"
            v-for="item in (mapConfig.classType || [])"
            :key="item._id"
          >
            {{item.name}}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="课时长"
        v-if="classTimeEnum"
        prop="classTime"
      >
        <el-radio-group
          v-model="formData.classTime"
          @change="handleClassTimeChange"
        >
          <el-radio
            :label="item.value"
            v-for="item in classTimeEnum"
            :key="item._id"
          >
            {{item.name}}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="课程开始时间"
        v-if="startTimeRange"
        prop="sourceStartTime"
      >
        <el-time-picker
          v-model="formData.sourceStartTime"
          format="HH:mm"
          :picker-options="{selectableRange: startTimeRange}"
          placeholder="时间点"
        >
        </el-time-picker>
      </el-form-item>
      <el-form-item
        label="订单"
        prop="order"
        v-if="checkStudent"
      >
        <el-select
          style="width: 200px"
          v-model="formData.order"
          clearable
          placeholder="请选择"
          v-loading="orderListLoading"
        >
          <el-option
            v-for="item in orderList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          @click="submit"
          type="primary"
        >提交
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {
    coursesAdd,
    teachersList,
    studentsList,
    getSelfSpaceAreaInSpaceRule,
    getSpaceArea,
    findByStudentAndNoComplete
  } from "@/api";

  export default {
    name: "autoCrateCourse",
    data() {
      const teacherConfig = {}
      const studentConfig = {}
      teacherConfig.loading = false
      teacherConfig.remoteMethod = (query) => {
        this.teacherConfig.loading = true
        teachersList({name: query}).then(res => {
          this.teacherConfig.loading = false
          if (!res) return
          this.teacherConfig.list = res.list.map(v => ({
            label: v.name,
            value: v._id
          }))
        })
      }
      studentConfig.list = []
      studentConfig.loading = false
      studentConfig.remoteMethod = (query) => {
        this.studentConfig.loading = true
        studentsList({name: query}).then(res => {
          this.studentConfig.loading = false
          if (!res) return
          this.studentConfig.list = res.list.map(v => ({
            label: v.name,
            value: v._id
          }))
        })
      }
      return {
        studentConfig,
        teacherConfig,
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < (Date.now() - 24 * 60 * 60 * 1000) || time.getTime() > (Date.now() + 7 * 24 * 60 * 60 * 1000);
          }
        },
        chooseTeacherOrStudent: 1,
        spaceAreasListLoading: false,
        matchSpaceAreasLoading: false,
        coursesAddLoading: false,
        spaceAreas: null, // 目标对象空闲时间（单人）
        matchSpaceAreas: null, // 匹配对象空闲时间（多人）
        matchSpaceArea: null, // 匹配的空闲时间对象
        orderList: [], // 订单列表
        orderListLoading: false,
        formData: {
          teacher: undefined,
          student: undefined,
          date: undefined,
          spaceArea: undefined,
          checkArea: undefined,
          classType: undefined, // 课类别
          classTime: undefined, // 课时长
          sourceStartTime: undefined, // 课开始时间
          order: undefined, // 订单
        },
        rules: {
          teacher: [{required: true, message: '必填项', trigger: 'blur'}],
          student: [{required: true, message: '必填项', trigger: 'blur'}],
          date: [{required: true, message: '必填项', trigger: 'blur'}],
          spaceArea: [{required: true, message: '必填项', trigger: 'blur'}],
          checkArea: [{required: true, message: '必填项', trigger: 'blur'}],
          classType: [{required: true, message: '必填项', trigger: 'blur'}],
          classTime: [{required: true, message: '必填项', trigger: 'blur'}],
          sourceStartTime: [{required: true, message: '必填项', trigger: 'blur'}],
        }
      }
    },
    computed: {
      mapConfig() {
        return this.$store.state.map.mapConfig
      },
      classTimeEnum() {
        let minute = this.matchSpaceArea && this.matchSpaceArea.minute
        if (!minute) return null
        return (this.mapConfig.classTime || []).filter(v => {
          return v.time <= (minute || 0)
        })
      },
      startTimeRange() {
        if (!this.formData.classTime) return ''
        if (!this.matchSpaceArea) return ''
        const timeLang = this.mapConfig['classTime'].find(v => v.value === this.formData.classTime).time
        return `${this.$moment(this.matchSpaceArea.area[0]).format('HH:mm:ss')} - ${this.$moment(this.matchSpaceArea.area[1].getTime() - timeLang * 60 * 1000).format('HH:mm:ss')}`
      },
      checkStudent() {
        if (this.chooseTeacherOrStudent === 1) {
          if (this.matchSpaceArea && this.matchSpaceArea.person) {
            return this.matchSpaceArea.person._id
          }
        } else {
          return this.formData.student
        }
        return null
      }
    },
    watch: {
      checkStudent(val) {
        if (val) {
          this.initOrderList()
        } else {
          this.orderList = []
        }
      }
    },
    created() {
      this.studentConfig.remoteMethod()
      this.teacherConfig.remoteMethod()
    },
    methods: {
      initOrderList() {
        this.orderListLoading = true
        findByStudentAndNoComplete({student: this.checkStudent}).then(res => {
          this.orderListLoading = false
          if (!res) return
          this.orderList = res.map(v => ({
            label: v.product && v.product.name,
            value: v._id
          }))
        })
      },
      submit() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            const params = this.$copy(this.formData)
            if (this.chooseTeacherOrStudent === 1) {
              params.student = this.matchSpaceArea.person._id
            } else {
              params.teacher = this.matchSpaceArea.person._id
            }
            if (!params.order) {
              delete params.order
            }
            params.startTime = params.sourceStartTime
            const timeLang = this.mapConfig['classTime'].find(v => v.value === params.classTime).time
            params.endTime = new Date(params.sourceStartTime.getTime() + timeLang * 60 * 1000)
            params.status = 0
            this.coursesAddLoading = true
            coursesAdd(params).then(res => {
              this.coursesAddLoading = false
              if (!res) return
              this.$message.success('创建成功！')
              this.baseChange()
            })
          }
        })
      },
      /** 排课对象类型修改 */
      handleChooseTeacherOrStudentChange() {
        // 重置另个对象
        this.baseChange()
      },
      /** 排课对象&日期修改  */
      baseChange() {
        let bool = false
        let params = {}
        if (this.chooseTeacherOrStudent === 1) { // 老师
          bool = !!this.formData.teacher
          params.person = this.formData.teacher
        } else { // 学生
          bool = !!this.formData.student
          params.person = this.formData.student
        }
        if (bool && this.formData.date) {
          let date = new Date(this.formData.date)
          date.setHours(0, 0, 0, 0)
          this.spaceAreasListLoading = true
          params.date = date
          getSelfSpaceAreaInSpaceRule(params).then(res => {
            this.spaceAreasListLoading = false
            if (!res) return
            this.spaceAreas = res.map((v, index) => {
              v._id = `${index}_${Date.now()}_${Math.random()}`
              v.startTimeString = this.$moment(v.startTime).format("HH:mm")
              v.endTimeString = this.$moment(v.endTime).format("HH:mm")
              return v
            })
            this.handelSpaceAreaChange()
          })
        } else {
          this.spaceAreas = null
          this.handelSpaceAreaChange()
        }
      },
      /** 当事人 空闲区间选择 */
      handelSpaceAreaChange(id) {
        if (!id) {
          this.formData.spaceArea = undefined
          this.matchSpaceAreas = null
          this.handleCheckAreaChange()
          return
        }
        let params = {}
        if (this.chooseTeacherOrStudent === 1) { // 老师
          params.person = this.formData.teacher
        } else { // 学生
          params.person = this.formData.student
        }
        let item = this.spaceAreas.find(v => v._id === id)
        params.startTime = item.startTime
        params.endTime = item.endTime
        this.matchSpaceAreasLoading = true
        getSpaceArea(params).then(res => {
          this.matchSpaceAreasLoading = false
          if (!res) return
          this.matchSpaceAreas = res.map((v, index) => {
            v._id = `${index}_${Date.now()}_${Math.random()}`
            // 获取交叉时间段 以及 时长
            v.area = [new Date(v.startTime), new Date(v.endTime)]
            const area = v.area
            v.areaString = [this.$moment(area[0]).format('HH:mm'), this.$moment(area[1]).format('HH:mm')]
            v.minute = (area[1].getTime() - area[0].getTime()) / 1000 / 60//单位分钟
            return v
          })
        })
        this.handleCheckAreaChange()
      },
      /** 选择匹配的人 以及时间范围 */
      handleCheckAreaChange(id) {
        if (!id) {
          this.formData.checkArea = undefined
          this.matchSpaceArea = null
        } else {
          this.matchSpaceArea = this.matchSpaceAreas.find(v => v._id === id)
        }
        this.handleClassTimeChange()
      },
      /** 课时长修改 */
      handleClassTimeChange(id) {
        if (!id) {
          this.formData.sourceStartTime = undefined
          this.formData.classTime = undefined
          return
        }
        this.formData.sourceStartTime = this.matchSpaceArea.area[0]
      },
      /** 格式化显示课程时间 */
      formatTooltip(val) {
        let h = Math.floor(val / 60)
        let m = val % 60
        if (val === 24 * 60) {
          return '00:00'
        }
        return `${this.$doubleNum(h)}:${this.$doubleNum(m)}`;
      },

    },
    activated() {
      if (!this.$store.state.tagsView.isNew) {
        this.baseChange()
        this.formData.classType = undefined
        if (this.checkStudent) {
          this.initOrderList()
        }
      }
    },
  }
</script>

<style lang="scss">
  // .AutoCrateCourse {
  // }
</style>
