<template>
  <div class="">
    <base-list
      ref="baseList"
      :tableConfig="tableConfig"
      :searchConfig="searchConfig"
      :api="skuSelect"
      :showControl="true"
      :controlWidth="220"
    >
      <template slot-scope="scope">
        <el-link
          type="primary"
          @click="handleSet(scope.row)"
        >扩展配置</el-link>
        <el-divider direction="vertical"></el-divider>
        <el-link
          type="primary"
          @click="$router.push({path:`/baseInfo/productDetail`,query:{id: scope.row.id}})"
        >查看</el-link>
        <el-divider direction="vertical"></el-divider>
        <el-link
          type="primary"
          @click="$router.push({path:`/baseInfo/productAdd/edit`,query:{id: scope.row.id}})"
        >编辑</el-link>
        <el-divider direction="vertical"></el-divider>
        <el-link
          type="primary"
          @click="handleDelete(scope.row)"
        >删除</el-link>
      </template>
      <template slot="btns">
        <!-- 操作区域 -->
        <el-button
          type="primary"
          @click="$router.push('/baseInfo/productAdd')"
        >创建商品</el-button>
      </template>
    </base-list>
    <product-set-dialog
      :visible.sync="productSetDialogVisible"
      :row="selectedRow"
      @submited="getTableData()"
    />
  </div>
</template>

<script>
import ProductSetDialog from './components/productSetDialog'
import { skuSelect, lotList, deleteSkuById } from '@/api'
const tableConfig = [
  { label: '商品编码 ', prop: 'skuCode' },
  { label: '商品名称 ', prop: 'skuName' },
  { label: '规格', prop: 'lotAttrCode1' },
  { label: '型号', prop: 'lotAttrCode2' },
  { label: '单位', prop: 'lotAttrCode3' },
  { label: '商品分类', prop: 'lotAttrCode6' },
]
const searchConfig = [
  { label: '商品编码', prop: 'skuCode' },
  { label: '商品名称', prop: 'skuName' },
  { label: '规格', prop: 'lotAttrCode1' },
  { label: '型号', prop: 'lotAttrCode2' },
  { label: '批次', prop: 'lotId', type: 'enum', enum: '_lotEnum' },
]
export default {
  components: { ProductSetDialog },
  data() {
    return {
      tableConfig,
      searchConfig,
      skuSelect,
      selectedRow: {},
      productSetDialogVisible: false,
    }
  },
  created() {
    this.initLot()
  },
  methods: {
    initLot() {
      lotList({ pageSize: 9999 }).then(res => {
        if (!res) return
        this.$store.commit('ADD_MAP', {
          name: '_lotEnum',
          keyValue: (res.data.list || []).map(v => {
            return {
              name: v.lotName,
              value: v.id,
            }
          })
        })
      })
    },
    /** 删除 */
    handleDelete(row) {
      this.$apiConfirm(`是否确定删除【${row.skuName}】？`, () => deleteSkuById({ id: row.id })).then(res => {
        if (!res) return
        this.$message.success('操作成功！')
        this.getTableData()
      })
    },
    /** 刷新列表 */
    getTableData() {
      this.$refs['baseList'].fetchData()
    },
    /** 扩展配置 按钮点击 */
    handleSet(row) {
      this.selectedRow = row
      this.productSetDialogVisible = true
    }
  }
}
</script>