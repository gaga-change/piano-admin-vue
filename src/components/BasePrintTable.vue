<template>
  <table class="print-table">
    <tr>
      <th
        v-for="(item, index) in config"
        :key="index"
      >{{item.label}}</th>
    </tr>
    <tr
      v-for="(row, i) in data"
      :key="i"
    >
      <td
        v-for="(item, index) in config"
        :key="index"
      >
        <template v-if="item.type === 'enum'">
          {{mapConfig[item.enum].find(v => v.value == row[item.prop]) | getName}}
        </template>
        <template v-else-if="item.type === 'barCode'">
          <div style="width:100px;">
            <bar-code :code="row[item.prop]" />
          </div>
        </template>
        <template v-else>
          {{row[item.prop] || ''}}
        </template>
      </td>
    </tr>
  </table>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    config: {
      type: Array,
      default: () => []
    },
    data: {
      type: Array,
      default: () => { }
    }
  },
  computed: {
    ...mapGetters([
      'mapConfig',
    ])
  },
  filters: {
    getName(v) {
      if (!v) {
        return ''
      }
      return v.name
    }
  },
}
</script>