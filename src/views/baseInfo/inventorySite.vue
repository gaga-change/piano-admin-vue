<template>
  <div class="InventorySiteComponent">
    <base-list
      ref="baseList"
      :tableConfig="tableConfig"
      :searchConfig="searchConfig"
      :api="warehouseSpaceSelect"
      :parseData="parseData"
      :appendSearchParams="appendSearchParams"
      :showControl="true"
      :controlWidth="240"
      :select="true"
      @selectionChange="dataSelect"
    >
      <template slot-scope="scope">
        <template v-if="scope.row.warehouseAreaCode !== 'Z'">
          <el-button
            class=" ml5 mr5"
            size="mini"
            :type="scope.row.inLock ? 'primary': 'warning'"
            plain
            :loading="scope.row.updateLockStatusInLoading"
            @click="handleLock(scope.row, scope.index, 'in')"
          >
            {{scope.row.inLock ? '解锁入库' : '入库锁定'}}
          </el-button>
          <el-button
            class=" ml5 mr5"
            size="mini"
            :type="scope.row.outLock ? 'primary': 'warning'"
            plain
            :loading="scope.row.updateLockStatusOutLoading"
            @click="handleLock(scope.row, scope.index, 'out')"
          >
            {{scope.row.outLock ? '解锁出库' : '出库锁定'}}
          </el-button>
          <button
            class="btn-link ml5 mr5 mt10"
            type="button"
            :disabled="scope.row.inLock === 1 || scope.row.outLock === 1"
            @click="handleSetStorage(scope.row)"
          >
            库位设置
          </button>
        </template>
      </template>
      <template slot="btns">
        <el-button
          type="primary"
          @click="formHandle('add')"
        >添加</el-button>
        <el-button
          type="primary"
          @click="printSite"
        >打印库位码</el-button>
      </template>
    </base-list>
    <el-dialog
      :title="dialogTitle+'库位'"
      :visible.sync="dialogVisible"
      width="600px"
    >
      <el-form
        :model="formParams"
        ref="subForm"
        label-width="70px"
        label-position="left"
      >
        <el-form-item
          label="库区编码"
          prop="warehouseAreaCode"
          label-width="70px"
          :rules="[{ required: true, message: '请选择库区'}]"
        >
          <el-select
            v-model="formParams.warehouseAreaCode"
            clearable
            placeholder="请选择库区"
            :disabled="this.formType!='add'"
            size="mini"
          >
            <el-option
              v-for="item in warehouseAreaCodeEnum"
              :key="item.warehouseAreaCode"
              :label="item.warehouseAreaCode"
              :value="item.warehouseAreaCode"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="库位编码"
          label-width="70px"
          :rules="[{ required: true, message: '请选择库位'}]"
        >
          <div class="inventorySite">
            <span class="tip">从</span>
            <el-input
              type="text"
              style="width:150px"
              size="mini"
              placeholder="请输入1-99整数"
              :min="1"
              :max="99"
              v-model="formParams.platoonStart"
            ></el-input>

            <span class="tip">到</span>
            <el-input
              type="text"
              size="mini"
              style="width:150px"
              placeholder="请输入1-99整数"
              :min="1"
              :max="99"
              v-model="formParams.platoonEnd"
              class="siteInput"
            ></el-input>
            <span class="tip"></span>
          </div>

          <div class="inventorySite">
            <span class="tip">从第</span>
            <el-input
              type="text"
              size="mini"
              placeholder="请输入1-99整数"
              :min="1"
              :max="99"
              v-model="formParams.columnStart"
              class="siteInput"
            ></el-input>

            <span class="tip">层到</span>
            <el-input
              type="text"
              size="mini"
              placeholder="请输入1-99整数"
              :min="1"
              :max="99"
              v-model="formParams.columnEnd"
              class="siteInput"
            ></el-input>
            <span class="tip">层</span>
          </div>

          <div class="inventorySite">
            <span class="tip">库位从第</span>
            <el-input
              type="text"
              size="mini"
              placeholder="请输入1-99整数"
              :min="1"
              :max="99"
              v-model="formParams.floorStart"
              class="siteInput"
            ></el-input>

            <span class="tip">层到</span>
            <el-input
              type="text"
              size="mini"
              placeholder="请输入1-99整数"
              :min="1"
              :max="99"
              v-model="formParams.floorEnd"
              class="siteInput"
            ></el-input>
            <span class="tip">层</span>
          </div>
        </el-form-item>
      </el-form>
      <div>提示：第一行是货架，第二行是货架层高，第三行是具体库位号</div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          @click="dialogVisible = false"
          size="mini"
        >取 消</el-button>
        <el-button
          size="mini"
          type="primary"
          @click="submitIt"
        >确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="打印库位码"
      :visible.sync="dialogVisibleSite"
      width="70%"
    >
      <div
        id="print"
        class="printSiteCss"
      >
        <div
          v-for="item in multipleParentSelection"
          class="printItemCss"
          :key="item.warehouseSpaceCode"
        >
          <bar-code
            :code="item.warehouseSpaceCode"
            fontSize="5mm"
            mw="0.3"
          ></bar-code>
        </div>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          size="mini"
          @click="dialogVisibleSite = false"
        >取 消</el-button>
        <el-button
          size="mini"
          type="primary"
          @click="printIt"
        >打印</el-button>
      </span>
    </el-dialog>
    <set-storage
      :visible.sync="setStorageVisible"
      :row="selectedRow"
      @submited="getTableData()"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { SimpleMsg } from '@/utils/luoFun'
import { addInventorySite, warehouseSpaceSelect, warehouseSpaceUpdateLockStatus, deleteInventorySite, getSelectInventoryAreaList } from '@/api'
import { MakePrint } from '@/utils/luoFun'
import setStorage from './components/setStorage'
const tableConfig = [
  { label: '库区编码', prop: 'warehouseAreaCode', minWidth: 120 },
  { label: '库位编码', prop: 'warehouseSpaceCode', minWidth: 120 },
  { label: '入库锁', prop: 'inLock', width: 80, type: 'enum', enum: 'lockEnum' },
  { label: '出库锁', prop: 'outLock', width: 80, type: 'enum', enum: 'lockEnum' },
  { label: '创建人', prop: 'createrName', minWidth: 90 },
  { label: '创建时间', prop: 'gmtCreate', type: 'time', width: 140 },
]
const searchConfig = [
  { label: '库区编码', prop: 'warehouseAreaCode' },
  { label: '库位编码', prop: 'warehouseSpaceCode' },
]
export default {
  components: { setStorage },
  data() {
    return {
      tableConfig,
      searchConfig,
      warehouseSpaceSelect,
      setStorageVisible: false,
      appendSearchParams: { warehouseCode: undefined },
      dialogVisible: false,
      dialogTitle: '',
      multipleParentSelection: [],//选中的主表
      formParams: {},
      formType: '',
      warehouseAreaCodeEnum: [],
      dialogVisibleSite: false,
      selectedRow: null,
    }
  },
  computed: {
    ...mapGetters([
      'warehouseMap',
      'chooseWarehouse',
    ]),
  },
  created() {
    this.appendSearchParams.warehouseCode = this.chooseWarehouse
    getSelectInventoryAreaList({
      warehouseCode: this.chooseWarehouse
    }).then(res => {
      if (!res) return
      this.warehouseAreaCodeEnum = res.data || []
    })
  },
  methods: {
    /** 刷新列表 */
    getTableData() {
      this.$refs['baseList'].fetchData()
    },
    /** 返回列表添加字段 */
    parseData(res) {
      let data = res.data.list || []
      let total = res.data.total
      data.forEach(v => {
        v.updateLockStatusOutLoading = false
        v.updateLockStatusInLoading = false
      })
      return { data, total }
    },
    /** 出入库 解锁或锁定 */
    handleLock(row, index, type) {
      let flag = null
      let isIn = type === 'in'
      let id = row.id
      if (isIn && row.inLock) {
        flag = 2 // 入库解锁
      } else if (isIn && !row.inLock) {
        flag = 1 // 入库锁定
      } else if (!isIn && row.outLock) {
        flag = 4 // 出库解锁
      } else {
        flag = 3 // 出库锁定
      }
      isIn ? row.updateLockStatusInLoading = true : row.updateLockStatusOutLoading = true
      let item = row
      warehouseSpaceUpdateLockStatus(id, {
        flag
      }).then(res => {
        isIn ? row.updateLockStatusInLoading = false : row.updateLockStatusOutLoading = false
        if (!res) return
        if (isIn && row.inLock) {
          item.inLock = 0
        } else if (isIn && !row.inLock) {
          item.inLock = 1
        } else if (!isIn && row.outLock) {
          item.outLock = 0
        } else {
          item.outLock = 1
        }
      })
    },
    /** 显示库位设置 */
    handleSetStorage(row) {
      this.setStorageVisible = true
      this.selectedRow = row
    },
    //主表多选
    dataSelect(selectData) {
      this.multipleParentSelection = [...selectData]
    },
    printSite() {
      if (this.multipleParentSelection.length > 0) {
        this.dialogVisibleSite = true;
      } else {
        this.$message({
          type: 'info',
          message: '请选择需要打印的库位码'
        })
      }
    },
    printIt() {
      var useStyle = `<style type='text/css'> 
                                .printItemCss{
                                    width:40mm;
                                    height:25mm;   
                                }  
                                img{
                                    width: 100%;
                                    height: 100%;
                                }
                               </style>`
      MakePrint(document.getElementById('print').innerHTML, useStyle)
    },
    submitIt() {
      this.$refs['subForm'].validate((valid) => {
        if (valid) {
          if (this.formParams.platoonEnd < this.formParams.platoonStart) {
            this.$message({
              type: 'info',
              message: '输入货架编号有误，结束编号必须不小于开始编号！'
            })
            return false
          }
          if (this.formParams.columnEnd < this.formParams.columnStart) {
            this.$message({
              type: 'info',
              message: '输入货架层高编号有误，结束编号必须不小于开始编号！'
            })
            return false
          }
          if (this.formParams.floorEnd < this.formParams.floorStart) {
            this.$message({
              type: 'info',
              message: '输入具体库位编号有误，结束编号必须不小于开始编号'
            })
            return false
          }
          addInventorySite({
            ...this.formParams
          }).then(res => {
            if (!res) return
            SimpleMsg({
              result: res.success,
              msgType: 'add',
              msg: '库位',
              cb: () => {
                this.dialogVisible = false;
                this.getTableData()
              }
            })
          })
        } else {
          return false;
        }
      });
    },
    formHandle(type) {
      if (type == 'add') {
        this.formParams = {}
      } else if (type == 'edit') {
        this.dialogTitle = '修改'
      } else if (type == "watch") {
        this.dialogTitle = '查看'
      }
      this.formType = type

      this.dialogVisible = true

    },
    formDelect(data) {
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteInventorySite(data).then(res => {
          if (!res) return
          SimpleMsg({
            result: res.success,
            msgType: 'delete',
            msg: '库位',
            cb: () => {
              this.dialogVisible = false;
              this.getTableData()
            }
          })
        })
      }).catch(() => { })
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.InventorySiteComponent {
  .inventorySite {
    display: flex;
    .tip {
      flex: 2;
      text-align: center;
    }
    .siteInput {
      flex: 4;
    }
  }
  .printSiteCss {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-content: space-between;
    .printItemCss {
      width: 40mm;
      height: 25mm;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>