<template>
  <div class="SelectProductCom">
    <el-dialog
      title="选择盘点商品"
      :visible="visible"
      width="70%"
      :before-close="handleClose"
      @close="close"
    >
      <div class="mb10">
        <div class="c-red f12 mb5">提示：排、列、层用于缩小已选的库区库位数据范围，如库位为A010903，01为排，09为列，03为层</div>
        <el-card shadow="never">
          <el-form
            ref="form"
            :inline="true"
            :model="formData"
          >
            <el-form-item label="类型">
              {{mapConfig['takeStockTypeEnum'] && mapConfig['takeStockTypeEnum'].find(v => v.value == orderType).name}}
            </el-form-item>
            <el-form-item
              label="商品编码"
              prop="skuCode"
              v-show="orderType === 0"
            >
              <el-input
                size="mini"
                v-model="formData.skuCode"
                maxlength="30"
                placeholder="请输入商品编码"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="商品名称"
              prop="skuName"
              v-show="orderType === 0"
            >
              <el-input
                size="mini"
                maxlength="30"
                v-model="formData.skuName"
                placeholder="请输入商品名称"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="库区库位"
              class="form-item-block"
              prop="warehouseAreaSpace"
            >
              <el-cascader
                style="width: 100%"
                :props="cascaderProps"
                @change="handleCascaderChange"
                v-model="formData.warehouseAreaSpace"
                placeholder="请选择库区库位"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="排">
              <el-input
                size="mini"
                style="width:70px"
                v-model="formData.rowStart"
                maxlength="10"
                placeholder="请输入"
              ></el-input>
              <span>至</span>
              <el-input
                size="mini"
                style="width:70px"
                v-model="formData.rowEnd"
                maxlength="10"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
            <el-form-item label="列">
              <el-input
                size="mini"
                style="width:70px"
                v-model="formData.columnStart"
                maxlength="10"
                placeholder="请输入"
              ></el-input>
              <span>至</span>
              <el-input
                size="mini"
                style="width:70px"
                v-model="formData.columnEnd"
                maxlength="10"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="层"
              prop="layer"
            >
              <el-input
                size="mini"
                style="width:70px"
                v-model="formData.layerStart"
                maxlength="10"
                placeholder="请输入"
              ></el-input>
              <span>至</span>
              <el-input
                size="mini"
                style="width:70px"
                v-model="formData.layerEnd"
                maxlength="10"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                size="mini"
                type="primary"
                @click="submitForm"
              >查询</el-button>
              <el-button
                size="mini"
                @click="resetForm"
              >重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
      <div v-if="visible">
        <select-table
          ref='baseTable'
          :config="takeStockSelectProductTableConfig"
          :parseData="parseData"
          :api="planInventoryQuerysSkuStockList"
          :searchParams="searchParams"
          :tableData.sync="tableData"
          @lastSearchParams="lastParams => nowSearchParams = lastParams"
        />
      </div>
      <!-- <el-alert
        v-if="orderType === 0"
        class="mt15"
        title="注：最多选取50条，如需盘点更多商品，请分批处理！"
        type="info"
        :closable="false"
      >
      </el-alert> -->
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          size="mini"
          @click="close"
        >取 消</el-button>
        <el-button
          size="mini"
          type="primary"
          :loading="confrimLoading"
          @click="confrim"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { planInventoryQuerysSkuStockList, warehouseAreaList, warehouseSpaceSelectByAreaCode } from '@/api'
import { takeStockSelectProductTableConfig } from './config'
import SelectTable from './selectTable'
export default {
  components: { SelectTable },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    orderType: {
      type: Number,
      default: 0
    },
    selectData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    let vm = this
    return {
      confrimLoading: false,
      formData: {
        skuName: '',
        skuCode: '',
        rowStart: '',
        rowEnd: '',
        columnStart: '',
        columnEnd: '',
        layerStart: '',
        layerEnd: '',
        warehouseAreaSpace: undefined,
        warehouseSpaceCodeList: [],
      },
      takeStockSelectProductTableConfig,
      selectRows: [],
      tableData: [],
      planInventoryQuerysSkuStockList,
      nowSearchParams: {},
      cascaderProps: {
        lazy: true,
        multiple: true,
        expandTrigger: 'hover',
        lazyLoad(node, resolve) {
          const { level } = node;
          if (level === 0) {
            warehouseAreaList({
              warehouseCode: vm.$store.getters.chooseWarehouse
            }).then(res => {
              if (res) {
                let codes = res.data.map(v => v.warehouseAreaCode)
                const nodes = codes.map(code => {
                  return {
                    value: code,
                    label: `库区${code}`,
                    leaf: level >= 1
                  }
                })
                resolve(nodes)
              } else {
                resolve([])
              }
            })
          }
          if (level === 1) {
            warehouseSpaceSelectByAreaCode({ warehouseAreaCode: node.data.value }).then(res => {
              if (res) {
                const nodes = res.data.map(v => {
                  return {
                    value: v.warehouseSpaceCode,
                    label: `库位${v.warehouseSpaceCode}`,
                    leaf: true
                  }
                })
                resolve(nodes)
              } else {
                resolve([])
              }
            })
          }
          if (level === 2) {
            resolve([])
          }
        },
      },
    }
  },
  computed: {
    ...mapGetters([
      'mapConfig'
    ]),
    searchParams() {
      let data = { ...this.formData }
      delete data.warehouseAreaSpace
      if (this.orderType === 1) {
        data.isDynamicCheck = 1
      }
      data.queryTempArea = 0
      return data
    }
  },
  watch: {
    visible(val) {
      if (val) {
        // 恢复选中的内容
        this.selectRows = [...this.selectData]
      }
    }
  },
  created() {
  },
  methods: {
    /** 级联选择change 事件 */
    handleCascaderChange(val) {
      this.formData.warehouseSpaceCodeList = val.map(v => {
        return v[1]
      })
      this.$nextTick(() => {
        this.submitForm()
      })
    },
    parseData(res) {
      return {
        data: res.data.list.map(v => {
          v.areaSpceCode = (v.warehouseAreaCode || '') + '/' + (v.warehouseSpaceCode || '')
          return v
        }),
        total: res.data.total
      }
    },
    /** 查询 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$refs['baseTable'].fetchData()
        }
      })
    },
    /** 重置 */
    resetForm() {
      this.$refs['form'] && this.$refs['form'].resetFields()
      Object.keys(this.formData).forEach(key => {
        this.$set(this.formData, key, undefined)
      })
      this.formData.warehouseSpaceCodeList = []
      this.$nextTick(() => {
        this.$refs['baseTable'] && this.$refs['baseTable'].fetchData()
      })
    },
    /** 确认 */
    confrim() {
      const end = () => {
        // 根据库区库位进行排序
        this.$emit('update:selectData', [...this.selectRows].sort((a, b) => {
          if (a.warehouseAreaCode === b.warehouseAreaCode) {
            return b.warehouseSpaceCode > a.warehouseSpaceCode ? -1 : 1
          } else {
            return b.warehouseAreaCode > a.warehouseAreaCode ? 1 : -1
          }
        }))
        this.selectRows = []
        this.close()
      }
      this.confrimLoading = true
      planInventoryQuerysSkuStockList({
        pageNum: 1,
        pageSize: 9999,
        ...this.nowSearchParams
      }).then(res => {
        this.confrimLoading = false
        if (!res) return
        this.selectRows = (res.data.list || []).map(v => {
          v.areaSpceCode = (v.warehouseAreaCode || '') + '/' + (v.warehouseSpaceCode || '')
          return v
        })
        end()
      })
    },
    /** 关闭 */
    close() {
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
<style lang="scss">
.SelectProductCom {
  .el-card__body {
    padding: 10px 10px 0 10px;
  }
  .el-dialog__body {
    padding: 10px 20px;
  }
  .el-form-item {
    margin-bottom: 10px;
  }
  .form-item-block {
    display: flex;
    .el-form-item__content {
      flex: 1;
    }
  }
}
</style>
