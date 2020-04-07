<template>
  <div class="">
    <base-list
      ref="baseList"
      :tableConfig="tableConfig"
      :searchConfig="searchConfig"
      :api="listApi"
      :showControl="false"
      :select="true"
      @selectionChange="selectionChange"
      :selectable="selectable"
      :labelWidth="100"
    >
      <template slot="btns">
        <el-button
          :disabled="!selectRows.length"
          @click="orderAdd"
          type="primary"
        >
          生成入库单
        </el-button>
      </template>
    </base-list>
  </div>
</template>

<script>
import { jobList, inOrderAdd } from '@/api'

const tableConfig = [
  { label: '入库计划单号', prop: 'planCode', width: 140 },
  { label: '收货单号', prop: 'receiveOrderCode', width: 140 },
  { label: '外部订单号', prop: 'busiBillNo', width: 90 },
  { label: '商品编码', prop: 'skuCode' },
  { label: '商品名称', prop: 'skuName' },
  { label: '规格', prop: 'skuFormat' },
  { label: '型号', prop: 'skuModel' },
  { label: '单位', prop: 'skuUnitCode' },
  { label: '批次', prop: 'batchNo' },
  { label: '容器', prop: 'trayCode' },
  { label: '上架数量', prop: 'jobQty' },
  { label: '库位', prop: 'warehouseSpaceCode' },
  { label: '已生成入库单', prop: 'isCreateOrder', type: 'Boolean', width: 100 },
  { label: '上架时间', prop: 'gmtCreate', type: 'time', width: 120, format: 'YYYY-MM-DD  HH:mm' },
  { label: '操作人', prop: 'createrName' },
]
const searchConfig = [
  { label: '入库计划单号', prop: 'planCode' },
  { label: '收货单号', prop: 'receiveOrderCode' },
  { label: '外部订单号', prop: 'busiBillNo' },
  { label: '是否已生成入库单', prop: 'isCreateOrder', type: 'radio', labelWidth: 120, radio: 'yesOrNoEnum', default: 0 },
  { label: '库位', prop: 'warehouseSpaceCode' },
  { label: '批次规则', prop: 'batchNo', type: 'batchRule' },
  { label: '容器', prop: 'trayCode' },
]

export default {
  data() {
    return {
      tableConfig,
      searchConfig,
      listApi: jobList,
      selectRows: [],
    }
  },
  methods: {
    /** 列表可选条件 */
    selectable(row) {
      return !row.isCreateOrder
    },
    /** 刷新列表 */
    getTableData() {
      this.$refs['baseList'].fetchData()
    },
    /** 主表多选 */
    selectionChange(selectRows) {
      this.selectRows = [...selectRows]
    },
    /** 生成入库单 */
    orderAdd() {
      let inWarehouseJobList = []
      let receiveOrderCodeList = new Set()
      this.selectRows.forEach(item => {
        inWarehouseJobList.push(item.id)
        receiveOrderCodeList.add(item.planCode)
      })
      this.$apiConfirm(`确定要为 ${[...receiveOrderCodeList].join(' , ')} 生成入库单吗?`, () => inOrderAdd({ inWarehouseJobList })).then(res => {
        if (!res) return
        this.$message.success('操作成功！')
        this.getTableData()
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
// .record {
// }
</style>
