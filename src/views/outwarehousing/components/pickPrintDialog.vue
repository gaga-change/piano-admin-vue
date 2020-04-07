<template>
  <div class="">
    <el-dialog
      title="打印拣货单"
      :visible="visible"
      width="60%"
      :before-close="handleClose"
      @close="close"
    >
      <div v-loading="pickOrderDetailLoading">
        <div ref="print">
          <div style="display: flex;">
            <div style="margin-right: 50px;line-height: 26px;flex: 1">
              <span>拣货单号:</span> <span>{{rowData.orderCode}}</span><br>
              <span>计划单号:</span> <span>{{rowData.planCode}}</span><br>
              <span>外部订单号:</span> <span>{{rowData.busiBillNo}}</span><br>
              <span>仓库:</span> <span>{{warehouseName}}</span><br>
              <span>打印时间:</span> <span>{{Date.now() | date}}</span>
            </div>
            <div style="width:200px;padding-top:5px">
              <bar-code :code="rowData.orderCode" />
            </div>
          </div>
          <!-- <div style=" display: flex;justify-content: flex-end;margin-bottom:12px">
            <span style="padding-right:12px">打印时间 :</span>
            <span>{{Date.now() | date}}</span>
          </div> -->
          <div class="mt15">
            <base-print-table
              :config="printConfig"
              :data="pickingtaskdetailTableData"
            />
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
          size="mini"
          :loading="loading"
          :disabled="pickOrderDetailLoading"
          @click="confirm()"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { MakePrint } from '@/utils'
import { mapGetters } from 'vuex'
import { pickOrderDetail } from '@/api'

const printConfig = [
  { label: '商品编码', prop: 'skuCode' },
  { label: '商品名称', prop: 'skuName' },
  { label: '规格', prop: 'skuFormat' },
  { label: '型号', prop: 'skuModel' },
  { label: '批次', prop: 'batchNo' },
  { label: '通知拣货数', prop: 'sortQty' },
  { label: '容器', prop: 'trayCode' },
  { label: '货位', prop: 'warehouseSpaceCode' },
]

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    /** 数据初始 */
    row: {
      type: Object,
      default: {}
    }
  },
  computed: {
    ...mapGetters([
      'warehouseMap',
      'chooseWarehouse',
    ]),
    /** 防止父级传递 null */
    rowData() {
      return this.row || {}
    }
  },
  watch: {
    /** 监听数据切换，重置表单 */
    rowData(val) {
      this.initData()
    }
  },
  data() {
    return {
      printConfig,
      pickOrderDetailLoading: false,
      loading: false,
      warehouseName: '',
      pickingtaskdetailTableData: []
    }
  },
  created() {
    this.warehouseMap.map(item => {
      if (item.warehouseNo == this.chooseWarehouse) {
        this.warehouseName = item.warehouseName
      }
    })
  },
  methods: {
    initData() {
      this.pickOrderDetailLoading = true;
      pickOrderDetail(this.rowData.id).then(res => {
        this.pickOrderDetailLoading = false;
        if (res && res.data) {
          this.pickingtaskdetailTableData = res.data.pickOrderDetailVOList || [];
        }
      })
    },
    /** 确定 */
    confirm() {
      let printPlanContainer = this.$refs['print'].innerHTML
      MakePrint(printPlanContainer)
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
  }
}
</script>