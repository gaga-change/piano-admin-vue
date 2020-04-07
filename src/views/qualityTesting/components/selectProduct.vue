<template>
  <div class="SelectProductCom">
    <el-dialog
      title="选择收货单"
      :visible="visible"
      width="80%"
      :before-close="handleClose"
      @close="close"
    >
      <div class="">
        <double-list
          ref="doubleList"
          :tableConfig="tableConfig"
          :searchConfig="searchConfig"
          :api="listApi"
          :showControl="false"
          :controlWidth="160"
          @childSelectionChange="childSelectionChange"
          :childApi="childApi"
          :childTableConfig="childTableConfig"
          :childSelect="true"
        >
        </double-list>
      </div>
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
import { queryReceiverOrder, orderDetailList } from '@/api'

const childTableConfig = [
  { label: '业务行号', prop: 'busiIndex', },
  { label: '商品编码', prop: 'skuCode', },
  { label: '商品名称', prop: 'skuName', },
  { label: '规格型号', prop: 'skuFormat', },
  { label: '单位', prop: 'skuUnitName', },
  { label: '商品数量', prop: 'planQty', },
  { label: '收货数量', prop: 'receiveQty', width: 100 },
]
const tableConfig = [
  { label: '收货单号', prop: 'orderCode', width: 140 },
  { label: '计划单号', prop: 'planCode', width: 140 },
  { label: '状态', prop: 'execStatus', type: 'enum', enum: 'execStatusEnum' },
  { label: '收货时间', prop: 'gmtCreate', type: 'time', width: 140 },
  { label: '单据类型', prop: 'orderType', type: 'enum', enum: 'busiBillTypeEnum' },
  { label: '货主', prop: 'ownerName' },
  { label: '供应商', prop: 'providerName' },
  { label: '操作人', prop: 'createrName' },
]
const searchConfig = [
  { label: '收货单号', prop: 'orderCode' },
  { label: '收货时间', prop: 'createTimeArea', props: ['startDate', 'endDate'], type: 'timeArea' },
]

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    selectData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      tableConfig,
      searchConfig,
      childTableConfig,
      listApi: queryReceiverOrder,
      selectRows: [],
    }
  },
  methods: {
    /** 子表内容获取 */
    childApi(row) {
      return orderDetailList(row.id).then(res => {
        if (!res || !res.data) return
        res.data = res.data || []
        return res.data.map(item => {
          item.orderCode = row.orderCode
          item.checkResult = 2
          item.rowId = row.id
          return item
        })
      })
    },
    /** 刷新列表 */
    getTableData() {
      this.$refs['doubleList'].fetchData()
    },
    /** 子表多选 */
    childSelectionChange(selectRows, mainRow) {
      this.selectRows = selectRows
    },
    /** 确认 */
    confrim() {
      this.$emit('update:selectData', [...this.selectRows])
      // this.selectRows = []
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
  .el-dialog__body {
    padding: 10px 20px;
  }
  .el-form-item {
    margin-bottom: 10px;
  }
}
</style>
