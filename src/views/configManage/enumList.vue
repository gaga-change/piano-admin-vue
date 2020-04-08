<template>
  <div class="ComponentNameClass">
    <base-list
      ref="baseList"
      :tableConfig="tableConfig"
      :searchConfig="searchConfig"
      :api="listApi"
      :showControl="true"
      :controlWidth="160"
      :parseData="parseData"
    >
      <template slot-scope="scope">
        <el-link
          type="primary"
          @click="handleModify(scope.row)"
        >编辑</el-link>
        <el-divider direction="vertical"></el-divider>
        <el-link
          type="primary"
          @click="handleCopy(scope.row)"
        >复制</el-link>
        <el-divider direction="vertical"></el-divider>
        <el-link
          type="primary"
          @click="handleDelete(scope.row)"
        >删除</el-link>
      </template>
      <template slot="btns">
        <el-button
          type="primary"
          size="mini"
          @click="handleCreate"
        >
          新建
        </el-button>
        <el-button
          type="primary"
          size="mini"
          @click="handleOutput"
        >
          导出
        </el-button>
      </template>
    </base-list>
    <create-dialog
      :visible.sync="createDialogVisible"
      :row="nowRow"
      @submited="getTableData()"
    />
  </div>
</template>

<script>
import { enumsList, enumsDel } from '@/api'
import enumCreateFormDialog from './components/enumCreateFormDialog'

const tableConfig = [
  { label: '名称', prop: 'name' },
  { label: '键值', prop: 'keyValueStr' },
  { label: '创建时间', prop: 'createdAt', type: 'time', width: 140 },
  { label: '修改时间', prop: 'updatedAt', type: 'time', width: 140 },
  { label: '备注', prop: 'remark' },
]
const searchConfig = [
  { label: '名称', prop: 'name' },
]

export default {
  components: { createDialog: enumCreateFormDialog },
  data() {
    return {
      tableConfig,
      searchConfig,
      listApi: enumsList,
      createDialogVisible: false,
      nowRow: null
    }
  },
  methods: {
    /** 删除 */
    handleDelete(row) {
      this.$apiConfirm(`是否确定删除【${row.name}】？`, () => enumsDel(row._id)).then(res => {
        if (!res) return
        this.$message.success('操作成功！')
        this.getTableData()
      })
    },
    /** 刷新列表 */
    getTableData() {
      this.$refs['baseList'].fetchData()
    },
    /** 返回列表添加字段 */
    parseData(res) {
      let data = res.list || []
      let total = res.total
      data.forEach(v => {
        v.keyValueStr = v.keyValue.map(v => `${v.name} - ${v.value}`).join(',')
      })
      return { data, total }
    },
    /** 编辑 */
    handleModify(row) {
      this.nowRow = row
      this.createDialogVisible = true
    },
    /** 复制 */
    handleCopy(row) {
      let temp = { ...row }
      delete temp._id
      this.nowRow = temp
      this.createDialogVisible = true
    },
    /** 新建 */
    handleCreate() {
      this.nowRow = null
      this.createDialogVisible = true
    },
    /** 导出 */
    handleOutput() {
      window.open('/api/enumsTotal')
    }
  }
}
</script>