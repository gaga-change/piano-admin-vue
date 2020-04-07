<template>
  <div class="">
    <el-dialog
      :title="`拣货单详情 ( 拣货单号:${rowData._detail_orderCode} ) `"
      :visible="visible"
      width="1000px"
      :before-close="handleClose"
      @close="close"
    >
      <div v-loading="pickOrderDetailLoading">
        <base-table
          :config="tableConfig"
          :data="tableData"
          :showControl="true"
          controlName="输入拣货数量"
          :controlWidth="160"
          :select="true"
          @selectionChange="selectionChange"
          :selectable="selectable"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.jobStatus <= 3">
              <el-input-number
                placeholder="拣货数量"
                v-model="scope.row.number"
                :precision="0"
                :min="1"
                :max="Number(scope.row.sortQty) || 0"
                controls-position="right"
              ></el-input-number>
            </div>
          </template>
        </base-table>
      </div>
      <!-- <el-alert
        class="mt15"
        title="温馨提示："
        type="info"
        :closable="false"
      >
        <p>举例，商品最小单位默认为1,4个最小单位为一个内包装【一个内包装数量为4】，
          2个内包装为1箱【一箱数量8】，10箱为一个容器【一容器数量为80】</p>
      </el-alert> -->
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          @click="close()"
          size="mini"
        >取 消</el-button>
        <el-button
          type="primary"
          size="mini"
          :loading="loading"
          :disabled="pickOrderDetailLoading"
          @click="confirm()"
        >确认拣货</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { orderPickConfirm } from '@/api'
const tableConfig = [
  { label: '计划单号', prop: 'planCode', width: 140 },
  { label: '外部订单号', prop: 'busiBillNo', width: 90 },
  { label: '商品编码', prop: 'skuCode' },
  { label: '商品名称', prop: 'skuName' },
  { label: '规格', prop: 'skuFormat' },
  { label: '型号', prop: 'skuModel' },
  { label: '批次', prop: 'batchNo' },
  { label: '通知拣货数', prop: 'sortQty', width: 90 },
  { label: '已拣货数', prop: 'realSortQty' },
  { label: '执行状态', prop: 'jobStatus', type: 'enum', enum: 'jobStatusList' },
  { label: '容器', prop: 'trayCode' },
  { label: '货位', prop: 'sum' },
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
      default: {}
    }
  },
  computed: {
    /** 防止父级传递 null */
    rowData() {
      return this.row || {}
    }
  },
  watch: {
    /** 监听数据切换，重置表单 */
    rowData(val) {
      this.selectRows = []
      this.initDetail()
    }
  },
  data() {
    return {
      tableConfig,
      pickOrderDetailLoading: false,
      tableData: [],
      loading: false,
      selectRows: []
    }
  },
  methods: {
    /** 确定 */
    confirm() {
      if (this.selectRows.length === 0) {
        return this.$message.error('请先选择商品！')
      }
      if (this.selectRows.find(v => !v.number)) {
        return this.$message.error('数量不能为0！')
      }
      let json = {};
      json.pickConfirmItemReqList = this.selectRows
      json.planCode = this.selectRows[0].planCode;
      json.pickOrderId = this.rowData._detail_id;
      this.selectRows.forEach(v => {
        v.realSortStocks = {}
        v.realSortStocks[v.stockId] = v.number
      })
      this.loading = true
      orderPickConfirm(json).then(res => {
        this.loading = false
        if (!res) return
        this.$message({ type: 'success', message: '操作成功，可以去出库暂存页面查看' })
        this.$emit('submited')
        this.close()
      })
    },
    /** 筛选 可选的列表 */
    selectable(row, index) {
      return !(row.jobStatus > 3)
    },
    /** 主表多选 */
    selectionChange(selectRows) {
      this.selectRows = [...selectRows]
    },
    /** 获取详情 */
    initDetail() {
      this.tableData = [this.rowData].map(item => {
        item.sum = item.warehouseSpaceCode + ':' + item.sortQty
        item.realSortQty = item.realSortQty || 0
        item.number = item.sortQty || 0
        return item
      })
    },
    /** 关闭弹窗 */
    close() {
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