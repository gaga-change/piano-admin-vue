<template>
  <div class="TakeStockListCom">

    <base-list
      ref="baseList"
      :tableConfig="tableConfig"
      :searchConfig="searchConfig"
      :api="listApi"
      :showControl="true"
      :controlWidth="160"
    >
      <template slot-scope="scope">
        <router-link
          :to="{path:`/qualityTesting/detail`,query:{id: scope.row.id}}"
          :style="{color:'#3399ea'}"
        >查看</router-link>
        <el-divider direction="vertical"></el-divider>
        <el-button
          class="btn-link"
          @click="handleReloadFile(scope.row)"
        >
          质检报告
        </el-button>
      </template>
      <template slot="btns">
        <el-button
          type="primary"
          @click="handleCreate"
        >
          新建质检记录
        </el-button>
      </template>
    </base-list>

    <reload-file
      :visible.sync="reloadFileVisible"
      :row.sync="rowNow"
    />
  </div>
</template>

<script>
import { checkOrderList, getCheckReportByOrderCode } from '@/api'
import reloadFile from './components/reloadFile'

const tableConfig = [
  { label: '质检单号 ', prop: 'orderCode' },
  { label: '收货单号 ', prop: 'receiveOrderCode' },
  { label: '创建人', prop: 'createrName' },
  { label: '创建时间', prop: 'gmtCreate', type: 'time', width: 140 },
]
const searchConfig = [
  { label: '质检单号', prop: 'orderCode' },
  { label: '创建时间', prop: 'createTimeArea', props: ['startDate', 'endDate'], type: 'timeArea' },
]

export default {
  components: { reloadFile },
  data() {
    return {
      tableConfig,
      searchConfig,
      listApi: checkOrderList,
      reloadFileVisible: false,
      rowNow: {},
    }
  },
  methods: {
    /** 刷新列表 */
    getTableData() {
      this.$refs['baseList'].fetchData()
    },
    /** 重新上传 */
    handleReloadFile(row, operate) {
      this.rowNow = row
      this.reloadFileVisible = true
    },
    /** 新建质检记录 */
    handleCreate() {
      this.$router.push({ path: '/qualityTesting/create' })
    }
  }
}
</script>
