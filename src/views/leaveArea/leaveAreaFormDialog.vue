<template>
  <div class="">
    <!-- 600px【小型，单列】 70% 【中型，双列】-->
    <el-dialog
      :title="`${rowData._id ? '修改' : '新建'}请假`"
      :visible="visible"
      width="70%"
      :before-close="handleClose"
      @close="close"
    >
      <div>
        <el-form
          :inline="false"
          :model="formData"
          :rules="rules"
          label-width="100px"
          ref="form"
        >
          <el-form-item
            label="用户"
            prop="person"
          >

            <!-- 查询人 -->
            <el-select
              style="width: 200px"
              v-model="formData.person"
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="searchPerson"
              :loading="personLoading"
              @change="handelPersonChange"
              :disabled="!!rowData._id"
            >
              <el-option
                :disabled="true"
                label="-"
                value="-"
              >
                <span>角色</span>
                <span
                  class="ml5"
                  style="min-width:120px"
                >名称</span>
                <span class="ml5">电话号码</span>
              </el-option>
              <el-option
                v-for="item in personList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
                <span>{{ item.typeName }}</span>
                <span
                  class="ml5"
                  style="min-width:120px"
                >{{ item.label }}</span>
                <span class="ml5">{{ item.phone }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <!-- 查询天 -->
          <el-form-item
            label="日期"
            prop="date"
            v-if="!rowData._id"
          >
            <el-date-picker
              @change="handleDateChange"
              style="width:200px;"
              v-model="formData.date"
              type="date"
              placeholder="选择日期"
              format="yyyy 年 MM 月 dd 日"
            >
              >
            </el-date-picker>
          </el-form-item>
          <!-- 选择课程 -->
          <el-form-item
            label="课程"
            prop="course"
            v-show="rowData._id || (formData.date && formData.person)"
            v-loading="courseLoading"
          >
            <el-radio-group
              v-model="formData.course"
              :disabled="!!rowData._id"
              @change="handleCourseChange"
            >
              <el-radio
                v-for="item in courseList"
                :key="item._id"
                :label="item._id"
              > {{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="状态"
            prop="status"
          >
            <el-select
              v-model="formData.status"
              :placeholder="`请选择`"
              style="width:200px;"
            >
              <el-option
                v-for="item in mapConfig['leaveAreaStatusMap'] || []"
                :key="item.name"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- 备注 -->
          <el-form-item
            label="备注"
            prop="remark"
          >
            <el-input
              style="width:200px;"
              v-model="formData.remark"
              type="textarea"
              placeholder="请输入内容"
              maxlength="30"
              show-word-limit
            >
            </el-input>
          </el-form-item>
        </el-form>

      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="close()">取 消</el-button>
        <el-button
          type="primary"
          :loading="loading"
          @click="confirm()"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { leaveAreasAdd, personList, coursesFindByPersonAndDay, leaveAreasModify } from '@/api'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    /** 数据初始 */
    row: {
      type: Object,
      default: () => null
    }
  },
  computed: {
    /** 防止父级传递 null */
    rowData() {
      return this.row || {}
    },
    mapConfig() {
      return this.$store.state.map.mapConfig
    }
  },
  watch: {
    /** 监听数据切换，重置表单。为何不监听rowData?因为主组件visible一一对应，但选中数据不是，selectRow 是多个弹窗共享的 */
    visible(val) {
      if (!val) return
      const temp = this.$copy(this.rowData)
      if (temp._id) {
        this.formData = {
          person: temp.person._id,
          date: undefined,
          adverse: temp.adverse._id,
          course: temp.course._id,
          remark: temp.remark,
          status: temp.status,
        }
        this.personList = [{
          ...temp.person,
          label: temp.person.name,
          value: temp.person._id,
          typeName: temp.person === 'teacher' ? '教师' : '学生',
        }]
        this.kind = temp.person.kind
        {
          const v = temp.course
          let target = temp.adverse
          if (v && target) {
            this.courseList = [{
              ...v,
              label: `${this.$moment(v.startTime).format("HH:mm")}-${this.$moment(v.endTime).format("HH:mm")} ${this.kind === 'teacher' ? '学生' : '老师'} ${target && target.name}`,
            }]
          }
        }
      } else {
        this.searchPerson()
        this.formData = {
          person: undefined,
          date: undefined,
          course: undefined,
          remark: undefined,
          adverse: undefined,
          status: 0,
        }
      }

    }
  },
  data() {
    return {
      personLoading: false,
      courseLoading: false,
      personList: [],
      courseList: [],
      loading: false,
      kind: undefined,
      formData: {
        person: undefined,
        date: undefined,
        course: undefined,
        adverse: undefined,
        remark: undefined,
        status: 0,
      },
      rules: {
        //  ... 表单校验
        person: [
          { required: true, message: '必填项', trigger: ['blur', 'change'] },
        ],
        date: [
          { required: true, message: '必填项', trigger: ['blur', 'change'] },
        ],
        course: [
          { required: true, message: '必填项', trigger: ['blur', 'change'] },
        ],
        status: [
          { required: true, message: '必填项', trigger: ['blur', 'change'] },
        ],
      }
    }
  },
  created() {
    this.searchPerson()
  },
  methods: {
    /** 用户改变 */
    handelPersonChange(val) {
      if (val) {
        this.kind = this.personList.find(v => v._id === val).kind
      } else {
        this.kind = undefined
      }
      console.log(this.kind)
      this.searchCourse()
    },
    /** 时间改变 */
    handleDateChange(val) {
      this.searchCourse()
    },
    /** 课程改变 */
    handleCourseChange(val) {
      if (val) {
        const course = this.courseList.find(v => v._id === val)
        this.formData.adverse = course && course.adverse
      } else {
        this.formData.adverse = undefined
      }
    },
    searchCourse() {
      const kind = this.kind
      const { person, date } = this.formData
      this.formData.course = undefined
      this.handleCourseChange()
      if (person && date) {
        this.courseLoading = true
        coursesFindByPersonAndDay({ person, date }).then(res => {
          this.courseLoading = false
          if (!res) return
          this.courseList = res.map(v => {
            const target = kind === 'teacher' ? v.student : v.teacher
            return {
              ...v,
              adverse: target,
              label: `${this.$moment(v.startTime).format("HH:mm")}-${this.$moment(v.endTime).format("HH:mm")} ${kind === 'teacher' ? '学生' : '老师'} ${target && target.name}`,
            }
          })
        })
      } else {
        this.courseList = []
      }
    },
    /** 搜索用户 */
    searchPerson(query) {
      this.personList = []
      this.personLoading = true
      personList({ name: query }).then(res => {
        this.personLoading = false
        if (!res) return
        this.personList = res.list.map(v => ({
          ...v,
          label: v.name,
          value: v._id,
          typeName: v.kind === 'teacher' ? '教师' : '学生',
        }))
      })
    },
    /** 确定 */
    confirm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let params = { ...this.formData }
          for (let key in params) {
            if (params[key] === undefined) {
              params[key] = ''
            }
          }
          this.loading = true
          let args = [params]
          let api = leaveAreasAdd
          if (this.rowData._id) {
            args.unshift(this.rowData._id)
            api = leaveAreasModify
          }
          api(...args).then(res => {
            this.loading = false
            if (!res) return
            this.$message.success('操作成功！')
            this.$emit('submited')
            this.close()
          })
        }
      })
    },
    /** 关闭弹窗 */
    close() {
      // 初始化表单
      // this.$refs['form'] && this.$refs['form'].resetFields()
      // 初始化没有挂载到表单的数据
      // ...
      this.visible && this.$emit('update:visible', false)
    },
    handleClose(done) {
      if (this.visible === false) {
        return done()
      }
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => { })
    }
  }
}
</script>