<template>
  <div class="ComponentNameClass">
    <base-list
      ref="baseList"
      :tableConfig="tableConfig"
      :searchConfig="searchConfig"
      :api="listApi"
      :showControl="true"
      :parseData="parseData"
      :controlWidth="120"
    >
      <template slot-scope="scope">
        <el-link
          type="primary"
          :disabled="scope.row.status === 2"
          @click="
            selectedRow = scope.row;
            courseFormDialogVisible = true;
          "
        >修改
        </el-link>
        <el-divider direction="vertical"></el-divider>
        <el-link
          type="primary"
          @click="handleCancel(scope.row)"
          :disabled="scope.row.status === 2"
        >取消
        </el-link>
      </template>
      <template slot="btns">
        <el-button
          type="primary"
          size="mini"
          @click="
            selectedRow = null;
            courseFormDialogVisible = true;
          "
        >
          新建课程
        </el-button>
      </template>
    </base-list>
    <courseFormDialog
      :visible.sync="courseFormDialogVisible"
      :row="selectedRow"
      @submited="getTableData()"
    />
  </div>
</template>

<script>
  import {coursesList, coursesModify} from "@/api";
  import courseFormDialog from "./courseFormDialog";

  const tableConfig = [
    {label: "日期", prop: "startTime", type: 'time', format: 'YYYY-MM-DD', width: 100},
    {label: "开始时间", prop: "startTime", type: 'time', format: 'HH:mm'},
    {label: "结束时间", prop: "endTime", type: 'time', format: 'HH:mm'},
    {label: "教师", prop: "teacher.name"},
    {label: "学生", prop: "student.name"},
    {label: "老师状态", prop: "teacherStatus", type: "enum", enum: "coursePersonStatusMap"},
    {label: "学生状态", prop: "studentStatus", type: "enum", enum: "coursePersonStatusMap"},
    {label: "状态", prop: "status", type: "enum", enum: "courseStatusMap"},
    {label: "课类别", prop: "classType.name"},
    {label: "课时长", prop: "classTime.name"},
    {label: "订单", prop: "order.product.name"},
    {label: "创建时间", prop: "createdAt", type: "time", width: 140},
    {label: "修改时间", prop: "updatedAt", type: "time", width: 140},
    {label: "备注", prop: "remark"}
  ];
  const searchConfig = [
    {label: "老师状态", prop: "teacherStatus", type: "enum", enum: "coursePersonStatusMap"},
    {label: "学生状态", prop: "studentStatus", type: "enum", enum: "coursePersonStatusMap"},
    {label: "状态", prop: "status", type: "enum", enum: "courseStatusMap"},
    {label: "课类别", prop: "classType", type: "enum", enum: "classType"},
    {label: "课时长", prop: "classTime", type: "enum", enum: "classTime"},
  ];
  export default {
    name: 'courseList',
    components: {courseFormDialog},
    data() {
      return {
        courseFormDialogVisible: false,
        selectedRow: null,
        tableConfig,
        searchConfig,
        listApi: coursesList,
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
        let data = res.list || [];
        let total = res.total;
        data.forEach(v => {
          v.date = new Date(v.startTime)
          v.date.setHours(0, 0, 0, 0)
        });
        return {data, total};
      },
      /** 新建 */
      handleCreate() {
        this.$router.push({path: "/qualityTesting/create"});
      },
      /** 删除 */
      handleCancel(row) {
        this.$apiConfirm(`是否确定取消该课程？`, () => coursesModify(row._id, {status: 0})).then(res => {
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
