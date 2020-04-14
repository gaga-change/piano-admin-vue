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
          @click="
            selectedRow = scope.row;
            studentFormDialogVisible = true;
          "
        >修改</el-link>
        <el-divider direction="vertical"></el-divider>
        <el-link
          type="primary"
          @click="
            selectedRow = scope.row;
            setSpaceRuleDialogVisible = true;
          "
        >空闲时段</el-link>
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
          @click="
            selectedRow = null;
            studentFormDialogVisible = true;
          "
        >
          新建学生
        </el-button>
      </template>
    </base-list>
    <studentFormDialog
      :visible.sync="studentFormDialogVisible"
      :row="selectedRow"
      @submited="getTableData()"
    />
    <template v-if="setSpaceRuleDialogVisible">
      <setSpaceRuleDialog
        :visible.sync="setSpaceRuleDialogVisible"
        :row="selectedRow"
        type="student"
        @submited="getTableData()"
      />
    </template>
  </div>
</template>

<script>
import { studentsList, studentsDel } from "@/api";
import studentFormDialog from "./studentFormDialog";
import setSpaceRuleDialog from "../teacher/setSpaceRuleDialog"

const tableConfig = [
  { label: "姓名", prop: "name", width: 120 },
  { label: "手机号码", prop: "phone" },
  { label: "状态", prop: "status", type: "enum", enum: "studentStatus" },
  { label: "创建时间", prop: "createdAt", type: "time", width: 140 },
  { label: "修改时间", prop: "updatedAt", type: "time", width: 140 },
  { label: "备注", prop: "remark" }
];
const searchConfig = [
  { label: "姓名", prop: "name", width: 120 },
  { label: "手机号码", prop: "phone" },
  { label: "状态", prop: "status", type: "enum", enum: "studentStatus" },
];
export default {
  components: { studentFormDialog, setSpaceRuleDialog },
  data() {
    return {
      studentFormDialogVisible: false,
      setSpaceRuleDialogVisible: false,
      selectedRow: null,
      tableConfig,
      searchConfig,
      listApi: studentsList,
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
      this.$apiConfirm(`是否确定删除【${row.name}】？`, () => studentsDel(row._id)).then(res => {
        if (!res) return
        this.$message.success('操作成功！')
        this.getTableData()
      })
    }
  }
};
</script>