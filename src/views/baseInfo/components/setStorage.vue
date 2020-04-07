<template>
  <div class="SetStorageCom">
    <el-dialog
      title="库位设置"
      :visible="visible"
      width="70%"
      :before-close="handleClose"
      @close="close"
    >
      <div>
        <el-form
          :inline="true"
          :model="formData"
          :rules="rules"
          ref="form"
          class="demo-form-inline"
        >
          <el-card class="box-card">
            <div
              slot="header"
              class="clearfix"
            >
              <span>基本信息</span>
            </div>
            <div>
              <el-form-item label="库区编码">
                <el-input
                  size="mini"
                  v-model="formData.warehouseAreaCode"
                  disabled="disabled"
                ></el-input>
              </el-form-item>
              <el-form-item label="库位编码">
                <el-input
                  size="mini"
                  v-model="formData.warehouseSpaceCode"
                  disabled="disabled"
                ></el-input>
              </el-form-item>
              <br>
              <el-form-item
                label="承载重量"
                prop="loadBorn"
              >
                <el-row :gutter="20">
                  <el-col :span="16">
                    <el-input-number
                      size="mini"
                      placeholder="承载重量"
                      v-model="formData.loadBorn"
                      :precision="3"
                      :min="0"
                      :max="99999999"
                      controls-position="right"
                    ></el-input-number>
                  </el-col>
                  <el-col :span="8">
                    <span class="c-ccc">单位：kg</span>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item
                label="承载数量"
                prop="loadQty"
              >
                <el-input-number
                  size="mini"
                  placeholder="承载数量"
                  v-model="formData.loadQty"
                  :precision="0"
                  :min="0"
                  :max="99999999"
                  controls-position="right"
                ></el-input-number>
              </el-form-item>
              <br>
              <el-form-item
                label="承载体积"
                prop="loadVolume"
              >
                <el-row :gutter="20">
                  <el-col :span="16">
                    <el-input-number
                      size="mini"
                      placeholder="承载体积"
                      v-model="formData.loadVolume"
                      :precision="3"
                      :min="0"
                      :max="99999999"
                      controls-position="right"
                    ></el-input-number>
                  </el-col>
                  <el-col :span="8">
                    <span class="c-ccc">单位：m³</span>
                  </el-col>
                </el-row>
              </el-form-item>
              <br>
              <el-form-item label="库位长宽高">
                <el-row :gutter="30">
                  <el-col :span="6">
                    <el-input-number
                      size="mini"
                      placeholder="长"
                      v-model="formData.length"
                      :precision="3"
                      :min="0"
                      :max="99999999"
                      controls-position="right"
                    ></el-input-number>
                  </el-col>
                  <el-col :span="6">
                    <el-input-number
                      size="mini"
                      placeholder="宽"
                      v-model="formData.width"
                      :precision="3"
                      :min="0"
                      :max="99999999"
                      controls-position="right"
                    ></el-input-number>
                  </el-col>
                  <el-col :span="6">
                    <el-input-number
                      size="mini"
                      placeholder="高"
                      v-model="formData.height"
                      :precision="3"
                      :min="0"
                      :max="99999999"
                      controls-position="right"
                    ></el-input-number>
                  </el-col>
                  <el-col :span="6">
                    <span class="c-ccc">单位：m</span>
                  </el-col>
                </el-row>
              </el-form-item>
            </div>
          </el-card>
          <el-card class="box-card mt20">
            <div
              slot="header"
              class="clearfix"
            >
              <span>商品设置</span>
            </div>
            <div>
              <el-form-item
                label="商品混放数"
                prop="lotNum"
              >
                <el-input-number
                  size="mini"
                  v-model="formData.lotNum"
                  placeholder="商品混放数"
                  :precision="0"
                  :min="0"
                  :max="99999999"
                  controls-position="right"
                ></el-input-number>
              </el-form-item>
              <el-form-item label="是否混批次">
                <el-switch
                  v-model="formData.isLot"
                  size="mini"
                  :active-value='1'
                  :inactive-value='0'
                >
                </el-switch>
              </el-form-item>
            </div>
          </el-card>
        </el-form>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          @click="close()"
          size="mini"
        >取 消</el-button>
        <el-button
          type="primary"
          size="mini"
          :loading="basicWarehouseSpaceUpdateLoading"
          @click="confirm()"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { basicWarehouseSpaceUpdate } from '@/api'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    row: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    rowData() {
      return this.row || {}
    },
    autoLoadVolume() {
      let { width, height, length } = this.formData
      if (width === undefined && height === undefined && length === undefined) return undefined
      return (this.formData.width || 0) * (this.formData.height || 0) * (this.formData.length || 0)
    },
    loadVolume() {
      return this.formData.loadVolume
    }
  },
  watch: {
    autoLoadVolume(val) {
      if (val !== undefined) this.formData.loadVolume = val
    },
    loadVolume(val) {
      if (this.autoLoadVolume !== val) {
        this.formData.width = undefined
        this.formData.height = undefined
        this.formData.length = undefined
      }
    },
    visible(val) {
      if (!val) return
      Object.keys(this.formData).forEach(key => {
        this.$set(this.formData, key, this.rowData[key] === null ? undefined : this.rowData[key])
      })
    }
  },
  data() {
    return {
      basicWarehouseSpaceUpdateLoading: false,
      formData: {
        warehouseAreaCode: null,
        warehouseSpaceCode: null,
        length,
        id: null,
        length: '',
        width: null,
        height: null,
        loadVolume: null, // 承载体积
        loadBorn: null, // 承载重量
        isLot: null, // 是否允许混批次存放0：不允许 1：允许
        lotNum: null, // 混发批次数
        loadQty: null, // 承载数量
      },
      rules: {
        loadBorn: [
          { required: true, message: '请输入承载重量', trigger: 'blur' },
          {
            validator(rule, value, callback) {
              value > 0 ? callback() : callback('承载重量必须大于0')
            },
            trigger: 'blur'
          }
        ],
        loadQty: [
          { required: true, message: '请输入承载数量', trigger: 'blur' },
          {
            validator(rule, value, callback) {
              value > 0 ? callback() : callback('承载数量必须大于0')
            },
            trigger: 'blur'
          }
        ],
        loadVolume: [
          { required: true, message: '请输入承载体积', trigger: 'blur' },
          {
            validator(rule, value, callback) {
              value > 0 ? callback() : callback('体积必须大于0')
            },
            trigger: 'blur'
          }
        ],
        lotNum: [
          { required: true, message: '请输入商品混放数', trigger: 'blur' },
          {
            validator(rule, value, callback) {
              value > 0 ? callback() : callback('体积必须大于0')
            },
            trigger: 'blur'
          }
        ],
      }
    }
  },
  methods: {
    /** 确定 */
    confirm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.basicWarehouseSpaceUpdateLoading = true
          let params = { ...this.formData }
          for (let key in params) {
            if (params[key] === undefined) {
              params[key] = ''
            }
          }
          basicWarehouseSpaceUpdate(params).then(res => {
            this.basicWarehouseSpaceUpdateLoading = false
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
          done();
        })
        .catch(_ => { });
    }
  }
}
</script>

<style lang="scss">
.SetStorageCom {
  .box-card {
    .el-card__header {
      padding: 9px 10px;
    }
  }
}
</style>
