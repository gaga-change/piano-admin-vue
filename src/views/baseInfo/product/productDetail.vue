<template>
  <div v-loading="loading">
    <div>
      <item-title>基本信息</item-title>
      <detail-item
        :config="detailItemConfig"
        :detail="detail"
        :labelWidth="100"
      />
    </div>
    <div class="mt25">
      <item-title>补充信息</item-title>
      <detail-item
        :config="detailAppendConfig"
        :detail="detail"
        :labelWidth="100"
      />
    </div>
  </div>
</template>
<script>
import { skuQueryDetailById, pushInOrder } from '@/api'

const detailItemConfig = [
  { label: '商品编码', prop: 'skuCode' },
  { label: '商品名称', prop: 'skuName' },
  { label: '商品品类', prop: 'lotAttrCode6' },
  { label: '货主', prop: 'ownerName' },
  { label: '规格', prop: 'lotAttrCode1' },
  { label: '单位', prop: 'lotAttrCode3' },
  { label: '型号', prop: 'lotAttrCode2' },
  { label: '品牌', prop: 'lotAttrCode12' },
]
const detailAppendConfig = [
  { label: '长', prop: 'lotAttrCode8', unit: 'cm' },
  { label: '宽', prop: 'lotAttrCode9', unit: 'cm' },
  { label: '高', prop: 'lotAttrCode10', unit: 'cm' },
  { label: '体积', prop: 'bulk', unit: 'm³' },
  { label: '重量', prop: 'lotAttrCode11', unit: 'kg' },
  { label: '最小库存', prop: 'minStock' },
]

export default {
  components: {},
  data() {
    return {
      loading: true,
      detailItemConfig,
      detailAppendConfig,
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
      // this.$apiConfirm('是否确定要进行手动推送？', () => pushInOrder({
      //   id: this.$route.query.id
      // })).then(res => {
      //   if (!res) return
      //   this.$message.success('操作成功！')
      //   this.initData()
      // })
    },
    /** 获取详情内容 */
    initData() {
      this.loading = true
      skuQueryDetailById({ id: this.$route.query.id }).then(res => {
        this.loading = false
        if (!res) return
        let temp = {}
        let { lotAttrCode8 = 0, lotAttrCode9 = 0, lotAttrCode10 = 0 } = res.data
        temp.lotAttrCode8 = Number(lotAttrCode8) || 0
        temp.lotAttrCode9 = Number(lotAttrCode9) || 0
        temp.lotAttrCode10 = Number(lotAttrCode10) || 0
        res.data.bulk = ((temp.lotAttrCode8 * temp.lotAttrCode9 * temp.lotAttrCode10) / 1000).toFixed(12)
        res.data.bulk = (res.data.bulk + '').replace(/(([0]+)$)|(\.([0]+)$)/g, '')
        this.detail = res.data
      })
    },
  },
}
</script>