<template>
  <div
    class=""
    v-loading="pickOrderDetailLoading"
  >
    <div>
      <el-card shadow="never">
        <div slot="header">
          基本信息
        </div>
        <detail-item
          :config="detailItemConfig"
          :detail="detail"
          :labelWidth="100"
        />
      </el-card>
      <el-card
        shadow="never"
        class="mt20"
      >
        <div slot="header">
          拣货明细任务
        </div>
        <base-table
          :config="tableConfig"
          :data="tableData"
          :showControl="true"
          controlName="操作"
          :controlWidth="160"
          inrecordDetail
          :select="false"
        >
          <template slot-scope="scope">
            <!-- orderStatus:  未执行 - 0,执行中 - 1,全部执行 - 2,已终止 - 3 -->
            <!-- jobStatus:   未执行 - 0,未执行 - 1,未执行 - 2,未执行 - 3,已完成 - 4,已作废 - 5,异常作业 - 6,暂停作业 - 8 -->
            <!-- 单据（未执行、执行中） 明细（未执行） -->
            <template v-if="(detail.orderStatus == 0 || detail.orderStatus == 1) && scope.row.jobStatus < 4">
              <el-link
                type="primary"
                @click="handleDetail(scope.row)"
              >拣货</el-link>
              <el-divider direction="vertical"></el-divider>
            </template>
            <!-- 单据（未执行、执行中） 明细（未执行）
            单据（执行中, 全部执行） 明细（已完成）
             -->
            <el-link
              v-if=" ((detail.orderStatus == 0 || detail.orderStatus == 1) && scope.row.jobStatus < 4)
              || ( (detail.orderStatus == 1 || detail.orderStatus == 2) && scope.row.jobStatus == 4)
              "
              type="primary"
              @click="handlePickStop(scope.row)"
            >终止拣货</el-link>
          </template>
        </base-table>
      </el-card>
    </div>
    <!-- 拣货 & 详情 -->
    <pick-detail-dialog
      :visible.sync="pickDetailDialogVisible"
      :row="detailSelectedRow"
      @submited="initDetail()"
    />
  </div>
</template>

<script>
import pickDetailDialog from './components/pickDetailDialog'
import { pickOrderDetail, orderPickConfirm, outWarehouseJobDel } from '@/api'
const detailItemConfig = [
  { label: '拣货单号', prop: 'orderCode' },
  { label: '出库计划单号', prop: 'planCode' },
  { label: '外部订单号', prop: 'busiBillNo' },
  { label: '拣货状态', prop: 'orderStatus', type: 'enum', enum: 'orderStatusEnum', width: 90 },
  { label: '创建时间', prop: 'gmtCreate', type: 'time' },
]
const tableConfig = [
  { label: '商品编码', prop: 'skuCode' },
  { label: '商品名称', prop: 'skuName' },
  { label: '规格', prop: 'skuFormat' },
  { label: '型号', prop: 'skuModel' },
  { label: '批次', prop: 'batchNo', type: 'batchNoPopover', width: 110 },
  { label: '通知拣货数', prop: 'sortQty', width: 90 },
  { label: '已拣货数', prop: 'realSortQty' },
  { label: '执行状态', prop: 'jobStatus', type: 'enum', enum: 'jobStatusList' },
  { label: '容器', prop: 'trayCode' },
  { label: '货位', prop: 'warehouseSpaceCode' },
]
export default {
  components: { pickDetailDialog },
  data() {
    return {
      id: this.$route.query.id,
      pickDetailDialogVisible: false,
      pickOrderDetailLoading: false,
      tableConfig,
      detailItemConfig,
      tableData: [],
      detail: {},
      detailSelectedRow: {},
    }
  },
  created() {
    this.initDetail()
  },
  methods: {
    /** 获取详情 */
    initDetail() {
      this.pickOrderDetailLoading = true;
      const id = this.$route.query.id
      pickOrderDetail(id).then(res => {
        this.pickOrderDetailLoading = false
        if (!res) return
        res.data.pickOrderDetailVOList.forEach(item => {
          item.sum = item.warehouseSpaceCode + ':' + (item.jobQty || 0)
          item.realSortQty = item.realSortQty || 0
          item.number = item.jobQty || 0
        })
        this.detail = res.data
        this.tableData = res.data.pickOrderDetailVOList || [];
      })
    },
    /** 子详情 按钮点击 */
    handleDetail(row) {
      row._detail_orderCode = this.detail.orderCode
      row._detail_id = this.detail.pickOrderId
      this.detailSelectedRow = row;
      this.pickDetailDialogVisible = true
    },
    /** 终止拣货 点击 */
    handlePickStop(row) {
      this.$apiConfirm('确定要终止操作码？', () => outWarehouseJobDel({ jobId: row.outJobId })).then(res => {
        if (!res) return
        this.$message.success('操作成功！')
        this.initDetail()
      })
    },
  }
}
</script>