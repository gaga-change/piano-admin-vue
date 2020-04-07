<template>
  <div
    class=""
    v-loading="planOutDetailLoading"
  >
    <div>
      <div>
        <item-title text="基本信息"></item-title>
        <detail-item
          :config="detailItemConfig"
          :detail="detail"
          :labelWidth="100"
        />
      </div>
      <div class="mt25">
        <item-title text="商品明细"></item-title>
        <base-table
          :highlightCurrentRow="true"
          @currentChange="currentChange"
          :config="tableConfig"
          :data="productList"
          :showControl="true"
          :select="false"
        >
          <template slot-scope="scope">
            <el-link
              type="primary"
              @click="selectedRow=scope.row;dialogVisible=true"
            >选择</el-link>
          </template>
        </base-table>
      </div>
      <div class="mt25">
        <item-title :text="productNow ? `${productNow.skuName} - 拣货任务明细 (点击商品行切换)`  : '拣货任务明细'"></item-title>
        <div v-if="productNow">
          <base-table
            :config="planTableConfig"
            :data="productNow._child"
            :showControl="true"
            :select="false"
          >
            <template slot-scope="scope">
              <el-link
                type="primary"
                @click="delRow(scope.row, scope.index)"
              >删除</el-link>
            </template>
          </base-table>
        </div>
        <div v-else>
          <el-alert
            class="mt15"
            title="点击商品行进行展示或切换！"
            type="info"
            :closable="false"
          >
          </el-alert>
        </div>
      </div>
      <div class="mt25">
        <el-button @click="close()">取 消</el-button>
        <el-button
          type="primary"
          :loading="pickOrderAddLoading"
          @click="confirm()"
        >确 定</el-button>
      </div>
    </div>
    <choose-dialog
      :visible.sync="dialogVisible"
      :row="selectedRow"
      @submited="submited"
    />
  </div>
</template>

<script>
import chooseSpaceCodeTableDialog from './components/chooseSpaceCodeTableDialog'
import { planOutDetail, pickOrderAdd } from '@/api'
import { mapGetters } from 'vuex'

const detailItemConfig = [
  { label: '出库计划单号', prop: 'planCode' },
  { label: '外部订单号', prop: 'busiBillNo' },
  { label: '创建时间', prop: 'gmtCreate', type: 'time' },
]
const tableConfig = [
  { label: '商品编码', prop: 'skuCode' },
  { label: '商品名称', prop: 'skuName' },
  { label: '规格', prop: 'skuFormat' },
  { label: '型号', prop: 'skuModel' },
  { label: '单位', prop: 'skuUnitName' },
  { label: '计划量', prop: 'planOutQty' },
  { label: '已通知拣货量', prop: 'sortQty' },
  { label: '本次拣货量', prop: 'sum' },
]
const planTableConfig = [
  { label: '商品编码', prop: 'skuCode' },
  { label: '商品名称', prop: 'skuName' },
  { label: '规格', prop: 'skuFormat' },
  { label: '型号', prop: 'skuModel' },
  { label: '单位', prop: 'skuUnitName' },
  { label: '批次', prop: 'batchNo' },
  { label: '本次拣货量', prop: 'number' },
  { label: '本次拣货库位', prop: 'warehouseSpaceCode' },
]
export default {
  components: { 'chooseDialog': chooseSpaceCodeTableDialog },
  data() {
    return {
      pickOrderAddLoading: false,
      dialogVisible: false,
      selectedRow: null,
      id: this.$route.query.id,
      planOutDetailLoading: false,
      tableConfig,
      detailItemConfig,
      planTableConfig,
      detail: {},
      productList: [],
      planTableData: [],
      productNow: null, // 当前选中的商品
    }
  },
  computed: {
    ...mapGetters({
      'mapConfig': 'mapConfig',
      visitedViews: 'visitedViews'
    })
  },

  created() {
    this.initDetail()
  },
  methods: {
    /** 删除任务行 */
    delRow(row, index) {
      this.$confirm('确定是否删除？').then(() => {
        this.selectedRow._child.splice(index, 1)
        let sum = 0
        this.selectedRow._child.forEach(v => {
          sum += (Number(v.number) || 0)
        })
        this.selectedRow.sum = sum
      }).catch(err => {

      })
    },
    /** 取消 ， 关闭当前页返回列表页 */
    close() {
      const view = this.visitedViews.filter(v => v.path === this.$route.path)
      this.$store.dispatch('delVisitedViews', view[0]).then(() => {
        this.$router.push({
          path: `/outwarehousing/outPlanList`,
        })
      }).catch(err => {
        console.error(err)
      })
    },
    /** 确定 */
    confirm() {
      const view = this.visitedViews.filter(v => v.path === this.$route.path)
      const query = this.$route.query
      // { label: '计划量', prop: 'planOutQty' },
      // { label: '已通知拣货量', prop: 'sortQty' },
      /* 数据校验：任务总量不能超过商品总量 */
      let err = false
      this.productList.filter(v => v.planOutQty - v.sortQty < (Number(v.sum) || 0)).forEach(v => {
        err = true
        this.$message({ type: 'error', message: `商品【${v.skuName}】的本次拣货数量应该在 0-${v.planOutQty - v.sortQty} 之间` })
      })
      this.productList.filter(v => !v.sum).forEach(v => {
        err = true
        this.$message({ type: 'error', message: `商品【${v.skuName}】的本次拣货数量必须大于0` })
      })
      if (err) return
      this.pickOrderAddLoading = true
      pickOrderAdd({
        pickType: 0,
        pickOrderDetailAddReqList: this.productList.map(v => {
          return {
            planCode: query.planCode,
            busiIndex: v.busiIndex,
            sortList: v._child.reduce((res, item) => {
              res[item.id + ''] = item.number
              return res
            }, {})
          }
        })
      }).then(res => {
        if (res) {
          this.$message({
            type: 'success',
            message: '操作成功,即将跳转到列表页！',
            duration: 1500,
            onClose: () => {
              this.close()
            }
          })
        } else {
          this.pickOrderAddLoading = false
        }
      })
    },
    /** 商品行点击 */
    currentChange(row) {
      this.productNow = row
    },
    /** 选择结束 */
    submited(tableData) {
      /** 覆盖 child 中的值 */
      let obj = {}
      this.selectedRow._child.forEach(v => {
        obj[v.id + ''] = v.number
      })
      let sum = 0
      this.selectedRow._child = tableData.map(v => {
        if (!v.number && obj[v.id + '']) { // 还原值
          v.number = obj[v.id + '']
        }
        if (v.number) {
          sum += (Number(v.number) || 0)
        }
        return v
      }).filter(v => v.number)
      this.selectedRow.sum = sum
    },
    /** 获取详情 */
    initDetail() {
      const query = this.$route.query
      this.detail = query
      this.planOutDetailLoading = true;
      planOutDetail({ planCode: query.planCode }).then(res => {
        this.planOutDetailLoading = false
        if (!res) return []
        let temp = res.data || []
        this.productList = temp.filter(v => ~(query.ids + ',').indexOf(v.id + ',')).map(v => {
          v.sum = undefined
          v._child = []
          v.planOutQty = Number(v.planOutQty) || 0
          v.sortQty = Number(v.sortQty) || 0
          return v
        })
      })
    },
  }
}
</script>