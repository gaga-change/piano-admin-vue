<template>
  <div style="margin-bottom:10px">
    <el-button
      type="primary"
      size="mini"
      @click="pickingOrder"
    >
      分配拣货任务
    </el-button>
    <div>
      <el-dialog
        title="按单拣货"
        :visible.sync="dialogVisible"
        width="90%"
      >
        <div style="position:relative;">
          <span>拣货人姓名:</span>
          <el-input
            type="text"
            size="mini"
            style="width:200px;margin-bottom:12px;"
            placeholder="请输入拣货人姓名"
            v-model="pickOperatorName"
          >
          </el-input>
          <el-button
            size="mini"
            type="primary"
            @click="getorder"
            style="position:absolute;right:0;"
            :disabled="getbtn"
          >先进先出</el-button>
        </div>
        <el-table
          :data="PickingOrderData"
          border
          size="mini"
        >
          <el-table-column
            v-for="(item, index ) in planChildTableEditAllocationConfig"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
          >
          </el-table-column>
          <el-table-column
            label="本次拣货数量"
            width="120"
          >
            <template slot-scope="scope">
              <span :class="(scope.row.planOutQty-scope.row.sortQty)>scope.row.total?'pointout':''">{{ scope.row.sum }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-popover
                placement="right"
                width="400"
                trigger="click"
                @hide="handlePopoverHide(scope.$index, scope.row)"
              >
                <el-table
                  size="mini"
                  :data="gridData"
                  v-loading="sonTableLoading"
                >
                  <el-table-column
                    property="index"
                    width="50"
                    label="序号"
                  ></el-table-column>
                  <el-table-column
                    property="warehouseSpaceCode"
                    label="库位"
                    width="100"
                  ></el-table-column>
                  <el-table-column
                    property="qty"
                    width="80"
                    label="可用库存"
                  ></el-table-column>
                  <el-table-column
                    property="num"
                    label="通知拣货量"
                  >
                    <template slot-scope="scope">
                      <el-input-number
                        size="mini"
                        v-model="scope.row.num"
                        :precision="0"
                        :min="0"
                        :max="scope.row.qty"
                      ></el-input-number>
                    </template>
                  </el-table-column>
                </el-table>
                <el-button
                  slot="reference"
                  size="mini"
                  @click="handleSelectSon(scope.$index, scope.row)"
                  :disabled="(scope.row.planOutQty - scope.row.sortQty) <= 0"
                >选择</el-button>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            size="mini"
            @click="dialogVisible = false"
          >取 消</el-button>
          <el-button
            size="mini"
            @click="surePicking"
            type="primary"
          >确认</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { pickOrderAdd, getInfoOnPageInventory } from '@/api'
import { MakePrint } from '@/utils'

const planChildTableEditAllocationConfig = [ // 计划单操作列表 之 波次分配
  { label: '计划单号', prop: 'planCode', minWidth: 150 },
  { label: '商品编码', prop: 'skuCode', width: 150 },
  { label: '商品名称', prop: 'skuName', width: 150 },
  { label: '规格型号', prop: 'skuFormat', minWidth: 120 },
  { label: '单位', prop: 'skuUnitName', minWidth: 100 },
  { label: '商品数量', prop: 'planOutQty', minWidth: 120 },
  { label: '通知拣货数量', prop: 'sortQty', width: 120 },
]

export default {
  data() {
    return {
      dialogVisible: false,
      dialogVisibleLabel: false,
      dialogVisibleReserve: false,
      previewIt: true,
      loading: false,
      childData: [],
      planChildTableEditAllocationConfig,
      printPlan: [],//打印计划单
      defaultCanedit: true,
      PickingOrderData: [],
      pickOperatorName: '',
      sonTableLoading: false,
      gridData: [],
      cache: {}, // 缓存
      cacheApi: {}, // 缓存api
      skuStock: {}, // 库存统计
      newcacheApi: {},
      newgridData: [],
      newcountnum: {},
      getbtn: false,
      errarrry: []
    }
  },
  props: {
    childSelectRows: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    dialogVisible(val) {
      if (!val) {
        this.dialogClose()
      }
    }
  },
  created() {
    this.cache = {}
  },
  methods: {
    /** dialog 隐藏 */
    dialogClose() {
      this.cache = {}
      this.cacheApi = {}
      this.gridData = []
      this.skuStock = {}
      this.newcacheApi = {}
      this.newcountnum = {}
      this.newgridData = []
      this.errarrry = []
      this.PickingOrderData.forEach(v => v.sum = '')
      this.pickOperatorName = ''
      this.getbtn = false
    },
    /** popover 隐藏事件 */
    handlePopoverHide(indexHide, itemHide) {
      if (!this.dialogVisible) return
      // 切换选择时， hide 是后发生的
      if (itemHide && this.gridData.item !== itemHide) {
        return
      }
      if (this.gridData.length) {
        let item = this.gridData.item
        let sum = ''
        let map = {}
        let total = 0
        this.gridData.forEach(v => {
          if (!v.num) return
          if (sum.length) {
            sum += ','
          }
          map[v.id] = v.num
          sum += (v.warehouseSpaceCode + ':' + v.num)
          total += v.num
        })
        item.sortList = map
        item.sum = sum
        item.total = total
        this.PickingOrderData = [...this.PickingOrderData]
        this.cache[item.skuCode + item.planCode] = JSON.parse(JSON.stringify(this.gridData))
        this.gridData = []
      }
    },
    getorder() {
      this.cache = {}
      this.newcacheApi = {}
      let ownlength = this.PickingOrderData.length
      let i = 0
      let that = this
      this.getbtn = true
      this.errarrry = []
      function getdata() {
        if (ownlength > 0) {
          let Numkey = that.PickingOrderData[i].planCode + that.PickingOrderData[i].ownerCode + that.PickingOrderData[i].skuCode
          let ownkey = that.PickingOrderData[i].ownerCode + that.PickingOrderData[i].skuCode
          that.newcountnum[Numkey] = {}
          let basicnum = that.PickingOrderData[i].planOutQty - that.PickingOrderData[i].sortQty
          const _ = (data) => {
            that.newgridData = data.map((item, index) => {
              item.index = index + 1
              item.qty = item.skuQty - item.blockQty
              if (basicnum > 0) {
                if (basicnum - item.qty > 0) {
                  item.num = item.qty
                  basicnum = basicnum - item.qty
                  item.qty = 0
                } else if (basicnum - item.qty == 0) {
                  item.num = item.qty
                  basicnum = 0
                  item.qty = 0
                } else if (basicnum - item.qty < 0) {
                  item.num = basicnum
                  item.qty = item.qty - basicnum
                  basicnum = 0
                }
              } else {
                basicnum = 0
              }
              return item
            })
            that.newgridData.item = that.PickingOrderData[i]
            if (that.newgridData.length) {
              let item = that.newgridData.item
              let sum = ''
              let map = {}
              let total = 0
              that.newgridData.forEach(v => {
                if (!v.num) return
                if (sum.length) {
                  sum += ','
                }
                map[v.id] = v.num
                sum += (v.warehouseSpaceCode + ':' + v.num)
                total += v.num
                let ownid = v.id
                that.newcountnum[Numkey][ownid] = v.num
              })
              that.PickingOrderData[i].sortList = map
              that.PickingOrderData[i].sum = sum
              that.PickingOrderData[i].total = total
              that.PickingOrderData = [...that.PickingOrderData]
              that.newgridData = []
            }
          }
          if (that.newcacheApi[ownkey]) {
            _(that.newcacheApi[ownkey])
            if (that.newcacheApi[ownkey].length <= 0) {
              that.errarrry.push('error')
            }
            i++
            ownlength--
            if (ownlength >= 0) {
              getdata()
            }
          } else {
            getInfoOnPageInventory({
              ownerCode: that.PickingOrderData[i].ownerCode,
              skuCode: that.PickingOrderData[i].skuCode
            }).then(res => {
              if (res) {
                that.newcacheApi[ownkey] = res.data
                res.data.forEach(v => {
                  that.skuStock[v.id] = { code: v.warehouseSpaceCode, qty: v.skuQty - v.blockQty }
                })
                _(res.data)
                if (res.data.length <= 0) {
                  that.errarrry.push('error')
                }
                i++
                ownlength--
                if (ownlength >= 0) {
                  getdata()
                }
              } else {
                that.getbtn = false
              }
            })
          }
        } else {
          if (that.errarrry.length > 0) {
            that.$message({ type: 'error', message: '部分商品库存为0，系统无法给出匹配的库位!' })
          }
          return
        }
      }
      getdata()
    },
    /** 选择 通知拣货数量 */
    handleSelectSon(index, item, type) {
      let numKey = item.planCode + item.ownerCode + item.skuCode
      if (this.gridData.length) {
        this.handlePopoverHide()
      }
      const _ = (data) => {
        this.gridData = data.map((item, index) => {
          item.index = index + 1
          item.qty = item.skuQty - item.blockQty
          item.num = 0
          return item
        })
        this.gridData.item = item
      }
      const countNum = (data) => {
        this.gridData = data.map((item, index) => {
          item.index = index + 1
          item.qty = item.skuQty - item.blockQty
          item.num = this.newcountnum[numKey][item.id] ? this.newcountnum[numKey][item.id] : 0;
          return item
        })
        this.gridData.item = item
      }
      if (this.cache[item.skuCode + item.planCode]) {
        this.gridData = this.cache[item.skuCode + item.planCode]
        this.gridData.item = item
      } else {
        if (this.newcacheApi[item.ownerCode + item.skuCode]) {
          countNum(this.newcacheApi[item.ownerCode + item.skuCode])
        } else {
          let key = item.ownerCode + item.skuCode
          if (this.cacheApi[key]) {
            _(this.cacheApi[key])
          } else {
            this.sonTableLoading = true
            getInfoOnPageInventory({
              ownerCode: item.ownerCode,
              skuCode: item.skuCode
            }).then(res => {
              if (res) {
                this.cacheApi[key] = JSON.parse(JSON.stringify(res.data))
                res.data.forEach(v => {
                  this.skuStock[v.id] = { code: v.warehouseSpaceCode, qty: v.skuQty - v.blockQty }
                })
                _(res.data)
              }
              this.sonTableLoading = false;
            })
          }
        }
      }
    },
    surePicking() {
      if (this.pickOperatorName === '') {
        this.$message({ type: 'error', message: '拣货人姓名必填' });
        return
      }
      if (this.gridData.length) {
        this.handlePopoverHide()
      }
      let json = {}
      let skuStock = JSON.parse(JSON.stringify(this.skuStock))
      json.pickOrderDetailAddReqList = []
      this.PickingOrderData.map(item => {
        if (item.sum) {
          json.pickOrderDetailAddReqList.push(item)
        }
      })
      // json.pickOrderDetailAddReqList = JSON.parse(JSON.stringify(this.PickingOrderData))
      let sortListSum = 0
      if (json.pickOrderDetailAddReqList.some(v => {
        let total = v.total || 0
        delete v.total
        delete v.sum
        sortListSum += total
        v.sortList && Object.keys(v.sortList).forEach(id => {
          skuStock[id].num = skuStock[id].num || 0
          skuStock[id].num += v.sortList[id]
        })
        if (v.planOutQty - v.sortQty > 0) {
          if (total > v.planOutQty - v.sortQty) {
            this.$message({ type: 'error', message: `计划单 ${v.planCode} 的本次出库数量应该在 0-${v.planOutQty - v.sortQty} 之间` })
            return true
          }
        }
      })) {
        return
      }
      if (!sortListSum) {
        return this.$message({ type: 'error', message: '请选择拣货数量' })
      }
      for (let key in skuStock) {
        let item = skuStock[key]
        if (item.num !== undefined && item.num > item.qty) {
          return this.$message({ type: 'error', message: `库位【${item.code}】的可用库存为${item.qty}，当前已使用${item.num}` })
        }
      }
      json.pickOperatorId = '666'
      json.pickType = 0;
      json.pickOperatorName = this.pickOperatorName;
      pickOrderAdd(json).then(res => {
        if (res) {
          this.$message({ type: 'success', message: '操作成功!' });
          this.dialogVisible = false
          this.$emit('submited')
        }
      })
    },
    pickingOrder() {
      this.PickingOrderData = [...this.childSelectRows]
      if (!this.PickingOrderData.length) {
        this.$message({ type: 'error', message: '未选择子表里商品' });
        return
      }
      this.dialogVisible = true;
    },
    printPlanOrder() {
      var printPlanContainer = document.getElementById('printPlanContainer').innerHTML
      MakePrint(printPlanContainer)
    }
  }
}
</script>

<style scoped lang="scss">
.labelContainer {
  width: 180px;
  .labelItemLeft {
    display: inline-block;
    width: 60px;
    margin-right: 10px;
  }
}
.pointout {
  color: red;
}
</style>

