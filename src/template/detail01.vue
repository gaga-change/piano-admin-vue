<template>
  <div v-loading="loading">
    <div
      class="mb20"
      v-if="true"
    >
      <el-button
        type="primary"
        @click="handleTryPush"
      >
        手动推送
      </el-button>
    </div>
    <div>
      <item-title>基本信息</item-title>
      <detail-item
        :config="detailItemConfig"
        :detail="detail"
        :labelWidth="100"
      />
    </div>
    <div class="mt25">
      <item-title>商品明细</item-title>
      <base-table
        :config="detailSonListConfig"
        :data="detail.sonList"
        :showControl="false"
        :controlWidth="160"
        :select="false"
      >
      </base-table>
    </div>
  </div>
</template>
<script>
import { queryInOrderDetail, pushInOrder } from '@/api'

const detailItemConfig = [
  { label: '入库单号', prop: 'orderCode' },
  { label: '入库计划单号', prop: 'planCode' },
  { label: '外部订单号', prop: 'busiBillNo' },
  { label: '单据类型', prop: 'orderType', type: 'enum', enum: 'busiBillTypeEnum' },
  { label: '推送状态', prop: 'isPush', type: 'enum', enum: 'isPushStateEnum' },
  { label: '供应商', prop: 'providerName' },
  { label: '货主', prop: 'ownerName' },
  { label: '创建人', prop: 'createrName' },
  { label: '创建时间', prop: 'gmtCreate', type: 'time' },
]
const detailSonListConfig = [
  { label: '商品编码', prop: 'skuCode' },
  { label: '商品名称', prop: 'skuName' },
  { label: '规格', prop: 'skuFormat' },
  { label: '型号', prop: 'skuModel' },
  { label: '单位', prop: 'skuUnitName' },
  { label: '数量', prop: 'inQty' },
]

export default {
  components: {},
  data() {
    return {
      loading: true,
      detailItemConfig,
      detailSonListConfig,
      detail: {
        sonList: []
      },
    }
  },
  created() {
    this.initData()
  },
  methods: {
    /** 手动推送点击事件 */
    handleTryPush() {
      this.$apiConfirm('是否确定要进行手动推送？', () => pushInOrder({
        id: this.$route.query.id
      })).then(res => {
        if (!res) return
        this.$message.success('操作成功！')
        this.initData()
      })
    },
    /** 获取详情内容 */
    initData() {
      this.loading = true
      // queryInOrderDetail({ orderId: this.$route.query.id }).then(res => {
      queryInOrderDetail({ orderId: 214 }).then(res => {
        this.loading = false
        if (!res) return
        res.data.sonList = res.data.skuDoList || []
        this.detail = res.data
      })
    },
  },
}
</script>