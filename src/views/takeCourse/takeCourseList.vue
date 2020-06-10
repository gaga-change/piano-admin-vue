<template>
  <div class="ComponentNameClass">
    <base-list
      ref="baseList"
      :tableConfig="tableConfig"
      :searchConfig="searchConfig"
      :api="listApi"
      :showControl="true"
      :controlWidth="80"
    >
      <template slot-scope="scope">
<!--        <el-link-->
<!--          type="primary"-->
<!--          @click="-->
<!--                    selectedRow = scope.row;-->
<!--                    studentFormDialogVisible = true;-->
<!--                  "-->
<!--        >修改-->
<!--        </el-link>-->
<!--        <el-divider direction="vertical"></el-divider>-->
        <el-link
          :type="scope.row.cancel ? 'primary': 'warning'"
          @click="handleDelete(scope.row)"
        >{{scope.row.cancel ? '启用' : '取消'}}
        </el-link>
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
          新建抢课单
        </el-button>
      </template>
    </base-list>
    <takeCourseFormDialog
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
  import {takeCoursesList, takeCoursesModify} from "@/api";
  import takeCourseFormDialog from "./takeCourseFormDialog";
  import TableTimeDialog from "@/components/TableTimeDialog"

  const tableConfig = [
    {label: "日期", prop: "startTime", type: 'time', format: 'YYYY-MM-DD', width: 100},
    {label: "开始时间", prop: "startTime", type: 'time', format: 'HH:mm'},
    {label: "学生", prop: "student.name"},
    {label: "学生联系方式", prop: "student.phone"},
    {label: "教师", prop: "teacher.name"},
    {label: "课类别", prop: "classType.name"},
    {label: "课时长", prop: "classTime.name"},
    {label: "推送教师类型", prop: "teacherTypes", type: "enums", enum: "teacherType", width: 200},
    {label: "状态", prop: "cancel", type: "enum", enum: "cancelEnum"},
    {label: "订单", prop: "order.product.name"},
    {label: "创建时间", prop: "createdAt", type: "time", width: 140},
    {label: "修改时间", prop: "updatedAt", type: "time", width: 140},
    {label: "备注", prop: "remark"}
  ];
  const searchConfig = [
    {label: "名称", prop: "name"},
    {label: "状态", prop: "disabled", type: "enum", enum: "disabledEnum"},
  ];
  export default {
    name: 'takeCourseList',
    components: {takeCourseFormDialog, TableTimeDialog},
    data() {
      return {
        studentFormDialogVisible: false,
        setSpaceRuleDialogVisible: false,
        tableTimeDialogVisible: false,
        selectedRow: null,
        tableConfig,
        searchConfig,
        listApi: takeCoursesList,
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
        return {data, total};
      },
      /** 新建 */
      handleCreate() {
        this.$router.push({path: "/qualityTesting/create"});
      },
      /** 删除 */
      handleDelete(row) {
        this.$apiConfirm(`是否确定${row.cancel ? '启用' : '取消'}？`, () => takeCoursesModify(row._id, {cancel: !row.cancel})).then(res => {
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
