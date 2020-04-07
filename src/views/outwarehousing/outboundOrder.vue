<template>
  <div>
    <base-list
      ref="baseList"
      :tableConfig="tableConfig"
      :searchConfig="searchConfig"
      :api="listApi"
      :showControl="true"
      :controlWidth="80"
    >
      <template slot-scope="scope">
        <el-link
          type="primary"
          @click="$router.push({path:'/outwarehousing/outboundOrderDetail', query: {id: scope.row.id}})"
        >详情</el-link>
      </template>
      <template slot="btns">
      </template>
    </base-list>
  </div>
</template>

<script>
import { getInfoOutWarehousing } from '@/api'

const tableConfig = [
  { label: '出库时间', prop: 'gmtCreate', type: 'time', width: 140 },
  { label: '出库单号', prop: 'orderCode', width: 140 },
  { label: '计划单号', prop: 'planCode', width: 140 },
  { label: '外部订单号', prop: 'busiBillNo', width: 90 },
  { label: '推送状态', prop: 'isPush', type: 'enum', enum: 'isPushStateEnum' },
  { label: '单据类型', prop: 'orderType', type: 'enum', enum: 'busiBillTypeEnum' },
  { label: '单据状态', prop: 'orderStatus', type: 'enum', enum: 'outboundOrderStatus' },
  { label: '货主', prop: 'ownerName', },
  { label: '操作人', prop: 'createrName' },
]
const searchConfig = [
  { label: '计划单号', prop: 'planCode' },
  { label: '出库单号', prop: 'orderCode' },
  { label: '外部订单号', prop: 'busiBillNo' },
  { label: '单据状态', prop: 'orderStatus', type: 'enum', enum: 'outboundOrderStatus' },
  { label: '货主', prop: 'ownerName' },
  { label: '出库时间', prop: 'createTimeArea', props: ['startDate', 'endDate'], type: 'timeArea' },
  { label: '推送状态', prop: 'isPush', type: 'enum', enum: 'isPushStateEnum' },
]

export default {
  data() {
    return {
      tableConfig,
      searchConfig,
      listApi: getInfoOutWarehousing,
      mainRow: {},
      nowRow: {}
    }
  },
  methods: {
    /** 刷新列表 */
    getTableData() {
      this.$refs['baseList'].fetchData()
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
</style>