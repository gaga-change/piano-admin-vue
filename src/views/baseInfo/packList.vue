<template>
  <div class="PackListComponent">
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
          @click="handleDeleteRow(scope.row)"
        >删除</el-link>
      </template>
      <template slot="btns">
        <el-button
          type="primary"
          size="mini"
          @click="handleCreate"
        >
          新建包装
        </el-button>
      </template>
    </base-list>
    <pack-add-dialog
      :visible.sync="packAddDialogVisible"
      @submited="getTableData()"
    />
  </div>
</template>

<script>
import PackAddDialog from './components/packAddDialog'
import { packageSelect, packageDelete } from '@/api'
const tableConfig = [
  { label: '包装编码', prop: 'packageCode' },
  { label: '包装描述', prop: 'packageDesc' },
  { label: '最小单元', prop: 'single' },
  { label: '内包装', prop: 'innerPackage' },
  { label: '箱', prop: 'box' },
  { label: '容器', prop: 'palet' },
  { label: '创建时间', prop: 'gmtCreate', type: 'time', width: 140 },
]
const searchConfig = [
  { label: '包装编码', prop: 'packageCode' },
  { label: '包装描述', prop: 'packageDesc' },
]
export default {
  components: { PackAddDialog },
  data() {
    return {
      tableConfig,
      searchConfig,
      listApi: packageSelect,
      packAddDialogVisible: false,
    }
  },
  methods: {
    /** 刷新列表 */
    getTableData() {
      this.$refs['baseList'].fetchData()
    },
    /** 新建按钮 点击 */
    handleCreate() {
      this.packAddDialogVisible = true
    },
    /** 删除当前行 */
    handleDeleteRow(row) {
      this.$apiConfirm('是否确定删除？', () => packageDelete(row.id)).then(res => {
        if (!res) return
        this.$message.success('操作成功！')
        this.getTableData()
      })
    },
  }
}
</script>