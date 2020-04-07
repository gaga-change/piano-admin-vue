<template>
  <div class="ComponentNameClass">
    <base-list
      ref="baseList"
      :tableConfig="tableConfig"
      :searchConfig="searchConfig"
      :api="listApi"
      :showControl="true"
      :appendSearchParams="appendSearchParams"
    >
      <template slot-scope="scope">
        <el-link
          type="primary"
          @click="handleUp(scope.row)"
          v-if="scope.row.isPut == 0 || scope.row.isPut == 1"
        >
          上架
        </el-link>
        <el-divider
          direction="vertical"
          v-if="scope.row.isPut == 1"
        ></el-divider>
        <el-link
          type="primary"
          @click="nowRow=scope.row;recordListDialogVisible=true;"
          v-if="scope.row.isPut == 1 || scope.row.isPut == 2"
        >
          上架记录
        </el-link>
      </template>
    </base-list>
    <putaway-dialog
      :visible.sync="putawayDialogVisible"
      :row="nowRow"
      @submited="getTableData"
    />
    <recordListDialog
      :visible.sync="recordListDialogVisible"
      :row="nowRow"
      @submited="getTableData()"
    />
  </div>
</template>

<script>
import { selectReceiveDetailItem } from '@/api'
import putawayDialog from './components/putawayDialog'
import recordListDialog from './components/recordListDialog'

const tableConfig = [
  { label: '收货单号', prop: 'receiveOrderCode', width: 140 },
  { label: '商品编码', prop: 'skuCode' },
  { label: '商品名称', prop: 'skuName', width: '200' },
  { label: '规格', prop: 'skuFormat' },
  { label: '型号', prop: 'skuModel' },
  { label: '单位', prop: 'skuUnitName' },
  { label: '批次', prop: 'batchNo', type: 'batchNoPopover', width: 110 },
  { label: '容器', prop: 'trayCode' },
  { label: '实际收货量', prop: 'receiveQty' },
  { label: '已上架数量', prop: 'realInQty' },
  { label: '上架状态', prop: 'isPut', type: 'enum', enum: 'isPutEnum' },
  { label: '收货时间', prop: 'gmtCreate', type: 'time', width: 140 },
]
const searchConfig = [
  { label: '商品编码', prop: 'skuCode' },
  { label: '商品名称', prop: 'skuName' },
  { label: '规格', prop: 'skuFormat' },
  { label: '型号', prop: 'skuModel' },
  { label: '容器', prop: 'trayCode' },
  { label: '上架状态', prop: 'isPut', type: 'enum', enum: 'isPutEnum' },
  { label: '收货单号', prop: 'receiveOrderCode' },
  { label: '批次规则', prop: 'batchNo', type: 'batchRule' },
]

export default {
  components: { putawayDialog, recordListDialog },
  data() {
    return {
      tableConfig,
      searchConfig,
      listApi: selectReceiveDetailItem,
      recordListDialogVisible: false,
      putawayDialogVisible: false,
      nowRow: {},
      appendSearchParams: { receiveExecStatus: 2 },
    }
  },
  methods: {
    /** 刷新列表 */
    getTableData() {
      this.$refs['baseList'].fetchData()
    },
    /** 上架按钮点击 */
    handleUp(row) {
      this.putawayDialogVisible = true
      this.nowRow = row
    }
  }
}
</script>