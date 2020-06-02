<template>
  <div class="">
    <!-- 600px【小型，单列】 70% 【中型，双列】-->
    <el-dialog
      :title="`${rowData._id ? '修改' : '新建'}课程`"
      :visible="visible"
      width="70%"
      :before-close="handleClose"
      @close="close"
    >
      <div>
        <base-form
          :config="formConfig"
          :rules="rules"
          :inline="true"
          ref="form"
        > </base-form>
      </div>
      <!-- <el-alert
        class="mt15"
        title="温馨提示："
        type="info"
        :closable="false"
      >
        <p>举例，商品最小单位默认为1,4个最小单位为一个内包装【一个内包装数量为4】，
          2个内包装为1箱【一箱数量8】，10箱为一个容器【一容器数量为80】</p>
      </el-alert> -->
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
const formConfig = [
  {
    label: "日期", prop: "date", type: 'datePicker', pickerOptions: {
      disabledDate(time) {
        return time.getTime() < (Date.now() - 24 * 60 * 60 * 1000);
      },
    }
  },
  { label: "开始时间", prop: "startTime", type: 'timePicker', format: 'HH:mm' },
  { label: "教师", prop: "teacher", type: 'selectRemote', list: [], default: undefined, loading: false, remoteMethod: undefined },
  { label: "学生", prop: "student", type: 'selectRemote', list: [], default: undefined, loading: false, remoteMethod: undefined },
  { label: "状态", prop: "status", type: "enum", enum: "courseStatusMap", default: 0 },
  { label: "课类别", prop: "classType", type: "enum", enum: "classType" },
  { label: "课时长", prop: "classTime", type: "enum", enum: "classTime" },
  { label: "老师状态", prop: "teacherStatus", type: "enum", enum: "coursePersonStatusMap", default: 0 },
  { label: "学生状态", prop: "studentStatus", type: "enum", enum: "coursePersonStatusMap", default: 0 },
  { label: "备注", prop: "remark" },
];
const rules = {
  date: [
    { required: true, message: "必填项", trigger: ["blur", "change"] }
  ],
  startTime: [
    { required: true, message: "必填项", trigger: ["blur", "change"] }
  ],
  teacher: [
    { required: true, message: "必填项", trigger: ["blur", "change"] }
  ],
  student: [
    { required: true, message: "必填项", trigger: ["blur", "change"] }
  ],
  status: [
    { required: true, message: "必填项", trigger: ["blur", "change"] }
  ],
  classType: [
    { required: true, message: "必填项", trigger: ["blur", "change"] }
  ],
  classTime: [
    { required: true, message: "必填项", trigger: ["blur", "change"] }
  ],
};
/**
 * 父级设置
 * <dialog
      :visible.sync="dialogVisible"
      :row="selectedRow"
      @submited="getTableData()"
    />
 */
import { coursesAdd, coursesModify, teachersList, studentsList } from "@/api";
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
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
      return this.row || {};
    },
    mapConfig() {
      return this.$store.state.map.mapConfig
    }
  },
  watch: {
    /** 监听数据切换，重置表单 */
    visible(val) {
      if (!val) return;
      this.formConfig = this.$copy(formConfig)
      this.formConfig.forEach(item => {
        item.default =
          (this.rowData[item.prop] === null || this.rowData[item.prop] === undefined)
            ? item.default
            : this.rowData[item.prop];

        if (item.prop === 'teacher') {
          if (typeof this.rowData.teacher === 'object') {
            item.list = [{ label: this.rowData.teacher.name, value: this.rowData.teacher._id }]
            item.default = this.rowData.teacher._id
          } else {
            item.list = []
            item.default = undefined
          }
        }
        if (item.prop === 'student') {
          if (typeof this.rowData.student === 'object') {
            item.list = [{ label: this.rowData.student.name, value: this.rowData.student._id }]
            item.default = this.rowData.student._id
          } else {
            item.list = []
            item.default = undefined
          }
        }
      });
      const teacherConfig = this.formConfig.find(v => v.prop === 'teacher')
      teacherConfig.loading = false
      teacherConfig.remoteMethod = (query) => {
        const teacherConfig = this.formConfig.find(v => v.prop === 'teacher')
        teacherConfig.loading = true
        teachersList({ name: query }).then(res => {
          teacherConfig.loading = false
          if (!res) return
          teacherConfig.list = res.list.map(v => ({
            label: v.name,
            value: v._id
          }))
          console.log(this.$copy(this.formConfig))
        })
      }
      const studentConfig = this.formConfig.find(v => v.prop === 'student')
      studentConfig.loading = false
      studentConfig.remoteMethod = (query) => {
        const studentConfig = this.formConfig.find(v => v.prop === 'student')
        studentConfig.loading = true
        studentsList({ name: query }).then(res => {
          studentConfig.loading = false
          if (!res) return
          studentConfig.list = res.list.map(v => ({
            label: v.name,
            value: v._id
          }))
        })
      }
      this.$nextTick(() => {
        this.$refs["form"].init();
      });
    }
  },
  data() {
    return {
      formConfig,
      rules,
      loading: false
    };
  },
  methods: {
    /** 确定 */
    confirm() {
      const isModify = this.row && this.row._id;
      const api = isModify ? coursesModify : coursesAdd;
      this.$refs["form"].validate((valid, params) => {
        if (valid) {
          params = { ...params }
          let { startTime, date } = params
          startTime = new Date(startTime)
          date = new Date(date)
          date.setHours(0, 0, 0, 0)
          startTime.setFullYear(date.getFullYear(), date.getMonth(), date.getDate())
          startTime.setSeconds(0, 0)
          params.startTime = startTime
          this.loading = true;
          delete params.date
          let temp = isModify ? [this.row._id, params] : [params];
          api(...temp).then(res => {
            this.loading = false;
            if (!res) return;
            this.$message.success("操作成功！");
            this.$emit("submited");
            this.close();
          });
        }
      });
    },
    /** 关闭弹窗 */
    close() {
      // 初始化表单
      // 初始化没有挂载到表单的数据
      // ...
      this.visible && this.$emit("update:visible", false);
      this.$nextTick(() => {
        this.$refs["form"] && this.$refs["form"].resetFields();
      })
    },
    handleClose(done) {
      if (this.visible === false) {
        return done()
      }
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => { });
    }
  }
};
</script>