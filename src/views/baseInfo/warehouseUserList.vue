<template>
  <div class="ComponentNameClass">
    <base-list
      ref="baseList"
      :tableConfig="tableConfig"
      :searchConfig="searchConfig"
      :api="listApi"
      :showControl="true"
      :controlWidth="160"
      :appendSearchParams="appendSearchParams"
    >
      <template slot-scope="scope">
        <el-link
          type="primary"
          @click="handelDelete(scope.row)"
        >删除</el-link>
      </template>
    </base-list>
  </div>
</template>

<script>
import { warehouseUserList, warehouseUserDelete } from '@/api'
const tableConfig = [
  { label: '仓库编码', prop: 'warehouseCode', width: 120 },
  { label: '仓库名称', prop: 'warehouseName' },
  { label: '账户', prop: 'userAccount' },
  { label: '手机', prop: 'userTel' },
  { label: '用户名', prop: 'userName' },
  { label: '创建时间', prop: 'gmtCreate', type: 'time', width: 140 },
]
const searchConfig = [
  { label: '账户', prop: 'userAccount' },
  { label: '用户名', prop: 'userName' },
]
export default {
  data() {
    return {
      tableConfig,
      searchConfig,
      listApi: warehouseUserList,
      // 可选 附加查询条件
      appendSearchParams: {
        warehouseCode: this.$route.query.warehouseCode
      },
    }
  },
  methods: {
    /** 刷新列表 */
    getTableData() {
      this.$refs['baseList'].fetchData()
    },
    /** 删除 */
    handelDelete(row) {
      this.$apiConfirm('确定要删除该仓库用户关系？', () => warehouseUserDelete(row.id)).then(res => {
        if (!res) return
        this.$message.success('操作成功！')
        this.getTableData()
      })
    }
  }
}
</script>