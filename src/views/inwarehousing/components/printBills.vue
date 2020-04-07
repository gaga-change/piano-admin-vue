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
                <span class="f14 mr15 mt10 nowrap"><span>收货单号:</span><span>{{item.orderCode}}</span></span>
                <span class="f14 mr15 mt10 nowrap"><span>入库计划单:</span><span>{{item.planCode}}</span></span>
                <span class="f14 mr15 mt10 nowrap"><span>收货时间:</span><span>{{item.gmtCreate | timeFormat}}</span></span>
                <span class="f14 mr15 mt10 nowrap"><span>供应商 :</span><span>{{item.providerName}}</span></span>
              </div>
              <div>
                <table class="print-table">
                  <tr>
                    <th>序号</th>
                    <th>商品编码</th>
                    <th>商品名称</th>
                    <th>规格型号</th>
                    <th>单位</th>
                    <th>总数量</th>
                    <th>已入库</th>
                    <th>收货数量</th>
                    <!-- <th>上架量/货位</th> -->
                  </tr>
                  <tr
                    v-for="(son, i) in item.children"
                    :key="i"
                  >
                    <td>{{i + 1}}</td>
                    <td>{{son.skuCode}}</td>
                    <td>{{son.skuName}}</td>
                    <td>{{son.skuFormat}}</td>
                    <td>{{son.skuUnitCode}}</td>
                    <td>{{son.planQty}}</td>
                    <td>{{son.realInQty}}</td>
                    <td>{{son.receiveQty}}</td>
                    <!-- <td>{{son.putQty/son.warehouseSpaceCode}}</td> -->
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
import BarCode from '@/components/BarCode/BarCode'
import { orderDetailList } from '@/api'
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
        temp.push(() => orderDetailList(row.id).then(res => {
          row.children = res.data
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
