<template>
  <div class="ComponentNameClass">
    <base-list
      ref="baseList"
      :tableConfig="tableConfig"
      :searchConfig="searchConfig"
      :api="listApi"
      :showControl="false"
      :labelWidth="100"
    >
      <template slot="btns">
        <el-button
          type="primary"
          size="mini"
          @click="handleOutput"
        >
          导出
        </el-button>
      </template>
    </base-list>
  </div>
</template>

<script>
import { selectSumReceiveDetail, receiveOrderExportLedger } from '@/api'
const tableConfig = [
  { label: '收货单号 ', prop: 'receiveOrderCode', width: 140 },
  { label: '入库计划单号 ', prop: 'planCode', width: 140 },
  { label: '外部订单号', prop: 'busiBillNo' },
  { label: '供应商', prop: 'providerName' },
  { label: '状态', prop: 'execStatus', type: 'enum', enum: 'execStatusEnum' },
  { label: '商品编码', prop: 'skuCode' },
  { label: '商品名称', prop: 'skuName' },
  { label: '规格', prop: 'skuFormat' },
  { label: '型号', prop: 'skuModel' },
  { label: '单位', prop: 'skuUnitCode' },
  { label: '预期收货量', prop: 'planQty' },
  { label: '实际收货量', prop: 'receiveQty' },
]
const searchConfig = [
  { label: '收货单号 ', prop: 'receiveOrderCode' },
  { label: '入库计划单号 ', prop: 'planCode' },
  { label: '供应商', prop: 'providerName' },
  { label: '外部订单号', prop: 'busiBillNo' },
  { label: '状态', prop: 'execStatus', type: 'enum', enum: 'execStatusEnum' },
]
export default {
  data() {
    return {
      tableConfig,
      searchConfig,
      listApi: selectSumReceiveDetail,
    }
  },
  methods: {
    /** 刷新列表 */
    getTableData() {
      this.$refs['baseList'].fetchData()
    },
    /** 导出 */
    handleOutput() {
      receiveOrderExportLedger(this.$refs['baseList'].searchParams)
    }
  }
}
</script>