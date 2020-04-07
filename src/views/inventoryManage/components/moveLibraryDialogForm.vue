<template>
  <div class="">
    <!-- 600px【小型，单列】 70% 【中型，双列】-->
    <el-dialog
      title="移库"
      :visible="visible"
      width="70%"
      :before-close="handleClose"
      @close="close"
    >
      <div>
        <detail-item
          :config="baseInfoConfig"
          :detail="rowData"
        ></detail-item>
        <el-form
          class="mt20"
          :inline="false"
          :model="formData"
          :rules="rules"
          label-width="100px"
          ref="form"
        >
          <el-form-item label="原库位">
            <el-input
              disabled
              style="width:200px;"
              v-model="rowData.warehouseSpaceCode"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="数量"
            prop="number"
          >
            <el-input-number
              placeholder="数量"
              v-model="formData.number"
              :precision="0"
              :min="0"
              :max="rowData.number"
              controls-position="right"
            ></el-input-number>
          </el-form-item>
          <el-form-item
            label="目标库位"
            prop="warehouseSpaceCode"
          >
            <el-select
              v-model="formData.warehouseSpaceCode"
              placeholder="请选择目标库位"
              clearable
              :loading="warehouseSpaceSelectLoading"
            >
              <el-option
                v-for="item in warehouseSpaceCodeConfigComputed"
                :key="item.warehouseSpaceCode"
                :label="item.warehouseSpaceCode"
                :value="item.warehouseSpaceCode"
                :disabled="item.disabled"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="带容器">
            <el-switch v-model="hasContainer">
            </el-switch>
          </el-form-item>
          <el-form-item
            label="容器"
            prop="trayCode"
            v-if="hasContainer"
          >
            <el-input
              style="width:200px;"
              v-model="formData.trayCode"
              placeholder="请输入容器"
            ></el-input>
          </el-form-item>
        </el-form>
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
import { warehouseSpaceList, skuStockMove } from '@/api'
const baseInfoConfig = [
  { label: '商品名称 ', prop: 'skuName' },
  { label: '商品批次', prop: 'batchNo', type: 'batchNoPopover' },
  { label: '数量', prop: 'number' },
]
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
  watch: {
    /** 监听数据切换，重置表单 */
    visible(val) {
      // if (!val) return
      // Object.keys(this.formData).forEach(key => {
      //   this.$set(this.formData, key, this.rowData[key] === null ? undefined : this.rowData[key])
      // })
    }
  },
  data() {
    return {
      baseInfoConfig,
      loading: false,
      hasContainer: false,
      formData: {
        //  ... 表单字段
        number: undefined,
        warehouseSpaceCode: undefined,
        trayCode: undefined,
      },
      rules: {
        //  ... 表单校验
        number: [
          { required: true, message: '必填项', trigger: 'blur' },
          {
            validator(rule, value, callback) {
              value > 0 ? callback() : callback('数值必须大于0')
            },
            trigger: 'blur'
          }
        ],
        warehouseSpaceCode: [{ required: true, message: '必填项', trigger: 'blur' },],
        trayCode: [
          { required: true, message: '必填项', trigger: 'blur' },
          { min: 0, max: 30, message: '不能超过30个字符', trigger: 'blur' }
        ]
      },
      warehouseSpaceCodeConfig: [],
    }
  },
  computed: {
    /** 防止父级传递 null */
    rowData() {
      return this.row || {}
    },
    warehouseSpaceCodeConfigComputed() {
      return this.warehouseSpaceCodeConfig.map(v => {
        if (v.warehouseSpaceCode === this.rowData.warehouseSpaceCode) {
          v.disabled = true
        } else {
          v.disabled = false
        }
        return v
      })
    }
  },
  created() {
    this.warehouseSpaceSelectLoading = true
    warehouseSpaceList().then(res => {
      this.warehouseSpaceSelectLoading = false
      if (res) {
        this.warehouseSpaceCodeConfig = res.data || [];
      }
    })
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
          let code = params.warehouseSpaceCode
          let newSkuQty = params.number
          this.skuStockMoveLoading = true
          skuStockMove({
            stockId: this.rowData.id,
            warehouseSpaceCode: code,
            moveQty: newSkuQty,
            trayCode: (params.trayCode && this.hasContainer) ? params.trayCode : undefined,
            warehouseAreaCode: this.warehouseSpaceCodeConfig.find(v => v.warehouseSpaceCode === code).warehouseAreaCode,
          }).then(res => {
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
      // 初始化没有挂载到表单的数据
      this.hasContainer = false
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