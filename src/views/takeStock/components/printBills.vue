<template>
  <div>
    <el-dialog
      title="打印预览"
      :visible="visible"
      width="80%"
      @close="close"
      :before-close="handleClose"
    >
      <div v-loading="orderDetailListLoading">
        <div ref="print">
          <div
            class="mt20"
            v-for="(item ,index) in showRowsData"
            :key="index"
          >
            <div :class="{'hide': index}">
              <div style="display: flex;">
                <h3 style="flex: 1;">基本信息</h3>
                <bar-code
                  :code="item.orderCode"
                  style="width: auto;max-height:70px;padding-top:5px"
                />
              </div>
              <div class="mb15">
                <span class="f14 mr15 mt10 nowrap"><span>盘点单号:</span><span>{{item.orderCode}}</span></span>
                <span class="f14 mr15 mt10 nowrap"><span>创建人:</span><span>{{item.createrName}}</span></span>
                <span class="f14 mr15 mt10 nowrap"><span>创建时间:</span><span>{{item.gmtCreate | timeFormat}}</span></span>
                <span class="f14 mr15 mt10 nowrap"><span>仓库名称 :</span><span>{{item.warehouseName}}</span></span>
              </div>
              <div>
                <table class="print-table">
                  <tr>
                    <th>商品编码</th>
                    <th>商品名称</th>
                    <th>批次</th>
                    <th>容器</th>
                    <th>规格型号</th>
                    <th>单位</th>
                    <th>库区库位</th>
                    <th>实盘数量</th>
                  </tr>
                  <tr
                    v-for="(son, i) in item.children"
                    :key="i"
                  >
                    <td>{{son.skuCode}}</td>
                    <td>{{son.skuName}}</td>
                    <td>{{son.batchNo}}</td>
                    <td>{{son.trayCode}}</td>
                    <td>{{son.skuFormat}}</td>
                    <td>{{son.skuUnitCode}}</td>
                    <td>{{son.areaSpceCode}}</td>
                    <td></td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          @click="close"
          size="mini"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="confirm"
          size="mini"
        >确认打印</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { planInventoryQueryByOrderId } from '@/api'
import BarCode from '@/components/BarCode/BarCode'
import { MakePrint } from '@/utils'
import moment from 'moment'
export default {
  components: { BarCode },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    rows: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.initData()
      }
    }
  },
  data() {
    return {
      orderDetailListLoading: false,
      showRowsData: [],
    }
  },
  filters: {
    timeFormat(val) {
      if (!val) return ''
      return moment(val).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  methods: {
    initData() {
      let rows = JSON.parse(JSON.stringify(this.rows))
      let temp = []
      rows.forEach(row => {
        temp.push(() => planInventoryQueryByOrderId({ orderId: row.id }).then(res => {
          row.children = res.data.orderDetailDOS.map(v => {
            v.areaSpceCode = (v.warehouseAreaCode || '') + '/' + (v.warehouseSpaceCode || '')
            return v
          })
        }))
      })
      this.orderDetailListLoading = true
      Promise.all(temp.map(fun => fun())).then(res => {
        this.orderDetailListLoading = false
        this.showRowsData = rows
      })
    },
    close() {
      this.visible && this.$emit('update:visible', false)
    },
    confirm() {
      MakePrint(this.$refs['print'].innerHTML)
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => { });
    }
  }
}
</script>

<style lang="scss" scoped>
.hide {
  display: none;
}
</style>
