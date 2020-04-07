<template>
  <div class="TemporaryStorageComponent clearfix">
    <el-card
      shadow="never"
      body-style="padding:12px"
      class="confirmstyle"
    >
      <confirm-search
        ref='confirmSearch'
        @submit="submit"
        :searchForm="searchForm"
      />
    </el-card>
    <div class="right-area">
      <el-col
        :span="24"
        style="margin-bottom:12px;"
      >
        <el-button
          type="primary"
          size="mini"
          @click="handleCreateOutOrder"
        >复核(生成出库单)</el-button>
      </el-col>
      <base-table
        :loading="loading"
        :config="tableConfig"
        :data="tableData"
      />
    </div>
  </div>
</template>

<script>
import confirmSearch from './components/confirmSearch'
import { selectNotCreateOrderList, createOutWareHouseOrder } from '@/api'

const tableConfig = [
  { label: '拣货单号', prop: 'pickOrderCode', width: 140 },
  { label: '计划单号', prop: 'planCode', width: 140 },
  { label: '外部订单号', prop: 'busiBillNo', width: 90 },
  { label: '商品编码', prop: 'skuCode' },
  { label: '商品名称', prop: 'skuName' },
  { label: '规格', prop: 'skuFormat' },
  { label: '型号', prop: 'skuModel' },
  { label: '批次', prop: 'batchNo', type: 'batchNoPopover', width: 110 },
  { label: '容器', prop: 'trayCode' },
  { label: '通知拣货数', prop: 'sortQty' },
  { label: '已拣货数', prop: 'realSortQty' },
  { label: '是否已生成出库单', prop: 'isCreateOrder', type: 'Boolean', width: 120 },
  { label: '执行状态', prop: 'sortStatusStr' },
  { label: '库位', prop: 'warehouseSpaceCode' },
]

export default {
  components: { confirmSearch },
  data() {
    return {
      searchForm: {
        pickOrderCode: '',
        isCreateOrder: 0
      },
      loading: false,
      tableConfig,
      tableData: [],
      total: 0,
      pageIndex: 1,
      pageSize: 10,
      currentPage: 1,
      isShow: false
    }
  },
  methods: {
    /** 点击计划单号，刷新列表 */
    submit(value) {
      this.searchForm.pickOrderCode = value
      this.getCurrentTableData()
    },
    /** 复核（生成出库单） 按钮点击 */
    handleCreateOutOrder() {
      let pickOrderCodeSet = new Set()
      let selectRows = [...this.tableData]
      selectRows.forEach(v => {
        pickOrderCodeSet.add(v.pickOrderCode)
      })
      this.$apiConfirm(`确定要为 ${[...pickOrderCodeSet].join('，')} 生成出库单吗?`, () => createOutWareHouseOrder(
        { sortTaskIds: selectRows.map(v => v.id) }
      )).then(res => {
        if (!res) return
        this.$message({ type: 'success', message: '操作成功' })
        this.$refs['confirmSearch'].initData()
      })
    },
    /** 刷新左侧列表 */
    getCurrentTableData() {
      if (!this.searchForm.pickOrderCode) {
        return this.tableData = []
      }
      this.loading = true;
      selectNotCreateOrderList(this.searchForm).then(res => {
        this.loading = false;
        if (!res) return
        this.tableData = res.data || []
      })
    }
  },
}
</script>

<style rel="stylesheet/scss" lang="scss" >
.TemporaryStorageComponent {
  .right-area {
    margin-left: 280px;
    position: sticky;
    top: 97px;
  }
  .tableBtnBox {
    font-size: 12px;
    color: #3399ea;
    span {
      margin-right: 12px;
      cursor: pointer;
      &:last-child {
        margin-right: 0;
      }
    }
  }
  .confirmstyle {
    float: left;
    width: 260px;
    min-height: 400px;
  }
}
</style>