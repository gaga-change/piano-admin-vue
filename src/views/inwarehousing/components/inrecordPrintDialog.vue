<template>
  <div class="">
    <!-- 600px【小型，单列】 70% 【中型，双列】-->
    <el-dialog
      title="打印单据"
      :visible="visible"
      width="70%"
      :before-close="handleClose"
      @close="close"
    >
      <div
        ref="print"
        v-loading="loading"
      >
        <div
          v-for="(detail, index) in detailArr"
          :key="index"
          :class="{hidden: index > 0}"
          :style="{marginTop: index> 0 ? '40px' : '0'}"
        >
          <div class="text-right">
            <div style="width:200px;display:inline-block;">
              <bar-code :code="detail.receiveOrderDO['orderCode']" />
            </div>
          </div>
          <div
            class="mb15"
            style="display: flex;flex-flow: wrap;"
          >
            <span
              v-for="(item, index) in topConfig"
              :key="index"
              class="f14 mr25 mt10"
            >
              <span>{{item.label}}：</span><span>
                <template v-if="item.type === 'enum'">
                  {{mapConfig[item.enum].find(v => v.value == detail.receiveOrderDO[item.prop]) | getName}}
                </template>
                <template v-else>
                  {{detail.receiveOrderDO[item.prop] || ''}}
                </template>
              </span>
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
                v-for="(row, i) in detail.detailDOs"
                :key="i"
              >
                <td
                  v-for="(item, index) in tableConfig"
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
          </div>
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
          :disabled="loading"
        >打 印</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { receiveOrderQueryDetails } from '@/api'
import { MakePrint } from '@/utils'
import { mapGetters } from 'vuex'

const topConfig = [
  { label: '收货单号 ', prop: 'orderCode' },
  { label: '入库计划单号 ', prop: 'planCode' },
  { label: '外部订单号', prop: 'busiBillNo' },
  { label: '单据类型', prop: 'orderType', type: 'enum', enum: 'busiBillTypeEnum' },
  { label: '供应商', prop: 'providerName' },
  { label: '货主', prop: 'ownerName' },
]
const tableConfig = [
  { label: '商品条码', prop: 'skuCode', type: 'barCode' },
  { label: '商品编码', prop: 'skuCode' },
  { label: '商品名称', prop: 'skuName' },
  { label: '规格', prop: 'skuFormat' },
  { label: '型号', prop: 'skuModel' },
  { label: '单位', prop: 'skuUnitCode' },
  { label: '包装', prop: 'packageString' },
  { label: '是否质检', prop: 'lotAttrCode7' },
  { label: '预期收货量', prop: 'planQty' },
]
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    rows: {
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {
      loading: true,
      topConfig,
      tableConfig,
      detailArr: [], // 内容，带详情
    }
  },
  computed: {
    ...mapGetters([
      'mapConfig',
    ])
  },
  watch: {
    visible(val) {
      val && this.initData()
    }
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
    /** 初始化数据 */
    async initData() {
      this.detailArr = []
      this.loading = true
      let apis = []
      for (let i = 0; i < this.rows.length; i++) {
        let res = await receiveOrderQueryDetails({ id: this.rows[i].id })
        res.data.detailItemDos = res.data.detailItemDos || []
        res.data.detailDOs = res.data.detailDOs || []
        this.detailArr.push(res.data)
      }
      this.loading = false
    },
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
<style lang="scss" scoped>
.hidden {
  width: 0;
  height: 0;
  margin: 0 !important;
  overflow: hidden;
}
</style>