<template>
  <div
    class="TemporaryStorageConfirmSearch"
    v-loading="pickOrderNotCreateOrderLoading"
  >
    <el-form
      :model="selectForm"
      ref="searchForm"
      label-width="0px"
      label-position="left"
    >
      <el-form-item prop="outOrderCode">
        <el-input
          type="text"
          size="mini"
          placeholder="请输入拣货单号"
          v-model.trim="selectForm.outOrderCode"
          @input="handelCodeInputChange"
          clearable
        ></el-input>
      </el-form-item>
    </el-form>
    <base-table
      :config="tableConfig"
      :data="selectCode"
      :highlightCurrentRow="true"
      @currentChange="currentChange"
    ></base-table>
  </div>
</template>

<script>
import { pickOrderNotCreateOrder } from '@/api'

const tableConfig = [// 拣货单号列表
  { label: '序号', prop: 'index' },
  { label: '拣货单号', prop: 'value', width: 150 },
]

export default {
  data() {
    return {
      tableConfig,
      pickOrderNotCreateOrderLoading: true,
      selectForm: {
        outOrderCode: undefined
      },
      totalCode: [],
      selectCode: [],
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      this.selectForm.outOrderCode = undefined
      this.totalCode = []
      this.selectCode = []
      this.pickOrderNotCreateOrderLoading = true
      this.currentChange()
      pickOrderNotCreateOrder().then(res => {
        this.pickOrderNotCreateOrderLoading = false
        if (!res) return
        let owndata = res.data || []
        this.selectCode = this.totalCode = owndata.map((v, i) => ({
          index: i + 1,
          value: v
        }))
      })
    },
    currentChange(currentRow) {
      if (currentRow) {
        this.$emit('submit', currentRow.value)
      } else {
        this.$emit('submit', '')
      }
    },
    /** 计划单号搜索内容改变 */
    handelCodeInputChange() {
      this.currentChange()
      let outOrderCode = this.selectForm.outOrderCode.toLocaleLowerCase()
      if (outOrderCode) {
        this.selectCode = this.totalCode.filter(v => ~v.value.toLocaleLowerCase().indexOf(outOrderCode))
      } else {
        this.selectCode = [...this.totalCode]
      }
    }
  }

}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.TemporaryStorageConfirmSearch {
  &::before,
  &::after {
    clear: both;
    content: "";
    display: block;
  }
  .el-form-item {
    height: 30px;
    margin-bottom: 30px;
  }

  .card-text {
    color: rgb(51, 153, 234);
    margin-left: 12px;
    cursor: pointer;
  }
}
</style>
