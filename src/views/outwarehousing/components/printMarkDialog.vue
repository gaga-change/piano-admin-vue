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
      <div>
        <base-table
          :config="tableConfig"
          :data="tableData"
          :showControl="true"
          :showControlFixed="false"
          controlName="打包数"
        >
          <template slot-scope="scope">
            <el-input-number
              placeholder="打包数"
              v-model="scope.row.number"
              :precision="0"
              :min="1"
              :max="200"
              controls-position="right"
            ></el-input-number>
          </template>
        </base-table>
      </div>
      <div style="width: 0; height: 0; overflow: hidden;">
        <div ref="print">
          <div
            class="mt15 mb15 fs14"
            style="overflow: hidden;"
            v-for="n in number"
            :key="n"
          >
            <p class="fw600 fs16">{{n}}/{{number}}</p>
            <p style="display: flex;">
              <span style="width: 75px;">客户名称</span>
              <span style="flex: 1">{{row.customerName}}</span>
            </p>
            <p style="display: flex;">
              <span style=" width: 75px;">联系人 </span>
              <span style="flex: 1">{{row.arrivalLinkName}}</span>
            </p>
            <p style="display: flex;">
              <span style="width: 75px;">地址</span>
              <span style="flex: 1">{{row.arrivalAddress}}</span>
            </p>
          </div>
        </div>
      </div>

      <el-alert
        class="mt15"
        title="温馨提示："
        type="info"
        :closable="false"
      >
        <p>一次打印【打包数】最多200个。如需更多，请分批打印。</p>
      </el-alert>
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
const tableConfig = [
  { label: '业务行号', prop: 'index', width: 100 },
  { label: '出库单号', prop: 'orderCode' },
  { label: '计划单号', prop: 'planCode' },
  { label: '外部订单号', prop: 'busiBillNo' },
]
export default {
  props: {
    title: {
      type: String,
      default: '打印'
    },
    visible: {
      type: Boolean,
      default: false,
    },
    row: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      tableConfig,
      number: 0,
    }
  },
  computed: {
    tableData() {
      if (this.row) {
        return [{ ...this.row, index: 1, number: 1 }]
      }
      return []
    }
  },
  methods: {
    /** 确定 */
    print() {
      this.number = this.tableData[0].number
      this.$nextTick(() => {
        MakePrint(this.$refs['print'].innerHTML)
      })
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