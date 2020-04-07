<template>
  <div class="">
    <!-- 600px【小型，单列】 70% 【中型，双列】-->
    <el-dialog
      title="上架记录"
      :visible="visible"
      width="70%"
      :before-close="handleClose"
      @close="close"
    >
      <div>
        <!-- <detail-item
          :config="detailConfig"
          :detail="detail"
          :labelWidth="100"
        ></detail-item> -->
        <div class="mt20">
          <base-table
            :config="tableConfig"
            :data="tableData"
          >
          </base-table>
        </div>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          :loading="loading"
          @click="close()"
        >关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { jobList } from '@/api'
const detailConfig = [
  { label: '收货单号', prop: 'receiveOrderCode' },
  { label: '入库计划单号', prop: 'planCode' },
  { label: '外部订单号', prop: 'busiBillNo' },
]
const tableConfig = [
  { label: '商品编码', prop: 'skuCode' },
  { label: '商品名称', prop: 'skuName' },
  { label: '规格', prop: 'skuFormat' },
  { label: '型号', prop: 'skuModel' },
  { label: '单位', prop: 'skuUnitCode' },
  { label: '批次', prop: 'batchNo', type: 'batchNoPopover', width: 110 },
  { label: '上架数量', prop: 'jobQty' },
  { label: '库位', prop: 'warehouseSpaceCode' },
  { label: '容器', prop: 'trayCode' },
  { label: '已生成入库单', prop: 'isCreateOrder', type: 'Boolean', width: 100 },
  { label: '上架时间', prop: 'gmtCreate', type: 'time', width: 120, format: 'YYYY-MM-DD  HH:mm' },
  { label: '操作人', prop: 'createrName' },
]
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    /** 数据初始 */
    row: {
      type: Object,
      default: () => null
    }
  },
  computed: {
    /** 防止父级传递 null */
    rowData() {
      return this.row || {}
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.initData()
      }
    },
  },
  data() {
    return {
      detailConfig,
      tableConfig,
      loading: false,
      tableData: [],
      detail: {
        receiveOrderCode: '',
        planCode: '',
        busiBillNo: '',
      },
    }
  },
  methods: {
    /** 初始化表格数据 */
    initData() {
      this.loading = true
      jobList({
        pageNum: 1,
        pageSize: 9999,
        receiveOrderCode: this.rowData.receiveOrderCode
      }).then(res => {
        this.loading = false
        if (!res) return
        this.tableData = res.data.list || []
        let item = this.tableData[0] || {}
        this.detail.receiveOrderCode = item.receiveOrderCode
        this.detail.planCode = item.planCode
        this.detail.busiBillNo = item.busiBillNo
      })
    },
    /** 关闭弹窗 */
    close() {
      // 初始化表单
      // this.$refs['form'] && this.$refs['form'].resetFields()
      // 初始化没有挂载到表单的数据
      // ...
      this.tableData = []
      this.visible && this.$emit('update:visible', false)
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => { })
    }
  }
}
</script>