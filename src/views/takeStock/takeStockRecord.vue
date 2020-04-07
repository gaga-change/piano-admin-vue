<template>
  <div
    class="TakeStockRecordCom"
    v-loading="planInventoryQueryByOrderIdLoading"
  >
    <el-alert
      v-if="!planInventoryQueryByOrderIdLoading && detail.executeStatus !== 0 && detail.executeStatus !== 1"
      title="盘点单状态已更新，当前无法进行盘点录入操作！"
      type="error"
      class="mb20"
      show-icon
    >
    </el-alert>
    <el-card shadow="never">
      <div slot="header">
        基本信息
      </div>
      <detail-item
        :config="takeStockRecordConfig"
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
        :config="takeStockRecordProductTableConfig"
        :data="prodList"
        @inputNumberChange="inputNumberChange"
      >
      </base-table>
    </el-card>
    <div class="mt15">
      <el-button
        type="primary"
        size="mini"
        :disabled="detail.executeStatus !== 0 && detail.executeStatus !== 1"
        @click="submit(0)"
        :loading="inventoryInbentoryRecordLoading"
      >保存</el-button>
      <el-button
        type="primary"
        size="mini"
        @click="submit(1)"
        :disabled="detail.executeStatus !== 0 && detail.executeStatus !== 1"
        :loading="inventoryInbentoryRecordLoading"
      >提交</el-button>
    </div>
    <el-alert
      class="mt15"
      title="注："
      type="info"
    >
      <p>1. 盈亏数量：实际盘点数量-库存数量</p>
      <p>2. 保存：状态更新为盘点中</p>
      <p>2. 提交：状态更新为已完成</p>
    </el-alert>
  </div>
</template>

<script>
import { planInventoryQueryByOrderId, inventoryInbentoryRecord } from '@/api'
import { mapGetters } from 'vuex'

const takeStockRecordProductTableConfig = [
  { label: '商品编码', prop: 'skuCode' },
  { label: '商品名称', prop: 'skuName' },
  { label: '批次', prop: 'batchNo' },
  { label: '容器', prop: 'trayCode' },
  { label: '规格', prop: 'skuFormat' },
  { label: '型号', prop: 'skuModel' },
  { label: '单位', prop: 'skuUnitName' },
  { label: '库区库位', prop: 'areaSpceCode' },
  { label: '库存数量', prop: 'stockQty' },
  { label: '实际盘点数量', prop: 'inventoryQty', edit: true, inputType: "number", width: 160 },
  { label: '盈亏数量（自动计算）', prop: 'profitLossQty', width: 150 },
  { label: '状态', prop: 'executeStatus', type: 'enum', enum: 'executeStatus2Enum' },
]
const takeStockRecordConfig = [
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
      planInventoryQueryByOrderIdLoading: true,
      inventoryInbentoryRecordLoading: false,
      takeStockRecordProductTableConfig,
      takeStockRecordConfig,
      detail: {},
      prodList: [],
    }
  },
  computed: {
    ...mapGetters({
      visitedViews: 'visitedViews'
    })
  },
  created() {
    planInventoryQueryByOrderId({
      orderId: this.$route.query.id
    }).then(res => {
      this.planInventoryQueryByOrderIdLoading = false
      if (!res) return
      this.detail = res.data.inventoryOrderDO
      this.prodList = res.data.orderDetailDOS.map(v => {
        v.areaSpceCode = (v.warehouseAreaCode || '') + '/' + (v.warehouseSpaceCode || '')
        if (v.inventoryQty === null) v.inventoryQty = v.stockQty
        v.inputTypeNumberDisabled = v.executeStatus !== 0
        v.profitLossQty = (Number(v.inventoryQty) || 0) - (Number(v.stockQty) || 0)
        return v
      })
    })
  },
  methods: {
    submit(isSubmit) {
      const view = this.visitedViews.filter(v => v.path === this.$route.path)
      this.inventoryInbentoryRecordLoading = true
      inventoryInbentoryRecord({
        inventoryOrderId: this.$route.query.id,
        inventoryOrderDO: this.detail,
        orderDetailDOS: this.prodList,
        isSubmit
      }).then(res => {
        this.inventoryInbentoryRecordLoading = false
        if (!res) return
        this.$message.success('盘点录入成功，即将跳转到盘点单列表！')
        setTimeout(() => {
          this.$store.dispatch('delVisitedViews', view[0]).then(() => {
            this.$router.push({
              path: `/takeStock/list`,
              query: { t: Date.now() }
            })
          }).catch(err => {
          })
        }, 3000)
      })
    },
    /** 输入框内容改变 */
    inputNumberChange({ row, index, value }) {
      if (value === undefined || value === '') {
        value = 0
        this.$nextTick(v => {
          row.inventoryQty = 0
        })
      }
      this.prodList[index].profitLossQty = (Number(value) || 0) - (Number(row.stockQty) || 0)
    }
  },
}
</script>

<style lang="scss">
// .TakeStockRecordCom {
// }
</style>
