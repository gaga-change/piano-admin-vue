<template>
  <div>
    <double-list
      ref="doubleList"
      :tableConfig="tableConfig"
      :searchConfig="searchConfig"
      :labelWidth="100"
      :api="listApi"
      :showControl="true"
      :controlWidth="80"
      @childSelectionChange="childSelectionChange"
      :childApi="childApi"
      :childTableConfig="childTableConfig"
      :selectTables="true"
      :childSelectable="childSelectable"
      @updateList="toggleRowExpansion=false"
    >
      <template slot-scope="scope">
        <el-link
          :disabled="scope.row.sortStatus != 1"
          type="primary"
          @click="handleClose(scope.row)"
        >完结</el-link>
      </template>
      <template slot="btns">
        <el-button @click="handleToggleRowExpansion">{{toggleRowExpansion ? '收起': '展开'}}所有计划单</el-button>
        <operation-button
          v-if="false"
          :childSelectRows="childSelectRows"
          @submited="getTableData"
        />
        <el-button
          type="primary"
          :loading="pickOrderAddByAutoLoading"
          @click="handleAutoAssignPicking"
        >自动分配拣货任务</el-button>
        <el-button
          type="primary"
          @click="handleAssignPicking"
        >手动分配拣货任务</el-button>
        <el-button
          type="primary"
          @click="$router.push('/outwarehousing/outPlanAdd')"
        >新建计划单</el-button>
      </template>
    </double-list>
  </div>
</template>

<script>
import { getInfoPlanOutWarehousing, planOutDetail, pickOrderAddByAuto, panOutEnd } from '@/api'
import operationButton from './components/operationButton'

const childTableConfig = [
  { label: '序号', prop: 'index' },
  { label: '商品编码', prop: 'skuCode' },
  { label: '商品名称', prop: 'skuName' },
  { label: '规格', prop: 'skuFormat' },
  { label: '型号', prop: 'skuModel' },
  { label: '单位', prop: 'skuUnitName' },
  { label: '计划量', prop: 'planOutQty' },
  { label: '通知拣货量', prop: 'sortQty' },
  { label: '已出库量', prop: 'realOutQty' },
  { label: '出库状态', prop: 'outStatusStr' },
  { label: '备注', prop: 'remarkInfo' },
]
const tableConfig = [
  { label: '出库计划单号', prop: 'planCode', width: 150 },
  { label: '外部订单号', prop: 'busiBillNo' },
  { label: '状态', prop: 'sortStatus', type: 'enum', enum: 'sortStatusEnum', },
  { label: '单据类型', prop: 'busiBillType', type: 'enum', enum: 'busiBillTypeEnum' },
  { label: '货主', prop: 'ownerName' },
  { label: '客户', prop: 'arrivalName' },
  { label: '收货人', prop: 'arrivalLinkName' },
  { label: '联系电话', prop: 'arrivalLinkTel' },
  { label: '收货地址', prop: 'arrivalAddress' },
  { label: '下单时间', width: 140, prop: 'gmtCreate', type: 'time', width: 140 },
]
const searchConfig = [
  { label: '出库计划单号', prop: 'planCode' },
  { label: '外部订单号', prop: 'busiBillNo' },
  { label: '状态', prop: 'sortStatus', type: 'enum', enum: 'sortStatusEnum' },
  { label: '单据类型', prop: 'busiBillType', type: 'enum', enum: 'busiBillTypeEnum' },
  { label: '货主', prop: 'ownerName' },
  { label: '下单时间', prop: 'createTimeArea', props: ['createBeginDate', 'createEndDate'], type: 'timeArea' },
]
export default {
  components: { operationButton },
  data() {
    return {
      pickOrderAddByAutoLoading: false,
      tableConfig,
      searchConfig,
      childTableConfig,
      listApi: getInfoPlanOutWarehousing,
      childSelectRows: [],
      toggleRowExpansion: false,
    }
  },
  methods: {
    // 展开或收起 点击事件
    handleToggleRowExpansion() {
      this.toggleRowExpansion = !this.toggleRowExpansion
      this.$refs['doubleList'].toggleRowExpansionAll(this.toggleRowExpansion)
    },
    /** 完结 按钮点击事件 */
    handleClose(row) {
      this.$apiConfirm('确认完结该计划单', () => panOutEnd({ planId: row.id })).then(res => {
        if (!res) return
        this.$message.success('操作成功！')
        this.getTableData()
      })
    },
    /** 子表可选条件 */
    childSelectable(row) {
      return row.planOutQty !== row.sortQty && row._sortStatus != 9
    },
    /** 子表内容获取 */
    childApi(row) {
      return planOutDetail({ planCode: row.planCode }).then(res => {
        if (!res) return []
        let temp = res.data || []
        return temp.map((v, index) => {
          v.index = index + 1
          v._planCode = row.planCode
          v._gmtCreate = row.gmtCreate
          v._busiBillNo = row.busiBillNo
          v._sortStatus = row.sortStatus
          return v
        })
      })
    },
    /** 刷新列表 */
    getTableData() {
      this.$refs['doubleList'].fetchData()
    },
    /** 子表多选 */
    childSelectionChange(selectRowsAndMainRow) {
      let temp = []
      selectRowsAndMainRow.forEach(({ selectRows, mainRow }) => {
        temp.push(...selectRows.map(v => {
          return {
            planCode: mainRow.planCode,
            ownerCode: mainRow.ownerCode,
            ...v,
          }
        }))
      })
      this.childSelectRows = temp
    },
    /** 手动分配 按钮点击 */
    handleAssignPicking() {
      if (!this.childSelectRows.length) {
        return this.$message.warning('请勾选计划单下的商品！')
      }
      let planCodes = []
      this.childSelectRows.forEach(v => planCodes.push(v._planCode))
      planCodes = [...new Set(planCodes)]
      if (planCodes.length > 1) {
        return this.$message.error('手动分配，计划单不可多选')
      }
      this.$router.push({
        path: '/outwarehousing/assignPickingTasks',
        query: {
          ids: this.childSelectRows.map(v => v.id).join(','),
          billNos: this.childSelectRows.map(v => v.billNo).join(','),
          gmtCreate: this.childSelectRows[0]._gmtCreate,
          busiBillNo: this.childSelectRows[0]._busiBillNo,
          planCode: planCodes[0],
        }
      })
    },
    /** 自动分配拣货任务 按钮点击 */
    handleAutoAssignPicking() {
      if (!this.childSelectRows.length) {
        return this.$message.warning('请勾选计划单下的商品！')
      }
      this.pickOrderAddByAutoLoading = true
      pickOrderAddByAuto({
        pickType: 0,
        planDetailIdList: this.childSelectRows.map(v => v.id)
      }).then(res => {
        this.pickOrderAddByAutoLoading = false
        if (!res) return
        this.$message.success('拣货单创建成功')
        this.getTableData()
      })
    }
  }
}
</script>

