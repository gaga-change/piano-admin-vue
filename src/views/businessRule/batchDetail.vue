<template>
  <div v-loading="lotDetailLoading">
    <detail-item
      :config="detailConfig"
      :detail="detail"
    ></detail-item>
    <div class="mt15"></div>
    <base-table
      :config="tableConfig"
      :showIndex="true"
      :data="propItems"
    ></base-table>
  </div>
</template>

<script>
import { lotDetail } from '@/api'
const detailConfig = [
  { label: '批次描述', prop: 'lotName' },
]
const tableConfig = [
  { label: '批次属性', prop: 'lotAttrName' },
  { label: '输入类型', prop: 'lotAttrType', type: 'enum', enum: 'lotAttrTypeEnum' },
  { label: '属性选项', prop: '_prop' },
  // { label: '启用', prop: 'status', type: 'enum', enum: 'lotStatusEnum' },
  { label: '启用', prop: 'status', edit: true, inputType: 'switch', activeValue: 0, inactiveValue: 1, disabled: true },
  { label: '系统采集', prop: 'dataSource', type: 'enum', enum: 'noRrYesEnum' },
  { label: '映射属性', prop: 'receiveOrderAttr', type: 'enum', enum: 'receiveOrderAttrEnum' },
  { label: '输入控制', prop: 'inputType', type: 'enum', enum: 'inputTypeEnum' },
]
export default {
  data() {
    return {
      tableConfig,
      detailConfig,
      lotDetailLoading: true,
      detail: {},
      propItems: []
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.lotDetailLoading = false
      lotDetail(this.$route.query.id).then(res => {
        this.lotDetailLoading = false
        if (!res) return
        this.detail = res.data
        this.propItems = (res.data.lotDetailList || []).map(v => {
          v.lotAttrValue = v.lotAttrValue || '{}'
          try {
            v.lotAttrValue = JSON.parse(v.lotAttrValue)
          } catch (error) {
            console.error('解析异常：', v.lotAttrValue)
            v.lotAttrValue = {}
          }
          let { lotAttrValue } = v
          lotAttrValue = lotAttrValue || {}
          switch (v.lotAttrType) {
            case 1:
              v._prop = `最大长度：${lotAttrValue.length || 20}`
              break
            case 2:
              v._prop = `最小值：${lotAttrValue.min}，最大值：${lotAttrValue.max}，精度：${lotAttrValue.precision}`
              break
            case 3:
              v._prop = `枚举值：${(lotAttrValue.enum || []).join('，')}`
              break
            case 4:
              v._prop = `日期格式：${lotAttrValue.format || 'YYYY-MM-DD'}`
              break
          }
          return {
            ...v
          }
        })
      })
    }
  }
}
</script>