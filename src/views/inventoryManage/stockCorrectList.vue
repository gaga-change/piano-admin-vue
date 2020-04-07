<template>
  <div class="ComponentNameClass">
    <base-list
      ref="baseList"
      :tableConfig="tableConfig"
      :searchConfig="searchConfig"
      :api="listApi"
      :showControl="true"
      :controlWidth="80"
    >
      <template slot-scope="scope">
        <el-link
          v-show="scope.row.blockQty === 0"
          type="primary"
          @click="selectedRow=scope.row;stockCorrectDialogFormVisible=true"
        >订正</el-link>
      </template>
      <template slot="btns">
      </template>
    </base-list>
    <stockCorrectDialogForm
      :visible.sync="stockCorrectDialogFormVisible"
      :row="selectedRow"
      @submited="getTableData()"
    />
  </div>
</template>

<script>
import { correctionQueryStockList } from '@/api'
import stockCorrectDialogForm from './components/stockCorrectDialogForm'
const tableConfig = [
  { label: '库位 ', prop: 'warehouseSpaceCode' },
  { label: '商品编码 ', prop: 'skuCode' },
  { label: '商品名称 ', prop: 'skuName' },
  { label: '规格', prop: 'skuFormat' },
  { label: '型号', prop: 'skuModel' },
  { label: '单位', prop: 'skuUnitName' },
  { label: '批次', prop: 'batchNo' },
  { label: '容器 ', prop: 'trayCode' },
  { label: '商品状态', prop: 'checkResult', type: 'enum', enum: 'checkResultEnum' },
  { label: '货主', prop: 'ownerName' },
  { label: '库存量', prop: 'skuQty' },
  { label: '已分配量', prop: 'blockQty' },
]
const searchConfig = [
  { label: '商品编码 ', prop: 'skuCode' },
  { label: '商品名称 ', prop: 'skuName' },
  { label: '规格', prop: 'skuFormat' },
  { label: '型号', prop: 'skuModel' },
  { label: '货主', prop: 'ownerName' },
  { label: '库位', prop: 'warehouseSpaceCode' },
  { label: '商品状态', prop: 'checkResult', type: 'enum', enum: 'checkResultEnum' },
  { label: '批次规则', prop: 'batchNo', type: 'batchRule' },
]
export default {
  components: { stockCorrectDialogForm },
  data() {
    return {
      stockCorrectDialogFormVisible: false,
      tableConfig,
      searchConfig,
      listApi: correctionQueryStockList,
      // 可选 附加查询条件
      appendSearchParams: {},
      selectedRow: null,
    }
  },
  methods: {
    /** 刷新列表 */
    getTableData() {
      this.$refs['baseList'].fetchData()
    },
    /** 可选 返回列表添加字段 */
    parseData(res) {
      let data = res.data.list || []
      let total = res.data.total
      data.forEach(v => {
      })
      return { data, total }
    },
  }
}
</script>