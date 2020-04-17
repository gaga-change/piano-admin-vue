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
        <el-radio-group v-model="chooseTeacherOrStudent">
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
      <el-form-item label="选择日期">
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
      >
        <el-radio-group
          v-model="formData.spaceArea"
          @change="handelSpaceAreaChange"
        >
          <el-radio
            v-for="item in spaceAreas"
            :key="item._id"
            :label="item._id"
          >{{`${item.startTimeString}-${item.endTimeString}`}}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { coursesAdd, teachersList, studentsList, spaceAreasList } from "@/api";

export default {
  data() {
    const teacherConfig = {}
    const studentConfig = {}
    teacherConfig.loading = false
    teacherConfig.remoteMethod = (query) => {
      this.teacherConfig.loading = true
      teachersList({ name: query }).then(res => {
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
      studentsList({ name: query }).then(res => {
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
      spaceAreas: [],
      formData: {
        teacher: undefined,
        student: undefined,
        date: undefined,
        spaceArea: undefined,
      },
      rules: {

      }
    }
  },
  created() {
    this.studentConfig.remoteMethod()
    this.teacherConfig.remoteMethod()
  },
  methods: {
    baseChange(v) {
      console.log(this.$copy(this.formData))
      let bool = false
      let params = {}
      if (this.chooseTeacherOrStudent === 1) { // 老师
        bool = !!this.formData.teacher
        params.teacher = this.formData.teacher
      } else { // 学生
        bool = !!this.formData.student
        params.student = this.formData.student
      }
      if (bool && this.formData.date) {
        console.log('获取空闲时间')
        let date = new Date(this.formData.date)
        date.setHours(0, 0, 0, 0)
        this.spaceAreasListLoading = true
        params.date = date
        spaceAreasList(params).then(res => {
          this.spaceAreasListLoading = false
          if (!res) return
          this.spaceAreas = res.list.map(v => {
            v.startTimeString = this.$moment(v.startTime).format("HH:mm")
            v.endTimeString = this.$moment(v.endTime).format("HH:mm")
            return v
          })
        })
      } else {
        this.spaceAreas = []
      }
    },
    handelSpaceAreaChange(id) {
      let params = {}
      if (this.chooseTeacherOrStudent === 1) {
        params.hasStudent = true
      } else {
        params.hasTeacher = true
      }
      let item = this.spaceAreas.find(v => v._id === id)
      params.startTime = item.startTime
      params.endTime = item.endTime
      console.log(params)
      spaceAreasList(params).then(res => {
        if (!res) return
        console.log(res)
      })
    }
  }
}
</script>

<style lang="scss">
// .AutoCrateCourse {
// }
</style>