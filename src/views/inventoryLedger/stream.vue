<template>
  <div>
    <base-list
      ref="baseList"
      :tableConfig="tableConfig"
      :searchConfig="searchConfig"
      :api="listApi"
    >
    </base-list>
  </div>
</template>

<script>
import { querySkuStockRecord } from '@/api'

const tableConfig = [
  { label: '库位', prop: 'warehouseSpaceCode', width: 80 },
  { label: '业务单号', prop: 'planCode', width: 150 },
  { label: '货主', prop: 'arrivalName', width: 150 },
  { label: '供应商', prop: 'providerName' },
  { label: '商品编码', prop: 'skuCode' },
  { label: '商品名称', prop: 'skuName' },
  { label: '规格型号  ', prop: 'skuFormat' },
  { label: '单位', prop: 'skuUnitName' },
  { label: '变动类型  ', prop: 'busiBillType', type: 'enum', enum: 'busiBillTypeEnum' },
  { label: '变动前数量', prop: 'beforeQty', width: 100 },
  { label: '变动数量', prop: 'changeQty' },
  { label: '变动后数量', prop: 'afterQty', width: 100 },
  { label: '变动时间', prop: 'gmtModify', type: 'time', width: 140 },
]
const searchConfig = [
  { label: '商品编码', prop: 'skuCode' },
  { label: '商品名称', prop: 'skuName' },
  { label: '货主名称', prop: 'ownerName' },
  { label: '库位', prop: 'warehouseSpaceCode' },
  { label: '变动时间', prop: 'createTimeArea', props: ['createBeginDate', 'createEndDate'], type: 'timeArea' },
  { label: '变动类型', prop: 'busiBillType', type: 'enum', enum: 'busiBillTypeEnum' },
]


export default {
  data() {
    return {
      tableConfig,
      searchConfig,
      listApi: querySkuStockRecord,
    }
  },
  methods: {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
</style>