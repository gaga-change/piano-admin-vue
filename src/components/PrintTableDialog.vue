<template>
  <div class="">
    <!-- 600px【小型，单列】 70% 【中型，双列】-->
    <el-dialog
      :title="title"
      :visible="visible"
      width="70%"
      :before-close="handleClose"
      @close="close"
    >
      <div ref="print">
        <h2
          v-if="printTitle"
          class="text-center"
        >{{printTitle}}</h2>
        <div class="mb15">
          <span
            v-for="(item, index) in topConfig"
            :key="index"
            class="f14 mr20 mt10 nowrap"
          >
            <span>{{item.label}}：</span><span>{{detail[item.prop] || ''}}</span>
          </span>
        </div>
        <div>
          <table class="print-table">
            <tr>
              <th
                v-for="(item, index) in tableConfig"
                :key="index"
              >{{item.label}}</th>
            </tr>
            <tr
              v-for="(row, i) in tableData"
              :key="i"
            >
              <td
                v-for="(item, index) in tableConfig"
                :key="index"
              >
                <template v-if="item.type === 'enum'">
                  {{mapConfig[item.enum].find(v => v.value == row[item.prop]) | getName}}
                </template>
                <template v-else>
                  {{row[item.prop] || ''}}
                </template>
              </td>
            </tr>
          </table>
        </div>
        <div class="mt25">
          <slot></slot>
        </div>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          @click="close()"
          size="mini"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="print()"
        >打 印</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { MakePrint } from '@/utils'
import { mapGetters } from 'vuex'

export default {
  props: {
    title: {
      type: String,
      default: '打印'
    },
    printTitle: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: false,
    },
    topConfig: {
      type: Array,
      default: () => []
    },
    tableConfig: {
      type: Array,
      default: () => []
    },
    tableData: {
      type: Array,
      default: () => []
    },
    detail: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {

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
  methods: {
    /** 确定 */
    print() {
      MakePrint(this.$refs['print'].innerHTML)
    },
    /** 关闭弹窗 */
    close() {
      this.visible && this.$emit('update:visible', false)
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => { })
    }
  },
}
</script>