<template>
  <div class="">
    <!-- 600px【小型，单列】 70% 【中型，双列】-->
    <el-dialog
      :title="`${this.rowData.isAdd ? '添加': '编辑'}联系信息`"
      :visible="visible"
      width="400px"
      :before-close="handleClose"
      @close="close"
    >
      <div>
        <base-form
          :config="formConfig"
          :rules="rules"
          ref="form"
        >
        </base-form>
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
// {linkUser: undefined, linkTel: undefined, address: undefined}
const formConfig = [
  { label: '联系人', prop: 'linkUser' },
  { label: '电话', prop: 'linkTel' },
  { label: '地址', prop: 'address' },

]
const rules = {
  linkUser: [
    { required: true, message: '必填项', trigger: ['blur', 'change'] },
    { min: 0, max: 15, message: '不能超过15个字符', trigger: ['blur', 'change'] }
  ],
  linkTel: [
    { required: true, message: '必填项', trigger: ['blur', 'change'] },
    { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号码' }],
  address: [{ max: 80, message: '不能超过80个字符', trigger: ['blur', 'change'] }]
}
// import { saveApi } from '@/api'
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
    }
  },
  watch: {
    /** 监听数据切换，重置表单 */
    visible(val) {
      if (!val) return
      this.formConfig.forEach(item => {
        item.default = this.rowData[item.prop] === null ? undefined : this.rowData[item.prop]
      })
      this.$nextTick(() => {
        this.$refs['form'].init()
      })
    }
  },
  data() {
    return {
      formConfig,
      rules,
      loading: false,
      formData: {
        //  ... 表单字段
      }
    }
  },
  methods: {
    /** 确定 */
    confirm() {
      this.$refs['form'].validate((valid, params) => {
        if (valid) {
          this.$emit('submited', this.$copy(params))
          this.close()
        }
      })
    },
    /** 关闭弹窗 */
    close() {
      // 初始化表单
      this.$refs['form'] && this.$refs['form'].resetFields()
      // 初始化没有挂载到表单的数据
      // ...
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