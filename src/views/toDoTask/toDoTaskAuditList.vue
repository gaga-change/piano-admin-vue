<template>
  <div class="ComponentNameClass">
    <base-list
      ref="baseList"
      :tableConfig="tableConfig"
      :searchConfig="searchConfig"
      :api="listApi"
      :showControl="true"
      :controlWidth="160"
    >
      <template slot-scope="scope">
        <el-link
          type="primary"
          v-if="scope.row.inOutType == 2"
          @click="$router.push({path:`/outwarehousing/pickingtask`,query:{outOrderCode: scope.row.planCode}})"
        >拣货任务</el-link>
        <el-link
          type="primary"
          v-if="scope.row.inOutType == 1"
          @click="$router.push({path:`/inwarehousing/inrecord`,query:{planCode: scope.row.planCode}})"
        >收货单</el-link>
        <template v-if="scope.row.opStatus == 0">
          <el-divider direction="vertical"></el-divider>
          <el-link
            type="primary"
            @click="selectedRow=scope.row;auditDialogFormVisible=true"
          >审核</el-link>
        </template>
      </template>
    </base-list>
    <audit-dialog-form
      :visible.sync="auditDialogFormVisible"
      :row="selectedRow"
      @submited="getTableData()"
    />
  </div>
</template>

<script>
import { inOutStopList } from '@/api'
import auditDialogForm from './components/auditDialogForm'
const tableConfig = [
  { label: '任务ID ', prop: 'taskCode', width: 140 },
  { label: '审核类型 ', prop: 'inOutType', type: 'enum', enum: 'inOutTypeEnum' },
  {
    label: '计划单号',
    prop: 'planCode',
    linkTo: (row) => {
      return row.inOutType == 1 ? `/inwarehousing/inPlanList?planCode=${row.planCode}` : `/outwarehousing/outPlanList?planCode=${row.planCode}`
    },
    width: 140
  },
  { label: '外部订单号', prop: 'busiBillNo' },
  { label: '单据类型', prop: 'busiBillType', type: 'enum', enum: 'busiBillTypeEnum' },
  { label: '审核状态', prop: 'opStatus', type: 'enum', enum: 'opStatusEnum' },
  { label: '审核备注', prop: 'remark' },
  { label: '创建时间', prop: 'gmtCreate', type: 'time', width: 140 },
]
const searchConfig = [
  { label: '审核类型 ', prop: 'inOutType', type: 'enum', enum: 'inOutTypeEnum' },
  { label: '计划单号', prop: 'planCode' },
  { label: '外部订单号', prop: 'busiBillNo' },
  { label: '审核状态', prop: 'opStatus', type: 'enum', enum: 'opStatusEnum' },
  { label: '创建时间', prop: 'createTimeArea', props: ['startDate', 'endDate'], type: 'timeArea' },
]
export default {
  components: { auditDialogForm },
  data() {
    return {
      auditDialogFormVisible: false,
      tableConfig,
      searchConfig,
      listApi: inOutStopList,
      selectedRow: null,
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