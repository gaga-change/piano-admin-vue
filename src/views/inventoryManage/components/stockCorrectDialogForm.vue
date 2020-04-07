<template>
  <div class="">
    <!-- 600px【小型，单列】 70% 【中型，双列】-->
    <el-dialog
      title="库存订正"
      :visible="visible"
      width="70%"
      :before-close="handleClose"
      @close="close"
    >
      <div>
        <base-table
          :config="tableConfig"
          :data="[rowData]"
        >
        </base-table>
      </div>
      <!-- <el-alert
        class="mt15"
        title="温馨提示："
        type="info"
        :closable="false"
      >
        <p>举例，商品最小单位默认为1,4个最小单位为一个内包装【一个内包装数量为4】，
          2个内包装为1箱【一箱数量8】，10箱为一个容器【一容器数量为80】</p>
      </el-alert> -->
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="close()">取 消</el-button>
        <el-button
          type="primary"
          :loading="loading"
          @click="confirm()"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { addStockCorrection } from '@/api'
const tableConfig = [
  { label: '库位 ', prop: 'warehouseSpaceCode' },
  { label: '商品编码 ', prop: 'skuCode' },
  { label: '商品名称 ', prop: 'skuName' },
  { label: '规格', prop: 'skuFormat' },
  { label: '型号', prop: 'skuModel' },
  { label: '单位', prop: 'skuUnitName' },
  { label: '批次', prop: 'batchNo', type: 'batchNoPopover' },
  { label: '容器 ', prop: 'trayCode' },
  { label: '商品状态', prop: 'checkResult', type: 'enum', enum: 'checkResultEnum' },
  { label: '货主', prop: 'ownerName' },
  { label: '库存量', prop: 'skuQty' },
  { label: '已分配量', prop: 'blockQty' },
  { label: '实际数量', prop: 'num', edit: true, inputType: 'number', max: 999999, width: 170 },
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
      default: () => null
    }
  },
  computed: {
    /** 防止父级传递 null */
    rowData() {
      return this.row || {}
    }
  },
  data() {
    return {
      tableConfig,
      loading: false,
    }
  },
  methods: {
    /** 确定 */
    confirm() {
      let data = { ...this.rowData }
      if (data.num === '' || data.num === null || data.num === undefined) {
        return this.$message.warning('请输入实际数量')
      }
      this.loading = true
      addStockCorrection({
        stockId: data.id,
        realQty: data.num,
      }).then(res => {
        this.loading = false
        if (!res) return
        this.$message.success('操作成功！')
        this.$emit('submited')
        this.close()
      })
    },
    /** 关闭弹窗 */
    close() {
      // 初始化表单
      // this.$refs['form'] && this.$refs['form'].resetFields()
      // 初始化没有挂载到表单的数据
      // ...
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