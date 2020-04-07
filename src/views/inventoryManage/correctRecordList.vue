<template>
  <div class="ComponentNameClass">
    <base-list
      ref="baseList"
      :tableConfig="tableConfig"
      :searchConfig="searchConfig"
      :api="listApi"
      :showControl="false"
      :controlWidth="160"
      :parseData="parseData"
    >
      <template slot="btns">
        <el-button
          type="primary"
          @click="handleOutput"
        >
          导出
        </el-button>
      </template>
    </base-list>
  </div>
</template>

<script>
import { stockCorrectionList, stockCorrectionRecordExport } from '@/api'
const tableConfig = [
  { label: '订正单号 ', prop: 'orderCode', width: 140 },
  { label: '库位 ', prop: 'warehouseSpaceCode' },
  { label: '容器 ', prop: 'trayCode' },
  { label: '商品编码 ', prop: 'skuCode' },
  { label: '商品名称 ', prop: 'skuName' },
  { label: '规格', prop: 'skuFormat' },
  { label: '型号', prop: 'skuModel' },
  { label: '单位', prop: 'skuUnitName' },
  { label: '批次', prop: 'batchNo', type: 'batchNoPopover', width: 110 },
  { label: '商品状态', prop: 'checkResult', type: 'enum', enum: 'checkResultEnum' },
  { label: '货主', prop: 'ownerName' },
  { label: '订正前数量', prop: 'beforeQty' },
  { label: '订正数量', prop: 'revisalQty' },
  { label: '订正后数量', prop: 'afterQty' },
  { label: '订正人', prop: 'createrName' },
  { label: '创建时间', prop: 'gmtCreate', type: 'time', width: 140 },
]
const searchConfig = [
  { label: '商品编码 ', prop: 'skuCode' },
  { label: '商品名称 ', prop: 'skuName' },
  { label: '规格', prop: 'skuFormat' },
  { label: '型号', prop: 'skuModel' },
  { label: '货主', prop: 'ownerName' },
  { label: '商品状态', prop: 'checkResult', type: 'enum', enum: 'checkResultEnum' },
  { label: '库位', prop: 'warehouseSpaceCode' },
  { label: '创建时间', prop: 'createTimeArea', props: ['startDate', 'endDate'], type: 'timeArea' },
]
export default {
  data() {
    return {
      tableConfig,
      searchConfig,
      listApi: stockCorrectionList,
      // 可选 附加查询条件
      appendSearchParams: {},
    }
  },
  methods: {
    /** 刷新列表 */
    getTableData() {
      this.$refs['baseList'].fetchData()
    },
    /** 可选 返回列表添加字段 */
    parseData(res) {
      let data = res.data.list || []
      let total = res.data.total
      data.forEach(v => {
        v.afterQty = Number(v.afterQty) || 0
        v.beforeQty = Number(v.beforeQty) || 0
        v.revisalQty = v.afterQty - v.beforeQty
      })
      return { data, total }
    },
    /** 导出 */
    handleOutput() {
      stockCorrectionRecordExport(this.$refs['baseList'].searchParams)
    }
  }
}
</script>