<template>
  <div
    class="TakeStockDetailCom"
    v-loading="planInventoryQueryByOrderIdLoading"
  >
    <el-card shadow="never">
      <div slot="header">
        基本信息
      </div>
      <detail-item
        :config="takeStockDetailConfig"
        :detail="detail"
      />
    </el-card>
    <el-card
      shadow="never"
      class="mt20"
    >
      <div slot="header">
        商品列表
      </div>
      <base-table
        :config="takeStockDetailProductTableConfig"
        :data="prodList"
      >
      </base-table>
    </el-card>
  </div>
</template>

<script>
import { planInventoryQueryByOrderId } from '@/api'

const takeStockDetailProductTableConfig = [
  { label: '商品编码', prop: 'skuCode' },
  { label: '商品名称', prop: 'skuName' },
  { label: '批次', prop: 'batchNo', type: 'batchNoPopover', width: 110 },
  { label: '容器', prop: 'trayCode' },
  { label: '规格', prop: 'skuFormat' },
  { label: '型号', prop: 'skuModel' },
  { label: '单位', prop: 'skuUnitName' },
  { label: '库区库位', prop: 'areaSpceCode' },
  { label: '库存数量', prop: 'stockQty' },
  { label: '实际盘点数量', prop: 'inventoryQty' },
  { label: '盈亏数量', prop: 'profitLossQty' },
  { label: '状态', prop: 'executeStatus', type: 'enum', enum: 'executeStatus2Enum' },
  { label: '盘点人', prop: 'inventoryName' },
  { label: '盘点时间', prop: 'gmtModify', type: 'time', width: 140 },
]
const takeStockDetailConfig = [
  { label: '盘点单号', prop: 'orderCode' },
  { label: '创建人', prop: 'createrName' },
  { label: '创建时间', prop: 'gmtCreate', type: 'time' },
  { label: '仓库名称', prop: 'warehouseName' },
  { label: '盘点类型', prop: 'orderType', type: 'enum', enum: 'takeStockTypeEnum' },
  { label: '备注', prop: 'remarkInfo' },
]

export default {
  data() {
    return {
      planInventoryQueryByOrderIdLoading: false,
      takeStockDetailProductTableConfig,
      takeStockDetailConfig,
      detail: {},
      prodList: []
    }
  },
  created() {
    this.planInventoryQueryByOrderIdLoading = true
    planInventoryQueryByOrderId({
      orderId: this.$route.query.id
    }).then(res => {
      this.planInventoryQueryByOrderIdLoading = false
      if (!res) return
      this.detail = res.data.inventoryOrderDO
      this.prodList = res.data.orderDetailDOS.map(v => {
        if (v.inventoryQty !== null) v.profitLossQty = v.inventoryQty - v.stockQty
        v.areaSpceCode = (v.warehouseAreaCode || '') + '/' + (v.warehouseSpaceCode || '')
        if (v.executeStatus !== 1) {
          v.gmtModify = null
        }
        return v
      })
    })
  },
}
</script>

<style lang="scss">
// .TakeStockDetailCom {
// }
</style>
