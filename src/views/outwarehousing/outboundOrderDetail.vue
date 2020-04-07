<template>
  <div v-loading="outWarehouseOrderDetailLoading">
    <div class="mb20">
      <!-- 收货中 & 已激活 可见 -->
      <el-button
        type="primary"
        @click="printMark()"
        :loading="receiveConfirmLoading"
      >
        打印装箱唛头
      </el-button>
      <el-button
        type="primary"
        v-if="detail.isPush == 2"
        @click="handleTryPush"
      >
        手动推送
      </el-button>
    </div>
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
        <div style="display:flex;align-items: center;">
          <span>商品明细</span>
          <print-out-plan-detail-button
            class="ml15"
            :childSelectRows="childSelectRows"
            :mainRow="detail"
          />
        </div>
      </div>
      <base-table
        :config="detailDOsConfig"
        :data="detail.outWarehouseOrderDetailVoList"
        :showControl="false"
        :controlWidth="160"
        :select="true"
        @selectionChange="selectionChange"
      >
      </base-table>
    </el-card>
    <el-card
      shadow="never"
      class="mt20"
    >
      <div slot="header">
        出库明细
      </div>
      <base-table
        :config="detailItemDosConfig"
        :data="detail.outWarehouseJobVOList"
        :showControl="false"
      >
      </base-table>
    </el-card>
    <print-mark-dialog
      :visible.sync="printMarkDialogVisible"
      :row="nowRow"
      title="打印装箱唛头"
    ></print-mark-dialog>
  </div>
</template>
<script>
import printMarkDialog from './components/printMarkDialog'
import printOutPlanDetailButton from './components/printOutPlanDetailButton'
import { outWarehouseOrderDetail, outWarehouseOrderTryPush } from '@/api'

const detailItemConfig = [
  { label: '出库单号', prop: 'orderCode', width: 140 },
  { label: '出库计划单号', prop: 'planCode', width: 140 },
  { label: '外部订单号', prop: 'busiBillNo', width: 90 },
  { label: '单据类型', prop: 'orderType', type: 'enum', enum: 'busiBillTypeEnum' },
  { label: '推送状态', prop: 'isPush', type: 'enum', enum: 'isPushStateEnum' },
  { label: '单据状态', prop: 'orderStatus', type: 'enum', enum: 'outboundOrderStatus' },
  { label: '货主', prop: 'ownerName', },
  { label: '创建人', prop: 'createrName' },
  { label: '创建时间', prop: 'gmtCreate', type: 'time', width: 140 },
]
const detailDOsConfig = [
  { label: '商品编码', prop: 'skuCode' },
  { label: '商品名称', prop: 'skuName' },
  { label: '规格', prop: 'skuFormat' },
  { label: '型号', prop: 'skuModel' },
  { label: '单位', prop: 'skuUnitCode' },
  { label: '数量', prop: 'outQty' },
]
const detailItemDosConfig = [
  { label: '商品编码', prop: 'skuCode' },
  { label: '商品名称', prop: 'skuName' },
  { label: '规格', prop: 'skuFormat' },
  { label: '型号', prop: 'skuModel' },
  { label: '单位', prop: 'skuUnitCode' },
  { label: '批次', prop: 'batchNo', type: 'batchNoPopover', width: 110 },
  { label: '商品状态', prop: 'checkResult', type: 'enum', enum: 'checkResultEnum' },
  { label: '出库数量', prop: 'realSortQty' },
  { label: '库位', prop: 'warehouseSpaceCode' },
  { label: '容器', prop: 'trayCode' },
]

export default {
  components: { printMarkDialog, printOutPlanDetailButton },
  data() {
    return {
      printMarkDialogVisible: false,
      outWarehouseOrderDetailLoading: true,
      receiveConfirmLoading: false,
      detailItemConfig,
      detailDOsConfig,
      detailItemDosConfig,
      detail: {
        outWarehouseJobVOList: [],
        outWarehouseOrderDetailVoList: []
      },
      nowRow: null,
      modifyRow: null,
      childSelectRows: [],
    }
  },
  created() {
    this.initData()
  },
  methods: {
    /** 手动推送点击事件 */
    handleTryPush() {
      this.$apiConfirm('是否确定要进行手动推送？', () => outWarehouseOrderTryPush(this.detail.id)).then(res => {
        if (!res) return
        this.$message.success('操作成功！')
        this.initData()
      })
    },
    /** 获取详情内容 */
    initData() {
      this.outWarehouseOrderDetailLoading = true
      outWarehouseOrderDetail(this.$route.query.id).then(res => {
        this.outWarehouseOrderDetailLoading = false
        if (!res) return
        res.data.outWarehouseJobVOList = res.data.outWarehouseJobVOList || []
        res.data.outWarehouseOrderDetailVoList = res.data.outWarehouseOrderDetailVoList || []
        this.detail = res.data
      })
    },
    /** 编辑 按钮点击 */
    handleModify(row) {
      this.receivingModifyDialogVisible = true
      this.modifyRow = row
    },
    /** 打印麦头 */
    printMark(row) {
      this.nowRow = { ...this.detail }
      this.printMarkDialogVisible = true
    },
    /** 子表多选 */
    selectionChange(selectRows) {
      this.childSelectRows = selectRows
    },
  },
}
</script>