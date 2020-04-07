<template>
  <div v-loading="loading">
    <div>
      <item-title>基本信息</item-title>
      <detail-item
        :config="detailItemConfig"
        :detail="detail"
        :labelWidth="50"
        :textWidth="170"
      />
    </div>
    <div class="mt25">
      <item-title>联系信息</item-title>
      <base-table
        :config="detailAddressListConfig"
        :data="detail.addressList"
        :showControl="false"
        :controlWidth="160"
        :select="false"
      >
      </base-table>
    </div>
  </div>
</template>
<script>
import { customerDetail } from '@/api'

const detailItemConfig = [
  { label: '类型', prop: 'customerType', type: 'enum', enum: 'customerTypeEnum' },
  { label: '名称', prop: 'customerName' },
]
const detailAddressListConfig = [
  { label: '联系人', prop: 'linkUser' },
  { label: '电话', prop: 'linkTel' },
  { label: '地址', prop: 'address' },
]

export default {
  components: {},
  data() {
    return {
      loading: true,
      detailItemConfig,
      detailAddressListConfig,
      detail: {
        addressList: []
      },
    }
  },
  created() {
    this.initData()
  },
  methods: {
    /** 获取详情内容 */
    initData() {
      this.loading = true
      customerDetail(this.$route.query.id).then(res => {
        this.loading = false
        if (!res) return
        res.data.addressList = res.data.addressList || []
        this.detail = res.data
      })
    },
  },
}
</script>