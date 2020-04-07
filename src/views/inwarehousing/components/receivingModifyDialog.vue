<template>
  <div class="receivingModifyDialog">
    <!-- 600px【小型，单列】 70% 【中型，双列】-->
    <el-dialog
      title="收货明细修改"
      :visible="visible"
      width="70%"
      :before-close="handleClose"
      @close="close"
    >
      <div v-loading="lotDetailLoading">
        <!-- 基本信息 -->
        <div>
          <detail-item
            :config="detailItemConfig"
            :detail="rowData"
          />
        </div>
        <div class="mt20">
          <el-form
            :inline="true"
            :model="formData"
            :rules="rules"
            label-width="100px"
            ref="form"
            style="font-size: 0"
          >
            <el-form-item
              label="容器"
              prop="trayCode"
            >
              <el-input
                style="width:200px;"
                v-model="formData.trayCode"
                placeholder="请输入容器"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="数量"
              prop="receiveQty"
            >
              <el-input-number
                style="width:200px;"
                placeholder="数量"
                v-model="formData.receiveQty"
                :precision="0"
                :min="1"
                :max="99999999"
                controls-position="right"
              ></el-input-number>
            </el-form-item>
            <el-form-item
              v-for="item in lotDetailList"
              :key="item.lotAttrCode"
              :label="item.lotAttrName"
              :prop="item.lotAttrCode"
              :rules="[{ required: item.inputType === 1, message: '必填项', trigger: ['blur', 'change'] }]"
            >
              <template v-if="item.lotAttrType === 1">
                <el-input
                  style="width:200px;"
                  v-model="formData[item.lotAttrCode]"
                  :placeholder="'请输入' + item.lotAttrName"
                  :maxlength="item.lotAttrValue.length || 20"
                ></el-input>
              </template>
              <template v-if="item.lotAttrType === 2">
                <el-input-number
                  style="width:200px;"
                  v-model="formData[item.lotAttrCode]"
                  :placeholder="'请输入' + item.lotAttrName"
                  :precision="item.lotAttrValue.precision || 0"
                  :min="item.lotAttrValue.min || 0"
                  :max="item.lotAttrValue.max || 999999"
                  controls-position="right"
                ></el-input-number>
              </template>
              <template v-if="item.lotAttrType === 3">
                <el-select
                  style="width:200px;"
                  v-model="formData[item.lotAttrCode]"
                  :placeholder="'请选择'"
                  clearable
                >
                  <el-option
                    v-for="item in item.lotAttrValue.enum || []"
                    :key="item"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
              </template>
              <template v-if="item.lotAttrType === 4">
                <template v-if="item.lotAttrValue.format == 'YYYY'">
                  <el-date-picker
                    style="width:200px;"
                    v-model="formData[item.lotAttrCode]"
                    type="year"
                    placeholder="选择年"
                    value-format="yyyy"
                  >
                  </el-date-picker>
                </template>
                <template v-if="item.lotAttrValue.format == 'YYYY-MM'">
                  <el-date-picker
                    style="width:200px;"
                    v-model="formData[item.lotAttrCode]"
                    type="month"
                    placeholder="选择月"
                    value-format="yyyy-MM"
                  >
                  </el-date-picker>
                </template>
                <template v-if="item.lotAttrValue.format == 'YYYY-MM-DD'">
                  <el-date-picker
                    style="width:200px;"
                    v-model="formData[item.lotAttrCode]"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd"
                  >
                  </el-date-picker>
                </template>
              </template>
            </el-form-item>
          </el-form>
        </div>
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
          :loading="loading"
          @click="confirm()"
        >收货确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { editorReceiveItem, lotDetail } from '@/api'

const detailItemConfig = [
  { label: '商品编码', prop: 'skuCode' },
  { label: '商品名称', prop: 'skuName' },
  { label: '规格', prop: 'skuFormat' },
  { label: '型号', prop: 'skuModel' },
  { label: '单位', prop: 'skuUnitCode' },
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
  computed: {
    /** 防止父级传递 null */
    rowData() {
      return this.row || {}
    }
  },
  watch: {
    /** 监听数据切换，重置表单。为何不监听rowData?因为主组件visible一一对应，但选中数据不是，selectRow 是多个弹窗共享的 */
    visible(val) {
      if (!val) return
      Object.keys(this.formData).forEach(key => {
        this.$set(this.formData, key, this.rowData[key] === null ? undefined : this.rowData[key])
      })
      this.initBatch()
    }
  },
  data() {
    return {
      lotDetailLoading: false,
      detailItemConfig,
      loading: false,
      formData: {
        //  ... 表单字段
        trayCode: undefined,
        receiveQty: undefined,
      },
      rules: {
        trayCode: [{ required: true, message: '必填项', trigger: ['blur', 'change'] }, { min: 0, max: 20, message: '不能超过20个字符', trigger: ['blur', 'change'] },],
        receiveQty: [{ required: true, message: '必填项', trigger: ['blur', 'change'] },]
      },
      lotDetailList: []
    }
  },
  created() {
    for (let i = 1; i <= 12; i++) {
      this.$set(this.formData, 'lotAttrCode' + i, undefined)
    }
  },
  methods: {
    /** 初始化批次 */
    initBatch() {
      const lotId = this.rowData.lotId
      if (!lotId) return
      this.lotDetailLoading = true
      lotDetail(lotId).then(res => {
        this.lotDetailLoading = false
        if (!res) return
        const lotDetailList = res.data.lotDetailList || []
        let temp = lotDetailList.filter(v => {
          return v.dataSource === 1 && v.status === 0
        }).map(v => {
          if (v.lotAttrValue) {
            try {
              v.lotAttrValue = JSON.parse(v.lotAttrValue)
            } catch (error) {
              console.error('解析异常：', v.lotAttrValue)
              v.lotAttrValue = {}
            }
          } else {
            v.lotAttrValue = {}
          }
          return v
        })
        this.lotDetailList = temp
      })
    },
    /** 确定 */
    confirm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let params = { ...this.formData, itemId: this.rowData.id }
          params.confirmQty = params.receiveQty
          delete params.receiveQty
          this.loading = true
          editorReceiveItem(params).then(res => {
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

<style lang="scss" >
.receivingModifyDialog {
  .el-input__inner {
    text-align: left !important;
  }
}
</style>