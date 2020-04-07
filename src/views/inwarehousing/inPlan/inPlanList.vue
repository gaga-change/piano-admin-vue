<template>
  <div>
    <double-list
      ref="doubleList"
      :tableConfig="tableConfig"
      :searchConfig="searchConfig"
      :api="listApi"
      :showControl="true"
      :childApi="childApi"
      :childTableConfig="childTableConfig"
      :childSelect="false"
      :childShowIndex="true"
      :select="true"
      @selectionChange="selectionChange"
      :selectable="selectable"
      :labelWidth="100"
    >
      <template slot-scope="scope">
        <el-link
          :disabled="scope.row.receiveStatus != 1"
          type="primary"
          @click="handleClose(scope.row)"
        >完结</el-link>
      </template>
      <template slot="btns">
        <el-button
          type="primary"
          :disabled="!selectRows.length"
          @click="handleCreateReceiveOrder"
          :loading="createReceiveOrderLoading"
        >
          创建收货单
        </el-button>
        <el-button
          type="primary"
          @click="$router.push('/inwarehousing/inPlanAdd')"
        >
          创建计划单
        </el-button>
      </template>
    </double-list>
  </div>
</template>

<script>
import { getInfoWarehousing, getInfoDetailWarehousing, createReceiveOrder, planInEnd } from '@/api'

const childTableConfig = [
  { label: '商品编码', prop: 'skuCode', width: 150 },
  { label: '商品名称', prop: 'skuName', width: 150 },
  { label: '规格', prop: 'skuFormat' },
  { label: '型号', prop: 'skuModel' },
  { label: '单位', prop: 'skuUnitCode' },
  { label: '计划量', prop: 'planInQty' },
  { label: '收货待确认量', prop: 'unconfirmReceiveQty' },
  { label: '已收货量', prop: 'confirmedReceiveQty' },
]
const tableConfig = [
  { label: '入库计划单号 ', prop: 'planCode', width: 140 },
  { label: '外部订单号', prop: 'busiBillNo' },
  { label: '状态', prop: 'receiveStatus', type: 'enum', enum: 'receiveStateEnum' },
  { label: '单据类型', prop: 'busiBillType', type: 'enum', enum: 'busiBillTypeEnum_in' },
  { label: '货主', prop: 'ownerName' },
  { label: '供应商', prop: 'providerName' },
  { label: '下单时间', prop: 'gmtCreate', type: 'time', width: 140 },
]
const searchConfig = [
  { label: '入库计划单号 ', prop: 'planCode' },
  { label: '外部订单号', prop: 'busiBillNo' },
  { label: '状态', prop: 'receiveStatus', type: 'enum', enum: 'receiveStateEnum' },
  { label: '供应商', prop: 'providerName' },
  { label: '货主', prop: 'ownerName' },
  { label: '单据类型', prop: 'busiBillType', type: 'enum', enum: 'busiBillTypeEnum_in' },
  { label: '下单时间', prop: 'createTimeArea', props: ['createBeginDate', 'createEndDate'], type: 'timeArea' },
]

export default {
  data() {
    return {
      tableConfig,
      searchConfig,
      childTableConfig,
      listApi: getInfoWarehousing,
      selectRows: [],
      createReceiveOrderLoading: false,
    }
  },
  methods: {
    /** 完结按钮点击事件 */
    handleClose(row) {
      this.$apiConfirm('确认完结该计划单', () => planInEnd({
        planId: row.id
      })).then(res => {
        if (!res) return
        this.$message.success('操作成功！')
        this.getTableData()
      })
    },
    /** 子表内容获取 */
    childApi(row) {
      return getInfoDetailWarehousing({ planCode: row.planCode }).then(res => {
        if (!res || !res.data) return
        return res.data.inWarehousePlanDetailRespList || []
      })
    },
    /** 可选条件 */
    selectable(row) {
      return row.receiveStatus == 0 || row.receiveStatus == 1
    },
    /** 清除选中 */
    clearSelection() {
      this.$refs['doubleList'].clearSelection()
    },
    /** 刷新列表 */
    getTableData() {
      this.$refs['doubleList'].fetchData()
    },
    /** 主表多选 */
    selectionChange(selectRows) {
      this.selectRows = [...selectRows]
    },
    /** 创建收货单 */
    handleCreateReceiveOrder() {
      this.createReceiveOrderLoading = true
      createReceiveOrder(this.selectRows.map(v => ({
        planOrderId: v.id,
        planOrderCode: v.planCode
      }))).then(res => {
        this.createReceiveOrderLoading = false
        if (!res) return
        this.$message.success('收货单创建完成！3秒后将自动跳转收货单列表页。')
        this.clearSelection()
        setTimeout(() => {
          this.$router.push('/inwarehousing/inrecord')
        }, 3000);
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
</style>