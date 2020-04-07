<template>
  <div class="">
    <base-list
      ref="baseList"
      :tableConfig="tableConfig"
      :searchConfig="searchConfig"
      :labelWidth="90"
      :api="listApi"
      :showControl="true"
      :controlWidth="160"
      :select="true"
      @selectionChange="selectionChange"
      :selectable="() => true"
    >
      <template slot-scope="scope">
        <el-link
          type="primary"
          @click="$router.push({path:`/inwarehousing/inrecordDetail`,query:{id: scope.row.id}})"
        >详情</el-link>
        <template v-if="scope.row.execStatus === 0">
          <el-divider direction="vertical"></el-divider>
          <el-link
            type="primary"
            @click="handleClose(scope.row)"
          >终止</el-link>
        </template>
        <template v-if="scope.row.execStatus === 2">
          <el-divider direction="vertical"></el-divider>
          <el-link
            type="primary"
            @click="handleActive(scope.row)"
          >激活</el-link>
        </template>
        <template v-if="scope.row.execStatus === 1 || scope.row.execStatus === 3">
          <el-divider direction="vertical"></el-divider>
          <el-link
            type="primary"
            @click="$router.push({path:`/inwarehousing/inrecordDetail`,query:{id: scope.row.id}})"
          >收货确认</el-link>
        </template>
      </template>
      <template slot="btns">
        <el-tooltip
          class="item"
          effect="dark"
          content="导出当前选中记录"
          placement="top"
        >
          <el-button
            type="primary"
            size="mini"
            :disabled="!selectRows.length"
            @click="printOrder"
          >
            打印单据
          </el-button>
        </el-tooltip>
      </template>
    </base-list>
    <inrecord-print-dialog
      :visible.sync="inrecordPrintDialogVisible"
      :rows="selectRows"
    ></inrecord-print-dialog>
  </div>
</template>

<script>
import { receiveOrderList, receiveOrderActivate, stopReceiveOrder } from '@/api'
import inrecordPrintDialog from './components/inrecordPrintDialog'

const tableConfig = [
  { label: '收货单号 ', prop: 'orderCode', width: 140 },
  { label: '入库计划单号 ', prop: 'planCode', width: 140 },
  { label: '外部订单号', prop: 'busiBillNo' },
  { label: '状态', prop: 'execStatus', type: 'enum', enum: 'execStatusEnum' },
  { label: '单据类型', prop: 'orderType', type: 'enum', enum: 'busiBillTypeEnum' },
  { label: '货主', prop: 'ownerName' },
  { label: '供应商', prop: 'providerName' },
  { label: '创建人', prop: 'createrName' },
  { label: '创建时间', prop: 'gmtCreate', type: 'time', width: 140 },
]
const searchConfig = [
  { label: '收货单号', prop: 'orderCode' },
  { label: '入库计划单号', prop: 'planCode' },
  { label: '货主', prop: 'ownerName' },
  { label: '供应商', prop: 'providerName' },
  { label: '单据类型', prop: 'orderType', type: 'enum', enum: 'busiBillTypeEnum' },
  { label: '状态', prop: 'execStatus', type: 'enum', enum: 'execStatusEnum' },
  { label: '外部订单号', prop: 'busiBillNo' },
  { label: '创建时间', prop: 'createTimeArea', props: ['startDate', 'endDate'], type: 'timeArea' },
]

export default {
  components: { inrecordPrintDialog },
  data() {
    return {
      tableConfig,
      searchConfig,
      listApi: receiveOrderList,
      selectRows: [],
      inrecordPrintDialogVisible: false,
      appendSearchParams: {},
    }
  },
  methods: {
    /** 终止按钮点击事件 */
    handleClose(row) {
      this.$apiConfirm('确认终止该收货单', () => stopReceiveOrder({ id: row.id })).then(res => {
        if (!res) return
        this.$message.success('操作成功！')
        this.getTableData()
      })
    },
    /** 打印单据 */
    printOrder() {
      this.inrecordPrintDialogVisible = true
    },
    /** 刷新列表 */
    getTableData() {
      this.$refs['baseList'].fetchData()
    },
    /** 主表多选 */
    selectionChange(selectRows) {
      this.selectRows = [...selectRows]
    },
    /** 激活 */
    handleActive(row) {
      this.$apiConfirm('是否确定激活？', () => receiveOrderActivate({ id: row.id })).then(res => {
        if (!res) return
        this.$message.success('操作成功！')
        this.getTableData()
      })
    },
    /** 可选 返回列表添加字段 */
    parseData(res) {
      let data = res.data.list || []
      let total = res.data.total
      data.forEach(v => {
        v.updateLockStatusOutLoading = false
        v.updateLockStatusInLoading = false
      })
      return { data, total }
    },
    /** 新建 */
    handleCreate() {
      this.$router.push({ path: '/qualityTesting/create' })
    }
  }
}
</script>