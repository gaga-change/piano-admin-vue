<template>
  <div>
    <el-button
      size="mini"
      type="primary"
      @click="priviewBoxLabel()"
    >
      打印出库明细
    </el-button>
    <print-table-dialog
      :visible.sync="printTableDialogVisible"
      printTitle="出库明细"
      title="打印出库明细"
      :topConfig="printTopConfig"
      :tableConfig="printTableConfig"
      :detail="detail"
      :tableData="childData"
    >
      <div style="display:flex">
        <div> <span>出库人：___________</span> </div>
        <div
          class="text-right"
          style="flex: 1"
        > <span>签收人：___________</span> </div>
      </div>
    </print-table-dialog>
  </div>
</template>
<script>
import moment from 'moment'

const printTopConfig = [
  { label: '外部订单号', prop: 'busiBillNo' },
  { label: '客户编码', prop: 'customerCode' },
  { label: '客户名称', prop: 'customerName' },
  { label: '客户地址', prop: 'arrivalAddress' },
]

const printTableConfig = [// 计划单打印列表
  { label: '计划单号', prop: 'planCode' },
  { label: '商品编码', prop: 'skuCode' },
  { label: '商品名称', prop: 'skuName' },
  { label: '规格', prop: 'skuFormat' },
  { label: '型号', prop: 'skuModel' },
  { label: '数量', prop: 'outQty' },
  { label: '单位', prop: 'skuUnitCode' },
]

export default {
  data() {
    return {
      printTableConfig,
      printTopConfig,
      printTableDialogVisible: false,
    }
  },
  props: {
    childSelectRows: {
      type: Array,
      default: () => []
    },
    mainRow: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    childData() {
      let temp = this.childSelectRows || []
      let mainRow = this.mainRow || {}
      return temp.map(v => ({ ...mainRow, ...v }))
    },
    detail() {
      return this.mainRow || {}
    }
  },
  methods: {
    //打印出库明细
    priviewBoxLabel() {
      if (!this.childData.length) {
        this.$message({ type: 'error', message: '未选择子表里商品' });
        return
      }
      this.printTableDialogVisible = true
    },
  }
}
</script>
