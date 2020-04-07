<template>
  <div class="ComponentNameClass">
    <base-list
      ref="baseList"
      :tableConfig="tableConfig"
      :searchConfig="searchConfig"
      :api="listApi"
      :showControl="true"
      :controlWidth="160"
    >
      <template slot-scope="scope">
        <el-link
          type="primary"
          @click="$router.push({path:`/qualityTesting/detail`,query:{id: scope.row.id}})"
        >详情</el-link>
        <el-divider direction="vertical"></el-divider>
      </template>
      <template slot="btns">
        <el-button
          type="primary"
          size="mini"
          @click="handleCreate"
        >
          新建商品
        </el-button>
      </template>
    </base-list>
    <FormDialog
      :visible.sync="dialogVisible"
      :row="selectedRow"
      @submited="getTableData()"
    />
  </div>
</template>

<script>
import FormDialog from './commodityFormDialog'
import { commodityList } from '@/api'
const tableConfig = [
  { label: '商品名称', prop: 'name', width: 140 },
  { label: '售价', prop: 'price', width: 140 },
  { label: '进价', prop: 'costPrice' },
  { label: '库存', prop: 'stock' },
  { label: '备注', prop: 'remark' },
]
const searchConfig = [
  { label: '商品名称', prop: 'name', width: 140 },
  { label: '备注', prop: 'remark' },
]
export default {
  components: { FormDialog },
  data() {
    return {
      dialogVisible: false,
      selectedRow: null,
      tableConfig,
      searchConfig,
      listApi: commodityList,
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
        v.updateLockStatusOutLoading = false
        v.updateLockStatusInLoading = false
      })
      return { data, total }
    },
    /** 新建 */
    handleCreate() {
      this.dialogVisible = true
      // this.$router.push({ path: '/qualityTesting/create' })
    },
    /** 删除 */
    handleDelete(row) {
      // this.$apiConfirm(`是否确定删除【${row.name}】？`, () => enumsDel(row.id)).then(res => {
      //   if (!res) return
      //   this.$message.success('操作成功！')
      //   this.getTableData()
      // })
    },
  }
}
</script>