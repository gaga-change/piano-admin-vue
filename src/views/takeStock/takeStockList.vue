<template>
  <div class="TakeStockListCom">

    <base-list
      ref="baseList"
      :tableConfig="tableConfig"
      :searchConfig="searchConfig"
      :api="listApi"
      :showControl="true"
      :controlWidth="200"
      :select="true"
      @selectionChange="selectionChange"
    >
      <template slot-scope="scope">
        <router-link
          :to="{path:`/takeStock/detail`,query:{id: scope.row.id}}"
          :style="{color:'#3399ea'}"
        >查看</router-link>
        <el-divider
          v-if="scope.row.executeStatus === 0 || scope.row.executeStatus === 1"
          direction="vertical"
        ></el-divider>
        <router-link
          v-if="scope.row.executeStatus === 0 || scope.row.executeStatus === 1"
          :to="{path:`/takeStock/record`,query:{id: scope.row.id}}"
          :style="{color:'#3399ea'}"
        >盘点录入</router-link>
        <el-divider
          v-if="scope.row.executeStatus === 0"
          direction="vertical"
        ></el-divider>
        <el-button
          class="btn-link"
          v-if="scope.row.executeStatus === 0"
          @click="handleChangeStatus(scope.row, 0)"
        >
          取消
        </el-button>
        <el-divider
          v-if="scope.row.executeStatus === 1"
          direction="vertical"
        ></el-divider>
        <el-button
          class="btn-link"
          v-if="scope.row.executeStatus === 1"
          @click="handleChangeStatus(scope.row, 1)"
        >
          终止
        </el-button>
      </template>
      <template slot="btns">
        <el-tooltip
          class="item"
          effect="dark"
          content="打印表格中勾选的内容"
          placement="top"
        >
          <el-button
            type="primary"
            size="mini"
            :disabled="!selectRows.length"
            @click="handlePrint"
          >
            打印
          </el-button>
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="dark"
          content="打印表格中勾选的内容"
          placement="top"
        >
          <el-button
            type="primary"
            size="mini"
            :disabled="!selectRows.length"
            @click="handleOutput"
          >
            导出
          </el-button>
        </el-tooltip>
        <el-button
          type="primary"
          @click="$router.push({path: '/takeStock/billing'})"
        >
          盘点开单
        </el-button>
      </template>
    </base-list>
    <print-bills
      :visible.sync="printBillsVisible"
      :rows="selectRows"
    />
  </div>
</template>

<script>
import printBills from './components/printBills'
import { planInventoryList, inventoryRemoveOrStop, inventoryRecordExport } from '@/api'
const tableConfig = [
  { label: '盘点单号', prop: 'orderCode', width: 140 },
  { label: '盘点类型', prop: 'orderType', type: 'enum', enum: 'takeStockTypeEnum' },
  { label: '状态', prop: 'executeStatus', type: 'enum', enum: 'executeStatusEnum' },
  { label: '仓库名称', prop: 'warehouseName' },
  { label: '创建人', prop: 'createrName' },
  { label: '创建时间', prop: 'gmtCreate', type: 'time', width: 140 },
  // { label: '盘点人', prop: 'inventoryName' },
  // { label: '盘点时间', prop: 'inventoryTime', type: 'time', width: 140 },
]
const searchConfig = [
  { label: '盘点单号', prop: 'orderCode' },
  { label: '盘点类型', prop: 'orderType', type: 'enum', enum: 'takeStockTypeEnum' },
  { label: '状态', prop: 'executeStatus', type: 'enum', enum: 'executeStatusEnum' },
  { label: '创建时间', prop: 'createTimeArea', type: 'timeArea', props: ['startDate', 'endDate'] },
]
export default {
  components: { printBills },
  data() {
    return {
      tableConfig,
      searchConfig,
      listApi: planInventoryList,
      selectRows: [],
      printBillsVisible: false,
      searchParams: {},
    }
  },
  methods: {
    /** 刷新列表 */
    getTableData() {
      this.$refs['baseList'].fetchData()
    },
    /** 主表多选 */
    selectionChange(selectRows) {
      this.selectRows = [...selectRows]
    },
    /** 取消或终止 */
    handleChangeStatus(row, operate) {
      this.$apiConfirm(`此操作将${operate ? '终止' : '取消'}该盘点单，是否继续`, () => inventoryRemoveOrStop({
        id: row.id,
        operate
      })).then(res => {
        if (!res) return
        this.$message.success('操作成功！')
        this.getTableData()
      })
    },
    /** 导出 */
    handleOutput() {
      inventoryRecordExport({
        orderCodeList: this.selectRows.map(v => {
          return v.orderCode
        })
      })
    },
    /** 打印 */
    handlePrint() {
      this.printBillsVisible = true
    }
  }
}
</script>
