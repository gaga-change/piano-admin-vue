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
          :type="scope.row.cancel ? 'primary': 'warning'"
          @click="handleDelete(scope.row)"
        >{{scope.row.cancel ? '启用' : '取消'}}</el-link>
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
          新建订单
        </el-button>
      </template>
    </base-list>
    <orderFormDialog
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
import { ordersList, ordersModify } from "@/api";
import orderFormDialog from "./orderFormDialog";
import TableTimeDialog from "@/components/TableTimeDialog"

const tableConfig = [
  { label: "课程", prop: "product.name" },
  { label: "学生", prop: "student.name" },
  { label: "学生联系方式", prop: "student.phone" },
  { label: "总时长（分钟）", prop: "product.time" },
  { label: "剩余时间（分钟）", prop: "excessTime" },
  { label: "状态", prop: "cancel", type: "enum", enum: "cancelEnum" },
  { label: "创建时间", prop: "createdAt", type: "time", width: 140 },
  { label: "修改时间", prop: "updatedAt", type: "time", width: 140 },
  { label: "备注", prop: "remark" }
];
const searchConfig = [
  { label: "课程", prop: "product", type: "enum", enum: "product" },
  { label: "状态", prop: "cancel", type: "enum", enum: "cancelEnum" },
];
export default {
  name: 'orderList',
  components: { orderFormDialog, TableTimeDialog },
  data() {
    return {
      studentFormDialogVisible: false,
      setSpaceRuleDialogVisible: false,
      tableTimeDialogVisible: false,
      selectedRow: null,
      tableConfig,
      searchConfig,
      listApi: ordersList,
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
      this.$apiConfirm(`是否确定${row.cancel ? '启用' : '取消'}【${row.student.name} - ${row.product.name}】？`, () => ordersModify(row._id, { cancel: !row.cancel })).then(res => {
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