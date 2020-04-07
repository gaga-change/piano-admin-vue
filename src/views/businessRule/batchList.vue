<template>
  <div class="ComponentNameClass">
    <base-list
      ref="baseList"
      :tableConfig="tableConfig"
      :searchConfig="searchConfig"
      :api="listApi"
      :showControl="true"
      :controlWidth="180"
    >
      <template slot-scope="scope">
        <el-link
          type="primary"
          @click="$router.push({path:`/businessRule/batchDetail`,query:{id: scope.row.id}})"
        >查看</el-link>
        <el-divider direction="vertical"></el-divider>
        <el-link
          type="primary"
          @click="handleChangeStatus(scope.row)"
        >{{scope.row.status === 0 ? '禁用' : '启用'}}</el-link>
        <el-divider direction="vertical"></el-divider>
        <el-link
          type="primary"
          @click="$router.push({path:`/baseInfo/productList`,query:{lotId: scope.row.id}})"
        >关联商品</el-link>
      </template>
      <template slot="btns">
        <el-button
          type="primary"
          size="mini"
          @click="handleCreate"
        >
          新增
        </el-button>
      </template>
    </base-list>
  </div>
</template>

<script>
import { lotList, lotUpdateStatus } from '@/api'
const tableConfig = [
  { label: '批次描述', prop: 'lotName' },
  { label: '状态', prop: 'status', type: 'enum', enum: 'lotStatusEnum' },
  { label: '创建人', prop: 'createrName' },
  { label: '创建时间', prop: 'gmtCreate', type: 'time', width: 140 },
]
const searchConfig = [
  { label: '批次描述', prop: 'lotName' },
]
export default {
  data() {
    return {
      tableConfig,
      searchConfig,
      listApi: lotList,
      // 可选 附加查询条件
      appendSearchParams: {},
    }
  },
  methods: {
    /** 更改状态 */
    handleChangeStatus(row) {
      this.$apiConfirm(`此操作将${row.status === 0 ? '禁用' : '启用'}该批次，是否继续`, () => lotUpdateStatus(row.id, {
        status: row.status === 0 ? 1 : 0
      })).then(res => {
        if (!res) return
        this.$message.success('操作成功！')
        this.getTableData()
      })
    },
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
      this.$router.push({ path: '/businessRule/batchForm' })
    }
  }
}
</script>