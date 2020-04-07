<template>
  <div class="">
    <!-- 600px【小型，单列】 70% 【中型，双列】-->
    <el-dialog
      title="审核"
      :visible="visible"
      width="600px"
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
          <!-- 单选 -->
          <el-form-item
            label="审核意见"
            prop="opStatus"
          >
            <el-radio-group v-model="formData.opStatus">
              <el-radio :label="1">通过</el-radio>
              <el-radio :label="2">驳回</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- 多行文本框 -->
          <el-form-item
            label="审核备注"
            prop="remark"
          >
            <el-input
              style="width:200px;"
              v-model="formData.remark"
              type="textarea"
              placeholder="选填 ，30个字以内"
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

import { inOutStopCheckTaskOrder } from '@/api'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    /** 数据初始 */
    row: {
      type: Object,
      default: {}
    }
  },
  computed: {
    /** 防止父级传递 null */
    rowData() {
      return this.row || {}
    }
  },
  watch: {
    /** 监听数据切换，重置表单 */
    visible(val) {
      if (!val) return
      Object.keys(this.formData).forEach(key => {
        this.$set(this.formData, key, this.rowData[key] === null ? undefined : this.rowData[key])
      })
      this.formData.opStatus = undefined
    }
  },
  data() {
    return {
      loading: false,
      formData: {
        //  ... 表单字段
        opStatus: undefined,
        remark: undefined,
      },
      rules: {
        //  ... 表单校验
        opStatus: [{ required: true, message: '必填项', trigger: 'blur' },]
      }
    }
  },
  methods: {
    /** 确定 */
    confirm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          let params = { ...this.formData }
          for (let key in params) {
            if (params[key] === undefined) {
              params[key] = ''
            }
          }
          params.id = this.rowData.id
          inOutStopCheckTaskOrder(params).then(res => {
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
      this.$refs['form'] && this.$refs['form'].resetFields()
      this.visible && this.$emit('update:visible', false)
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => { })
    }
  }
}
</script>