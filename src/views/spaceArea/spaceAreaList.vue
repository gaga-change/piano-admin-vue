<template>
  <div class="ComponentNameClass">
    <base-list
      ref="baseList"
      :tableConfig="tableConfig"
      :searchConfig="searchConfig"
      :api="listApi"
      :showControl="false"
      :parseData="parseData"
      :controlWidth="160"
    >
      <template slot="btns">
        <el-button
          type="primary"
          size="mini"
          @click="handleCreate"
        >
          自动生成空闲时间
        </el-button>
      </template>
    </base-list>

  </div>
</template>

<script>
import { spaceAreasList, spaceAreasAutoCreate } from "@/api";

const tableConfig = [
  { label: "日期", prop: "startTime", type: 'time', format: 'YYYY-MM-DD' },
  { label: "开始时间", prop: "startTime", type: 'time', format: 'HH:mm' },
  { label: "结束时间", prop: "endTime", type: 'time', format: 'HH:mm' },
  { label: "姓名", prop: "name" },
  { label: "类别", prop: "personType", type: 'enum', enum: 'personType' },
];
const searchConfig = [
  { label: "日期", prop: "date", type: 'date', dateType: 'date' },
];
export default {
  name: "spaceAreaList",
  data() {
    return {
      selectedRow: null,
      tableConfig,
      searchConfig,
      listApi: spaceAreasList,
      // 可选 附加查询条件
      appendSearchParams: {},
      createLoading: false,
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
        v.isTeacher = !!v.teacher
        v.person = v.teacher || v.student
        v.name = v.person.name
        v.personType = v.teacher ? 0 : 1
      });
      return { data, total };
    },
    /** 新建 */
    handleCreate() {
      this.createLoading = true
      spaceAreasAutoCreate().then(res => {
        this.createLoading = false
        if (!res) return
        const { createNum } = res
        if (createNum === 0) {
          this.$message.success('已是最新')
        } else {
          this.$message.success('创建成功')
          this.getTableData()
        }
      })
    },
    /** 删除 */
    handleDelete(row) {
      this.$apiConfirm(`是否确定删除【${row.name}】？`, () => spaceAreasDel(row._id)).then(res => {
        if (!res) return
        this.$message.success('操作成功！')
        this.getTableData()
      })
    }
  }
};
</script>