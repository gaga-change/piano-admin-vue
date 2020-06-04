<template>
  <div class="ComponentNameClass">
    <base-list
      ref="baseList"
      :tableConfig="tableConfig"
      :searchConfig="searchConfig"
      :api="listApi"
      :showControl="true"
      :controlWidth="240"
    >
      <template slot-scope="scope">
        <el-link
          type="primary"
          @click="
            selectedRow = scope.row;
            studentFormDialogVisible = true;
          "
        >修改</el-link>
        <el-divider direction="vertical"></el-divider>
        <el-link
          :type="scope.row.disabled ? 'primary': 'warning'"
          @click="handleDelete(scope.row)"
        >{{scope.row.disabled ? '启用' : '禁用'}}</el-link>
      </template>
      <template slot="btns">
        <el-button
          type="primary"
          size="mini"
          @click="
            selectedRow = null;
            studentFormDialogVisible = true;
          "
        >
          新建奖金规则
        </el-button>
      </template>
    </base-list>
    <bonusRuleFormDialog
      :visible.sync="studentFormDialogVisible"
      :row="selectedRow"
      @submited="getTableData()"
    />
    <template v-if="tableTimeDialogVisible">
      <TableTimeDialog
        :visible.sync="tableTimeDialogVisible"
        :row="selectedRow"
        type="student"
      ></TableTimeDialog>
    </template>
  </div>
</template>

<script>
import { bonusRulesList, bonusRulesModify } from "@/api";
import bonusRuleFormDialog from "./bonusRuleFormDialog";
import TableTimeDialog from "@/components/TableTimeDialog"
const tableConfig = [
  { label: "教师类型", prop: "teacherType.name" },
  { label: "课时长", prop: "classTime.name" },
  { label: "工资", prop: "price" },
  { label: "状态", prop: "disabled", type: "enum", enum: "disabledEnum" },
  { label: "创建时间", prop: "createdAt", type: "time", width: 140 },
  { label: "修改时间", prop: "updatedAt", type: "time", width: 140 },
  { label: "备注", prop: "remark" }
];
const searchConfig = [
  { label: "名称", prop: "name" },
  { label: "状态", prop: "disabled", type: "enum", enum: "disabledEnum" },
];
export default {
  name: 'bonusRuleList',
  components: { bonusRuleFormDialog, TableTimeDialog },
  data() {
    return {
      studentFormDialogVisible: false,
      setSpaceRuleDialogVisible: false,
      tableTimeDialogVisible: false,
      selectedRow: null,
      tableConfig,
      searchConfig,
      listApi: bonusRulesList,
      // 可选 附加查询条件
      appendSearchParams: {}
    };
  },
  methods: {
    /** 刷新列表 */
    getTableData() {
      this.$refs["baseList"].fetchData();
    },
    /** 可选 返回列表添加字段 */
    parseData(res) {
      let data = res.data.list || [];
      let total = res.data.total;
      data.forEach(v => {
        v.updateLockStatusOutLoading = false;
        v.updateLockStatusInLoading = false;
      });
      return { data, total };
    },
    /** 新建 */
    handleCreate() {
      this.$router.push({ path: "/qualityTesting/create" });
    },
    /** 删除 */
    handleDelete(row) {
      this.$apiConfirm(`是否确定${row.disabled ? '启用' : '禁用'}【${row.name}】？`, () => bonusRulesModify(row._id, { disabled: !row.disabled })).then(res => {
        if (!res) return
        this.$message.success('操作成功！')
        this.getTableData()
      })
    }
  },
  activated() {
    if (!this.$store.state.tagsView.isNew) {
      this.getTableData()
    }
  },
};
</script>