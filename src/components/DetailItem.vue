<template>
  <div class="DetailItemCom">
    <div
      class="item"
      :style="{width: labelWidth ? (labelWidth + textWidth) + 'px' : undefined}"
      v-for="(item, index) in config"
      :key="index"
    >
      <span
        class="label-text"
        :style="{width: labelWidth ? labelWidth + 'px' : undefined}"
      >{{item.label}} ：</span>
      <template v-if="item.type === 'time'">
        <span class="value-content">{{detail[item.prop] | timeFormat}}</span>
      </template>
      <template v-else-if="item.type === 'enum'">
        <span class="value-content">
          {{detail[item.prop] | parseEnum(mapConfig, item)}}
        </span>
      </template>
      <template v-else>
        <span class="value-content">
          <template v-if="detail[item.prop] !== null && detail[item.prop] !== undefined && detail[item.prop] !== ''">
            {{detail[item.prop]}}{{item.unit || ''}}
          </template>
        </span>
      </template>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'

export default {
  props: {
    detail: {
      type: Object,
      default: () => ({})
    },
    config: {
      type: Array,
      default: () => []
    },
    labelWidth: {
      type: Number,
      default: 80
    },
    textWidth: {
      type: Number,
      default: 120
    }
  },
  data() {
    return {
      batchNoDetailLoading: false,
      batchNoDetail: null
    }
  },
  computed: {
    ...mapGetters([
      'mapConfig',
    ])
  },
  filters: {
    timeFormat(val) {
      if (!val) return ''
      return moment(Number(val)).format('YYYY-MM-DD HH:mm:ss')
    },
    parseEnum(val, mapConfig, item) {
      if (val === '' || val === undefined || val === null) {
        return ''
      }
      if (!item.enum) {
        console.error(`列【${item.label} : ${item.prop}】,需要 【enum】字段`)
        return ''
      }
      let temp = mapConfig[item.enum].find(v => v.value == val)
      if (!temp) {
        console.error(`列【${item.label} : ${item.prop}】,没有对应枚举值（${val}）`)
        return ''
      }
      return temp.name
    }
  },
  methods: {
  }
}

</script>

<style lang="scss">
.DetailItemCom {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  font-size: 12px;
  .item {
    display: flex;
    width: 200px;
    margin-right: 20px;
    margin-top: 10px;
    .label-text {
      width: 80px;
      text-align: right;
    }
    .value-content {
      flex: 1;
      word-break: break-all;
    }
  }
}
</style>
