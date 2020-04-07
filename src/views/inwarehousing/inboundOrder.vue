<template>
  <div class="InboundOrderComponent">
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
          @click="$router.push({path: '/inwarehousing/inboundOrderDetail', query: {id: scope.row.id}})"
        >详情</el-link>
      </template>
      <template slot="btns">
      </template>
    </base-list>
  </div>
</template>

<script>
import { inOrderList } from '@/api'

const tableConfig = [
  { label: '计划单号', prop: 'planCode', width: 140 },
  { label: '外部订单号', prop: 'busiBillNo' },
  { label: '入库单号', prop: 'orderCode', width: 140 },
  { label: '单据类型', prop: 'orderType', type: 'enum', enum: 'busiBillTypeEnum' },
  { label: '入库日期', prop: 'gmtCreate', type: 'time', width: 140 },
  { label: '推送状态', prop: 'isPush', type: 'enum', enum: 'isPushStateEnum' },
  { label: '货主', prop: 'ownerName' },
  { label: '供应商', prop: 'providerName' },
  { label: '操作人', prop: 'createrName' },
]
const searchConfig = [
  { label: '计划单号', prop: 'planCode' },
  { label: '入库单号', prop: 'orderCode' },
  { label: '外部订单号', prop: 'busiBillNo' },
  { label: '货主', prop: 'ownerName' },
  { label: '供应商名称', prop: 'providerName' },
  { label: '入库日期', prop: 'createTimeArea', props: ['orderStartDate', 'orderEndDate'], type: 'timeArea' },
  { label: '推送状态', prop: 'isPush', type: 'enum', enum: 'isPushStateEnum' },
]

export default {
  data() {
    return {
      tableConfig,
      searchConfig,
      listApi: inOrderList,
    }
  },
  methods: {

  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.InboundOrderComponent {
  .routerLink {
    color: #3399ea;
    white-space: nowrap;
    margin-right: 10px;
    cursor: pointer;
  }

  .link_dom {
    color: rgb(51, 153, 234);
    cursor: pointer;
  }

  .alertInfo {
    margin-bottom: 12px;
    > span {
      font-size: 14px;
      padding-right: 20px;
    }
  }
}
</style>

