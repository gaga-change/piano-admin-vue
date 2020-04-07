<template>
  <div class="PickingTaskComponent">
    <base-list
      ref="baseList"
      :tableConfig="tableConfig"
      :searchConfig="searchConfig"
      :api="listApi"
      :showControl="true"
      :controlWidth="150"
      :labelWidth="120"
    >
      <template slot-scope="scope">
        <el-link
          type="primary"
          @click="$router.push({path:`/outwarehousing/pickingTaskDetail`,query:{id: scope.row.id}})"
        >详情</el-link>
        <el-divider direction="vertical"></el-divider>
        <el-link
          type="primary"
          @click="handePrint(scope.row, 'Printing')"
        >打印拣货单</el-link>
      </template>
      <template slot="btns">
      </template>
    </base-list>
    <!-- 打印 -->
    <pick-print-dialog
      :visible.sync="pickPrintDialogVisible"
      :row="printSelectedRow"
    />
  </div>
</template>

<script>
import moment from 'moment';
import { pickOrderList } from '@/api'
import pickPrintDialog from './components/pickPrintDialog'

const tableConfig = [
  { label: '拣货单号', prop: 'orderCode', width: 140 },
  { label: '计划单号 ', prop: 'planCode', width: 140 },
  { label: '外部订单号', prop: 'busiBillNo' },
  { label: '通知拣货数', prop: 'pickQty' },
  { label: '已拣货数', prop: 'realPickQty' },
  { label: '拣货状态', prop: 'orderStatus', type: 'enum', enum: 'orderStatusEnum' },
  { label: '已生成出库单', prop: 'isCreateOrder', type: 'enum', enum: 'yesOrNoEnum' },
  { label: '创建时间', prop: 'gmtCreate', type: 'time', width: 140 },
]
const searchConfig = [
  { label: '拣货单号', prop: 'orderCode' },
  { label: '外部订单号', prop: 'busiBillNo' },
  { label: '拣货状态', prop: 'orderStatus', type: 'enum', enum: 'orderStatusEnum' },
  { label: '是否已生成出库单', prop: 'isCreateOrder', type: 'radio', radio: 'yesOrNoEnum' },
  { label: '出库计划单号', prop: 'outOrderCode' },
  { label: '创建时间', prop: 'createTimeArea', props: ['startDate', 'endDate'], type: 'timeArea' },
]

export default {
  components: { pickPrintDialog },
  data() {
    return {
      pickPrintDialogVisible: false,
      tableConfig,
      searchConfig,
      listApi: pickOrderList,
      printSelectedRow: {},
    }
  },
  methods: {
    moment,
    /** 刷新列表 */
    getTableData() {
      this.$refs['baseList'].fetchData()
    },
    /** 打印拣货单 按钮点击 */
    handePrint(row) {
      this.printSelectedRow = row;
      this.pickPrintDialogVisible = true
    },
  },
}
</script>