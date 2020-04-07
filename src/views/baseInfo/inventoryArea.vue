<template>
  <div class="InventoryAreaComponent">
    <base-list
      ref="baseList"
      v-if="chooseWarehouse"
      :tableConfig="tableConfig"
      :searchConfig="searchConfig"
      :api="getInventoryArea"
      :parseData="parseData"
      :showControl="true"
      :appendSearchParams="appendSearchParams"
      :controlWidth="240"
    >
      <template slot-scope="scope">
        <template v-if="scope.row.warehouseAreaCode !== 'Z'">
          <el-button
            class="ml5 mr5"
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
          <el-button
            class="btn-link ml5 mr5 mt10"
            @click="formParams={...scope.row};formHandle('edit')"
          >
            修改
          </el-button>
          <el-button
            class="btn-link ml5 mr5 mt10"
            @click="formDelete(scope.row)"
          >
            删除
          </el-button>
        </template>
      </template>
      <template slot="btns">
        <el-button
          type="primary"
          size="mini"
          @click="formHandle('add')"
        >添加</el-button>
      </template>
    </base-list>
    <el-dialog
      :title="dialogTitle+'库区'"
      :visible.sync="dialogVisible"
      width="420px"
    >
      <el-form
        :model="formParams"
        class="formInput"
        ref="subForm"
        label-width="70px"
        label-position="left"
      >
        <el-form-item
          label="仓库编码"
          prop="warehouseCode"
        >
          <el-input
            type="text"
            size="mini"
            v-model="chooseWarehouse"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item
          label="仓库名称"
          prop="warehouseName"
        >
          <el-input
            type="text"
            size="mini"
            v-model="warehouseName"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item
          label="库区编码"
          prop="warehouseAreaCode"
          :rules="[
          { required: true, message: '请选择库区'},
          { min: 1, max: 6, message: '长度在 1 到 6 个字符', trigger: 'change' }, 
          { pattern: /^[0-9a-zA-Z]+$/, message: '只能输入字母和数字' }]"
        >
          <el-input
            :disabled="formType!='add'"
            type="primary"
            v-model="formParams.warehouseAreaCode"
            placeholder="请输入库区"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="是否虚拟区"
          label-width="90px"
          prop="isVirtual"
        >
          <el-switch
            v-model="formParams.isVirtual"
            :disabled="formType!='add'"
            :active-value="1"
            :inactive-value="0"
          >
          </el-switch>
        </el-form-item>
        <el-form-item
          label="库区性质"
          prop="warehouseAreaNature"
          :rules="[{ required: true, message: '请选择库区性质'}]"
        >
          <el-select
            v-model="formParams.warehouseAreaNature"
            clearable
            placeholder="请选择库区性质"
            :disabled="formType!='add'"
            size="mini"
          >
            <el-option
              v-for="item in mapConfig['warehouseAreaNatureEnum']"
              :key="item.name"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="库区功能"
          prop="warehouseAreaDesc"
        >
          <el-input
            type="textarea"
            :maxlength="100"
            size="mini"
            v-model="formParams.warehouseAreaDesc"
            :disabled="this.formType=='watch'"
          ></el-input>
        </el-form-item>
      </el-form>
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { SimpleMsg } from '@/utils/luoFun'
import { getInventoryArea, addInventoryArea, updateInventoryArea, warehouseAreaUpdateLockStatus, deleteInventoryArea } from '@/api'
const tableConfig = [
  { label: '库区编码', prop: 'warehouseAreaCode' },
  { label: '库区性质', prop: 'warehouseAreaNature', type: 'enum', enum: 'warehouseAreaNatureEnum' },
  { label: '入库锁', prop: 'inLock', width: 80, type: 'enum', enum: 'lockEnum' },
  { label: '出库锁', prop: 'outLock', width: 80, type: 'enum', enum: 'lockEnum' },
  { label: '是否虚拟区', prop: 'isVirtual', type: 'enum', enum: 'yesOrNoEnum' },
  { label: '创建人', prop: 'createrName' },
  { label: '创建时间', prop: 'gmtCreate', type: 'time', width: 140 },
  { label: '描述', prop: 'warehouseAreaDesc' },
]
const searchConfig = [
  { label: '库区编码', prop: 'warehouseAreaCode' },
  { label: '是否虚拟区', prop: 'isVirtual', type: 'enum', enum: 'yesOrNoEnum' },
  { label: '库区性质', prop: 'warehouseAreaNature', type: 'enum', enum: 'warehouseAreaNatureEnum' },
]

export default {
  data() {
    return {
      tableConfig,
      searchConfig,
      getInventoryArea,
      appendSearchParams: { warehouseCode: undefined },
      dialogVisible: false,
      dialogTitle: '',
      formParams: {
        isVirtual: 0
      },
      formType: '',
      warehouseName: '',
    }
  },
  computed: {
    ...mapGetters([
      'warehouseMap',
      'chooseWarehouse',
      'mapConfig'
    ]),
  },
  created() {
    this.appendSearchParams.warehouseCode = this.chooseWarehouse
    this.warehouseMap.map(item => {
      if (item.warehouseNo == this.chooseWarehouse) {
        this.warehouseName = item.warehouseName

      }
    })
  },
  activated() {
    this.warehouseMap.map(item => {
      if (item.warehouseNo == this.chooseWarehouse) {
        this.warehouseName = item.warehouseName
      }
    })
    this.getTableData()
  },
  methods: {
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
      warehouseAreaUpdateLockStatus(id, {
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
    getTableData() {
      this.$refs['baseList'].fetchData()
    },
    submitIt() {
      this.$refs['subForm'].validate((valid) => {
        if (valid) {
          this.formParams.warehouseCode = this.chooseWarehouse
          this.formParams.warehouseAreaName = this.formParams.warehouseAreaCode
          if (this.formParams.id) {
            updateInventoryArea({ ...this.formParams }).then(res => {
              if (!res) return
              SimpleMsg({
                result: res.success,
                msgType: 'edit',
                msg: '库区',
                cb: () => {
                  this.dialogVisible = false;
                  this.getTableData()
                }
              })
            })
          } else {
            addInventoryArea({ ...this.formParams }).then(res => {
              if (!res) return
              SimpleMsg({
                result: res.success,
                msgType: 'add',
                msg: '库区',
                cb: () => {
                  this.dialogVisible = false;
                  this.getTableData()
                }
              })
            })
          }
        } else {
          return false
        }
      })
    },
    formHandle(type) {
      if (type == 'add') {
        this.formParams = { isVirtual: 0 }
      } else if (type == 'edit') {
        this.dialogTitle = '修改'
      } else if (type == "watch") {
        this.dialogTitle = '查看'
      }
      this.formType = type
      this.dialogVisible = true
    },
    formDelete(data) {
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteInventoryArea(data).then(res => {
          if (!res) return
          SimpleMsg({
            result: res.success,
            msgType: 'delete',
            msg: '库区',
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
.InventoryAreaComponent {
  .formInput {
    input {
      width: 220px;
    }
  }
}
</style>