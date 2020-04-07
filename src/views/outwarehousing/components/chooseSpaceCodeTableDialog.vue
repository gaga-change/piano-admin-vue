<template>
  <div class="">
    <!-- 600px【小型，单列】 70% 【中型，双列】-->
    <el-dialog
      title="选择库存"
      :visible="visible"
      width="80%"
      :before-close="handleClose"
      @close="close"
    >
      <div v-if="visible && appendSearchParams.skuCode">
        <base-list
          ref="baseList"
          :tableConfig="tableConfig"
          :searchConfig="searchConfig"
          :appendSearchParams="appendSearchParams"
          :api="listApi"
          :parseData="parseData"
          :showControl="false"
          :btnInline="true"
        >
          <template slot="btns">
            <div class="text-right mr20">应出库数量：{{showNum}}</div>
          </template>
        </base-list>
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
        <el-button @click="close()">取 消</el-button>
        <el-button
          type="primary"
          :loading="loading"
          @click="confirm()"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { planInventoryQuerysSkuStockList } from '@/api'
const tableConfig = [
  { label: '商品编码', prop: 'skuCode' },
  { label: '商品名称', prop: 'skuName' },
  { label: '规格', prop: 'skuFormat' },
  { label: '型号', prop: 'skuModel' },
  { label: '单位', prop: 'skuUnitName' },
  { label: '批次', prop: 'batchNo' },
  { label: '容器', prop: 'trayCode' },
  { label: '库位', prop: 'warehouseSpaceCode' },
  { label: '可用库存', prop: 'skuQty' },
  { label: '入库时间', prop: 'lastInTime', type: 'time', width: 140 },
  { label: '通知拣货量', prop: 'number', edit: true, inputType: 'number2', min: 1, maxKey: 'skuQty', width: 200 },
]
const searchConfig = [
  { label: '批次', prop: 'batchNo' },
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
    },
    /** 应出库数量 */
    showNum() {
      if (this.row) {
        let planOutQty = Number(this.row.planOutQty) || 0
        let sortQty = Number(this.row.sortQty) || 0
        return planOutQty - sortQty
      } else {
        return 0
      }
    }
  },
  watch: {
    /** 监听数据切换 */
    visible(val) {
      if (!val) return
      this.appendSearchParams.skuCode = this.rowData.skuCode
    }
  },
  data() {
    return {
      tableConfig,
      searchConfig,
      listApi: planInventoryQuerysSkuStockList,
      // 可选 附加查询条件
      appendSearchParams: { skuCode: undefined, queryTempArea: 0, fileCanQtyZero: 1, outLockFlag: 0 },
      loading: false,
    }
  },
  methods: {
    /** 可选 返回列表添加字段 */
    parseData(res) {
      let data = res.data.list || []
      let total = res.data.total
      data.forEach(v => {
        v.skuQty = Number(v.skuQty) || 0
        v.blockQty = Number(v.blockQty) || 0
        v.skuQty = v.skuQty - v.blockQty
        v.inputTypeNumberDisabled = !v.skuQty
      })
      return { data, total }
    },
    /** 确定 */
    confirm() {
      let tableData = this.$refs['baseList'].tableData
      this.$emit('submited', JSON.parse(JSON.stringify(tableData)))
      this.close()
    },
    /** 刷新列表 */
    getTableData() {
      this.$refs['baseList'].fetchData()
    },
    /** 关闭弹窗 */
    close() {
      // 初始化表单
      // this.$refs['form'] && this.$refs['form'].resetFields()
      // 初始化没有挂载到表单的数据
      // ...
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