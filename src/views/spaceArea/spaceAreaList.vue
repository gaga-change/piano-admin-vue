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
          :loading="createLoading"
          @click="handleCreate"
        >
          自动生成空闲时间
        </el-button>
        <el-button
          type="primary"
          size="mini"
          :loading="autoDelSpaceRuleLoading"
          @click="autoDelSpaceRule"
        >
          自动清理时间规则
        </el-button>
        <el-button
          type="primary"
          size="mini"
          :loading="autoDelSpaceAreaLoading"
          @click="autoDelSpaceArea"
        >
          自动清理空闲时间
        </el-button>
      </template>
    </base-list>
  </div>
</template>

<script>
import { spaceAreasList, spaceAreasAutoCreate, spaceAreasClearNoTeacherOrStudent, spaceRulesClearNoTeacherOrStudent } from "@/api";

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
      autoDelSpaceAreaLoading: false,
      autoDelSpaceRuleLoading: false,
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
        v.name = v.person && v.person.name
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
        }
        this.getTableData() // 可能存在清除操作，执行完毕自动刷新列表
      })
    },
    autoDelSpaceRule() {
      this.autoDelSpaceRuleLoading = true
      spaceRulesClearNoTeacherOrStudent().then(res => {
        this.autoDelSpaceRuleLoading = false
        if (!res) return
        const { idNum, docNum } = res
        this.$message.success(`清理无用主档数量${idNum}，删除文档数量${docNum}`)
      })
    },
    autoDelSpaceArea() {
      this.autoDelSpaceAreaLoading = true
      spaceAreasClearNoTeacherOrStudent().then(res => {
        this.autoDelSpaceAreaLoading = false
        if (!res) return
        const { idNum, docNum } = res
        this.$message.success(`清理无用主档数量${idNum}，删除文档数量${docNum}`)
        if (docNum > 0) {
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