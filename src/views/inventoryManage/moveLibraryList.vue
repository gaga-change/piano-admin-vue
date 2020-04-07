<template>
  <div class="ComponentNameClass">
    <base-list
      ref="baseList"
      :tableConfig="tableConfig"
      :searchConfig="searchConfig"
      :api="listApi"
      :parseData="parseData"
      :showControl="true"
      :controlWidth="80"
    >
      <template slot-scope="scope">
        <el-link
          v-show="scope.row.showMoveBtn"
          type="primary"
          @click="selectedRow=scope.row; moveLibraryDialogFormVisible=true"
        >移库</el-link>
      </template>
    </base-list>
    <move-library-dialog-form
      :visible.sync="moveLibraryDialogFormVisible"
      :row="selectedRow"
      @submited="getTableData()"
    />
  </div>
</template>

<script>
import { getInfoInventory } from '@/api'
import moveLibraryDialogForm from './components/moveLibraryDialogForm'
const tableConfig = [
  { label: '库区', prop: 'warehouseAreaCode' },
  { label: '库位', prop: 'warehouseSpaceCode' },
  { label: '商品编码 ', prop: 'skuCode' },
  { label: '商品名称 ', prop: 'skuName' },
  { label: '规格', prop: 'skuFormat' },
  { label: '型号', prop: 'skuModel' },
  { label: '单位', prop: 'skuUnitName' },
  { label: '批次', prop: 'batchNo' },
  { label: '容器', prop: 'trayCode' },
  { label: '商品状态', prop: 'checkResult', type: 'enum', enum: 'checkResultEnum' },
  { label: '货主', prop: 'ownerName' },
  { label: '库存量', prop: 'skuQty' },
  { label: '已分配量', prop: 'blockQty' },
]
const searchConfig = [
  { label: '库区', prop: 'warehouseAreaCode' },
  { label: '库位', prop: 'warehouseSpaceCode' },
  { label: '商品编码 ', prop: 'skuCode' },
  { label: '商品名称 ', prop: 'skuName' },
  { label: '规格', prop: 'skuFormat' },
  { label: '型号', prop: 'skuModel' },
  { label: '货主', prop: 'ownerName' },
  { label: '批次规则', prop: 'batchNo', type: 'batchRule' },
]
export default {
  components: { moveLibraryDialogForm },
  data() {
    return {
      tableConfig,
      searchConfig,
      listApi: getInfoInventory,
      moveLibraryDialogFormVisible: false,
      selectedRow: null,
      // 可选 附加查询条件
      appendSearchParams: {},
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
        // 库存量 = 已分配量时，移库不可见
        v.showMoveBtn = Number(v.skuQty) !== Number(v.blockQty)
        // 数量 = 库存量-已分配量
        v.number = Number(Number(v.skuQty) - Number(v.blockQty)) || 0
      })
      return { data, total }
    },
  }
}
</script>