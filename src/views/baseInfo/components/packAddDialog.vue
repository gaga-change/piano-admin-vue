<template>
  <div class="">
    <el-dialog
      title="新建包装"
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
          <el-form-item
            label="包装描述"
            prop="packageDesc"
          >
            <el-input
              style="width:200px;"
              v-model="formData.packageDesc"
              placeholder="中文/字母/数字，不能超过20个字符"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="最小单位"
            prop="single"
          >
            <el-input-number
              placeholder="最小单位"
              v-model="formData.single"
              :precision="0"
              :min="0"
              :max="99999999"
              disabled="disabled"
              controls-position="right"
            ></el-input-number>
          </el-form-item>
          <el-form-item
            label="内包装"
            prop="innerPackage"
          >
            <el-input-number
              placeholder=""
              v-model="formData.innerPackage"
              :precision="0"
              :min="0"
              :max="99999999"
              controls-position="right"
            ></el-input-number>
          </el-form-item>
          <el-form-item
            label="箱"
            prop="box"
          >
            <el-input-number
              placeholder=""
              v-model="formData.box"
              :precision="0"
              :min="0"
              :max="99999999"
              controls-position="right"
            ></el-input-number>
          </el-form-item>
          <el-form-item
            label="容器"
            prop="palet"
          >
            <el-input-number
              placeholder=""
              v-model="formData.palet"
              :precision="0"
              :min="0"
              :max="99999999"
              controls-position="right"
            ></el-input-number>
          </el-form-item>
        </el-form>
      </div>
      <el-alert
        class="mt15"
        title="温馨提示："
        type="info"
        :closable="false"
      >
        <p>举例，商品最小单位默认为1,4个最小单位为一个内包装【一个内包装数量为4】，
          2个内包装为1箱【一箱数量8】，10箱为一个容器【一容器数量为80】</p>
      </el-alert>
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
import { packageSave } from '@/api'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    /** 数据初始 */
    row: {
      type: Object,
      default: () => ({})
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
    }
  },
  data() {
    return {
      loading: false,
      formData: {
        packageDesc: undefined,
        single: 1,
        innerPackage: undefined,
        box: undefined,
        palet: undefined,
      },
      rules: {
        packageDesc: [
          { required: true, message: '请输入包装描述', trigger: 'blur' },
          { min: 0, max: 20, message: '长度不能超过20个字', trigger: 'blur' }
        ],
        box: [
          { required: true, message: '必填项', trigger: 'blur' },
          {
            validator(rule, value, callback) {
              value > 0 ? callback() : callback('数值必须大于0')
            },
            trigger: 'blur'
          }
        ],
        palet: [
          { required: true, message: '必填项', trigger: 'blur' },
          {
            validator(rule, value, callback) {
              value > 0 ? callback() : callback('数值必须大于0')
            },
            trigger: 'blur'
          }
        ]
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
          packageSave(params).then(res => {
            this.loading = false
            if (!res) return
            this.$emit('submited')
            this.$message.success('操作成功！')
            this.close()
          })
        }
      })
    },
    /** 关闭弹窗 */
    close() {
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