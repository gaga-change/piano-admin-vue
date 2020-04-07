<template>
  <div class="SelectProductCom">
    <el-dialog
      title="添加商品"
      :visible="visible"
      width="70%"
      :before-close="handleClose"
      @close="close"
    >
      <div class="mb10">
        <el-card shadow="never">
          <el-form
            ref="form"
            :inline="true"
            :model="formData"
          >
            <el-form-item
              label="商品编码"
              prop="skuCode"
            >
              <el-input
                size="mini"
                v-model="formData.skuCode"
                placeholder="请输入商品编码"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="商品名称"
              prop="skuName"
            >
              <el-input
                size="mini"
                v-model="formData.skuName"
                placeholder="请输入商品名称"
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
          :api="skuSelect"
          :select="true"
          :selectTotal="true"
          :selectRows.sync="selectRows"
          :searchParams="searchParams"
          :tableData.sync="tableData"
        />
      </div>
      <el-alert
        class="mt15"
        title="注：最多选取50条，如需添加更多商品，请分批处理！"
        type="info"
        :closable="false"
      >
      </el-alert>
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
          @click="confrim"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { skuSelect } from '@/api'
import SelectTable from './selectTable'

export const takeStockSelectProductTableConfig = [
  { label: '商品编码 ', prop: 'skuCode' },
  { label: '商品名称 ', prop: 'skuName' },
  { label: '规格', prop: 'lotAttrCode1' },
  { label: '型号', prop: 'lotAttrCode2' },
  { label: '单位', prop: 'lotAttrCode3' },
]
export default {
  components: { SelectTable },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    selectData: {
      type: Array,
      default: () => []
    },
    ownerCode: {
      type: String,
    }
  },
  data() {
    let vm = this
    return {
      formData: {
        // ownerCode:
        skuCode: undefined,
        skuName: undefined
      },
      takeStockSelectProductTableConfig,
      selectRows: [],
      tableData: [],
      skuSelect,
    }
  },
  computed: {
    ...mapGetters([
      'mapConfig'
    ]),
    searchParams() {
      let data = { ...this.formData }
      // 在这里添加 货主code
      data.ownerCode = this.ownerCode
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
    parseData(res) {
      return {
        data: res.data.list.map(v => {
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
      this.formData.warehouseSpaceCodeList = []
      this.$nextTick(() => {
        this.$refs['baseTable'] && this.$refs['baseTable'].fetchData()
      })
    },
    /** 确认 */
    confrim() {
      // 根据库区库位进行排序
      this.$emit('update:selectData', [...this.selectRows].sort((a, b) => {
        if (a.skuCode === b.skuCode) {
          return b.skuName > a.skuName ? -1 : 1
        } else {
          return b.skuCode < a.skuCode ? 1 : -1
        }
      }))
      this.selectRows = []
      this.close()
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
