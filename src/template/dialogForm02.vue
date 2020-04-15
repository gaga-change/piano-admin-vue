<template>
  <div class="">
    <!-- 600px【小型，单列】 70% 【中型，双列】-->
    <el-dialog
      :title="`${rowData._id ? '修改':'新建'}`"
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
const formConfig = [
  { label: '仓库编码', prop: 'warehouseCode', width: 120 },
  { label: '仓库名称', prop: 'warehouseName' },
  { label: '类型', prop: 'type', type: 'enum', enum: 'warehouseTypeEnum' },
  { label: '联系人', prop: 'linkName' },
  { label: '详细地址', prop: 'warehouseAddress' },
  { label: '状态', prop: 'status', type: 'radio', enum: 'warehouseStatusEnum', default: 0 },
]
const rules = {
  warehouseCode: [
    { required: true, message: '必填项', trigger: ['blur', 'change'] },
    { pattern: /^[0-9a-zA-Z]*$/, message: '只能输入数字或字母' },
    { min: 0, max: 20, message: '不能超过20个字符', trigger: ['blur', 'change'] }
  ],
  warehouseName: [{ required: true, message: '必填项', trigger: ['blur', 'change'] }, { min: 0, max: 50, message: '不能超过50个字符', trigger: ['blur', 'change'] }],
  type: [{ required: true, message: '必填项', trigger: ['blur', 'change'] }],
  linkName: [{ min: 0, max: 20, message: '不能超过20个字符', trigger: ['blur', 'change'] }],
  warehouseAddress: [{ min: 0, max: 100, message: '不能超过100个字符', trigger: ['blur', 'change'] }],
  status: [{ required: true, message: '必填项', trigger: ['blur', 'change'] }],
}
/**
 * 父级设置
 * <dialog
      :visible.sync="dialogVisible"
      :row="selectedRow"
      @submited="getTableData()"
    />
 */
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
    }
  },
  methods: {
    /** 确定 */
    confirm() {
      this.$refs['form'].validate((valid, params) => {
        if (valid) {
          // this.loading = true
          // saveApi(params).then(res => {
          //   this.loading = false
          //   if (!res) return
          //   this.$message.success('操作成功！')
          //   this.$emit('submited')
          //   this.close()
          // })
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