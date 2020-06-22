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
          @click="
            selectedRow = scope.row;
            leaveAreaFormDialogVisible = true;
          "
        >修改</el-link>
        <template v-if="scope.row.status === 0">
          <el-divider direction="vertical"></el-divider>
          <el-link
            type="primary"
            @click="handleNoPass(scope.row)"
          >拒绝</el-link>
          <el-divider direction="vertical"></el-divider>
          <el-link
            type="primary"
            @click="handlePass(scope.row)"
          >通过</el-link>
        </template>
      </template>
      <template slot="btns">
        <el-button
          type="primary"
          size="mini"
          @click="
            selectedRow = null;
            leaveAreaFormDialogVisible = true;
          "
        >
          新建请假单
        </el-button>
      </template>
    </base-list>
    <leaveAreaFormDialog
      :visible.sync="leaveAreaFormDialogVisible"
      :row="selectedRow"
      @submited="getTableData()"
    />
  </div>
</template>

<script>
import leaveAreaFormDialog from "./leaveAreaFormDialog";
import { leaveAreasList, leaveAreasModify } from '@/api'
const tableConfig = [
  { label: '开始时间', prop: 'startTime', type: 'time', width: 140 },
  { label: '结束时间', prop: 'endTime', type: 'time', width: 140 },
  { label: '姓名', prop: 'name' },
  { label: '电话号码', prop: 'phone' },
  { label: '角色', prop: 'typeName' },
  { label: '状态', prop: 'status', type: 'enum', enum: 'leaveAreaStatusMap' },
  { label: '创建时间', prop: 'createdAt', type: 'time', width: 140 },
  { label: '修改时间', prop: 'updatedAt', type: 'time', width: 140 },
  { label: '理由', prop: 'reason' },
  { label: '备注', prop: 'remark' },
]
const searchConfig = [
  { label: '状态', prop: 'status', type: 'enum', enum: 'leaveAreaStatusMap' },
]
export default {
  name: 'leaveAreaList',
  components: { leaveAreaFormDialog },
  data() {
    return {
      tableConfig,
      searchConfig,
      leaveAreaFormDialogVisible: false,
      selectedRow: null,
      listApi: leaveAreasList,
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
      let data = res.list || []
      let total = res.total
      data.forEach(v => {
        if (v.course) {
          v.startTime = v.course.startTime
          v.endTime = v.course.endTime
        }
        if (v.person) {
          v.typeName = v.person.kind === 'teacher' ? '教师' : '学生'
          v.name = v.person.name
          v.phone = v.person.phone
        }
      })
      return { data, total }
    },
    /** 新建 */
    handleCreate() {
      this.$router.push({ path: '/qualityTesting/create' })
    },
    /** 拒绝 */
    handleNoPass(row) {
      this.$apiConfirm(`是否确定拒绝该请假单？`, () => leaveAreasModify(row._id, {status: 2})).then(res => {
        if (!res) return
        this.$message.success('操作成功！')
        this.getTableData()
      })
    },
    /** 通过 */
    handlePass(row) {
      this.$apiConfirm(`是否确定通过该请假单？`, () => leaveAreasModify(row._id, {status: 1})).then(res => {
        if (!res) return
        this.$message.success('操作成功！')
        this.getTableData()
      })
    },
    activated() {
      if (!this.$store.state.tagsView.isNew) {
        this.getTableData()
      }
    },
  }
}
</script>
