<template>
  <div class="ComponentNameClass">
    <base-list
      ref="baseList"
      :tableConfig="tableConfig"
      :searchConfig="searchConfig"
      :api="listApi"
      :showControl="true"
      :controlWidth="200"
    >
      <template slot-scope="scope">
        <el-link
          type="primary"
          @click="selectRow=scope.row;warehouseBindUserVisible=true"
        >绑定用户</el-link>
        <el-divider direction="vertical"></el-divider>
        <el-link
          type="primary"
          @click="$router.push({ path: `/baseInfo/warehouseUserList`, query:{warehouseCode: scope.row.warehouseCode}})"
        >仓库用户</el-link>
        <el-divider direction="vertical"></el-divider>
        <el-link
          type="primary"
          @click="handleChangeStatus(scope.row)"
        >{{scope.row.status === 0 ? '禁用' : '启用'}}</el-link>
      </template>
      <template slot="btns">
        <el-button
          type="primary"
          size="mini"
          @click="warehouseAddDialogVisible=true"
        >
          新增仓库
        </el-button>
      </template>
    </base-list>
    <warehouseAddDialog
      :visible.sync="warehouseAddDialogVisible"
      @submited="getTableData"
    />
    <warehouseBindUser
      :row="selectRow"
      :visible.sync="warehouseBindUserVisible"
      @submited="selectRow=null;getTableData()"
    />
  </div>
</template>

<script>
import { warehouseSelect, updateWarehouseStatus } from '@/api'
import warehouseAddDialog from './components/warehouseAddDialog'
import warehouseBindUser from './components/warehouseBindUser'
const tableConfig = [
  { label: '仓库编码', prop: 'warehouseCode', width: 120 },
  { label: '仓库名称', prop: 'warehouseName' },
  { label: '类型', prop: 'type', type: 'enum', enum: 'warehouseTypeEnum' },
  { label: '状态', prop: 'status', type: 'enum', enum: 'warehouseStatusEnum' },
  { label: '联系人', prop: 'linkName' },
  { label: '详细地址', prop: 'warehouseAddress' },
  { label: '创建时间', prop: 'gmtCreate', type: 'time', width: 140 },
]
const searchConfig = [
  { label: '仓库编码', prop: 'warehouseCode' },
  { label: '仓库名称', prop: 'warehouseName' },
]
export default {
  components: { warehouseAddDialog, warehouseBindUser },
  data() {
    return {
      warehouseAddDialogVisible: false,
      warehouseBindUserVisible: false,
      selectRow: null,
      tableConfig,
      searchConfig,
      listApi: warehouseSelect,
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
    /** 修改状态 */
    handleChangeStatus(row) {
      this.$apiConfirm(`确定要${row.status === 0 ? '禁用' : '启用'}该仓库【${row.warehouseCode}-${row.warehouseName}】吗？`, () => updateWarehouseStatus(row.id, {
        flag: row.status === 0 ? 1 : 0
      })).then(res => {
        if (!res) return
        this.$message.success('操作成功！')
        this.getTableData()
      })
    }
  }
}
</script>