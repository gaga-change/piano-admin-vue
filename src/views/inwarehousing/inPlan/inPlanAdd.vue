<template>
  <div class="TakeStockBillingCom">
    <el-form
      ref="form"
      label-width="100px"
      :model="formData"
      :rules="rules"
      :inline="true"
    >
      <div>
        <item-title>基本信息</item-title>
        <el-form-item
          label="单据类型"
          prop="busiBillType"
        >
          <el-select
            style="width:200px;"
            v-model="formData.busiBillType"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in mapConfig['busiBillTypeEnum_in'] || []"
              :key="item.name"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="外部单号"
          prop="busiBillNo"
        >
          <el-input
            style="width:200px;"
            v-model="formData.busiBillNo"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="货主"
          prop="ownerCode"
        >
          <el-select
            style="width:200px;"
            v-model="formData.ownerCode"
            @change="handleOwnerCodeChange"
            placeholder="请选择"
            filterable
            clearable
            :loading="ownerLoading"
          >
            <el-option
              v-for="(item, index) in mapConfig['_customer_type1_enum'] || []"
              :key="index"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="供应商"
          prop="providerCode"
        >
          <el-select
            style="width:200px;"
            v-model="formData.providerCode"
            placeholder="请选择"
            clearable
            filterable
            @change="handleProviderCodeChange"
            :loading="providerLoading"
          >
            <el-option
              v-for="item in mapConfig['_customer_type2_enum'] || []"
              :key="item.name"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="计划入库日期"
          prop="planTime"
        >
          <el-date-picker
            style="width:200px;"
            v-model="formData.planTime"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          >
            >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="备注"
          prop="remarkInfo"
        >
          <el-input
            style="width:200px;"
            v-model="formData.remarkInfo"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
      </div>
      <div class="mt25">
        <item-title>商品信息 <el-button
            class="ml20"
            type="primary"
            :disabled="!formData.ownerCode"
            @click="selectProductVisible = true"
          >
            添加商品
          </el-button>
          <el-tooltip
            class="item"
            effect="dark"
            content="选择货主后才能添加商品，切换货主会清空已添加的商品"
            placement="right"
          >
            <i
              class="el-icon-info"
              style="color: #909399;"
            ></i>
          </el-tooltip>
        </item-title>
      </div>
      <div class="mt20">
        <base-table
          :config="skuConfig"
          :data="tableData"
          :showControl="true"
        >
          <template slot-scope="scope">
            <el-link
              type="warning"
              @click="handleDelRow(scope.row, scope.index)"
            >
              删除
            </el-link>
          </template>
        </base-table>
      </div>
      <div class="mt20">
        <el-button
          type="primary"
          size="mini"
          @click="handleSubmitForm"
          :loading="submitLoading"
        >
          提交
        </el-button>
        <el-button
          size="mini"
          @click="handleResetForm"
          :disabled="submitLoading"
        >
          重置
        </el-button>
      </div>
    </el-form>
    <select-product
      ref="selctProduct"
      :visible.sync="selectProductVisible"
      :selectData.sync="tableData"
      :ownerCode="formData.ownerCode"
    />
  </div>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
import { addInWarehousePlan, customerList } from '@/api'
import selectProduct from './components/selectProduct'

export const skuConfig = [
  { label: '商品编码 ', prop: 'skuCode' },
  { label: '商品名称 ', prop: 'skuName' },
  { label: '规格', prop: 'lotAttrCode1' },
  { label: '型号', prop: 'lotAttrCode2' },
  { label: '单位', prop: 'lotAttrCode3' },
  { label: '数量', prop: 'planInQty', edit: true, inputType: 'number', min: 1, max: 999999, width: 170 },
]
export default {
  components: { selectProduct },
  data() {
    return {
      skuConfig,
      submitLoading: false,
      providerLoading: false,
      ownerLoading: false,
      selectProductVisible: false,
      tableData: [],
      formData: {
        busiBillType: undefined,
        busiBillNo: undefined,
        ownerCode: undefined,
        ownerName: undefined,
        providerCode: undefined,
        providerName: undefined,
        planTime: undefined,
        remarkInfo: undefined,
      },
      rules: {
        busiBillType: [{ required: true, message: '必填项', trigger: ['blur', 'change'] }],
        busiBillNo: [{ max: 30, message: '不能超过30个字符', trigger: ['blur', 'change'] }],
        ownerCode: [{ required: true, message: '必填项', trigger: ['blur', 'change'] }],
        providerCode: [{ required: true, message: '必填项', trigger: ['blur', 'change'] }],
        planTime: undefined,
        remarkInfo: [{ max: 50, message: '不能超过50个字符', trigger: ['blur', 'change'] }],
        orderType: [
          { required: true, message: '必填项', trigger: ['blur', 'change'] },
        ]
      },
    }
  },
  computed: {
    orderType() {
      return this.formData.orderType
    },
    ...mapGetters([
      'mapConfig',
      'visitedViews'
    ])
  },
  created() {
    this.initCustomer()
    this.initProvider()
  },
  methods: {
    /** 获取货主列表 */
    initCustomer() {
      this.ownerLoading = true
      customerList({ pageSize: 9999, status: 0, customerType: 1 }).then(res => {
        this.ownerLoading = false
        if (!res) return
        this.$store.commit('ADD_MAP', {
          name: '_customer_type1_enum',
          keyValue: (res.data.list || []).map(v => {
            return {
              name: v.customerName,
              value: v.customerCode,
            }
          })
        })
      })
    },
    /** 获取供应商 */
    initProvider() {
      this.providerLoading = true
      customerList({ pageSize: 9999, status: 0, customerType: 2 }).then(res => {
        this.providerLoading = false
        if (!res) return
        this.$store.commit('ADD_MAP', {
          name: '_customer_type2_enum',
          keyValue: (res.data.list || []).map(v => {
            return {
              name: v.customerName,
              value: v.customerCode,
            }
          })
        })
      })
    },
    /** 盘点类型切换 */
    handleOrderTypeChange(v) {
      this.tableData = []
      this.$refs['selctProduct'].resetForm()
    },
    /** 提交 */
    handleSubmitForm() {
      const view = this.visitedViews.filter(v => v.path === this.$route.path)
      this.$refs['form'].validate((valid) => {
        if (!this.tableData.length) {
          return this.$message.error('请添加商品！')
        }
        if (valid) {
          let temp = this.tableData.find(({ planInQty }) => planInQty === '' || planInQty === undefined || planInQty === null)
          if (temp) {
            return this.$message.error(`请输入商品【${temp.skuName}】的数量`)
          }
          this.submitLoading = true
          addInWarehousePlan({
            items: this.tableData.map((v, index) => {
              return {
                id: v.id,
                skuCode: v.skuCode,
                busiIndex: index + 1,
                planInQty: v.planInQty
              }
            }),
            ...this.formData
          }).then(res => {
            if (!res) {
              this.submitLoading = false
              return
            }
            this.$message({
              type: 'success',
              message: '操作成功,即将跳转到列表页！',
              duration: 1500,
              onClose: () => {
                this.$store.dispatch('delVisitedViews', view[0]).then(() => {
                  this.$router.push({
                    path: `/inwarehousing/inPlanList`
                  })
                }).catch(err => {
                })
              }
            })
          })
        }
      })
    },
    /** 货主切换 */
    handleOwnerCodeChange(code) {
      let temp = this.mapConfig['_customer_type1_enum'].find(v => v.value === code)
      this.formData.ownerName = temp ? temp.name : ''
      this.tableData = []
    },
    /* 供应商切换 */
    handleProviderCodeChange(code) {
      let temp = this.mapConfig['_customer_type2_enum'].find(v => v.value === code)
      this.formData.providerName = temp ? temp.name : ''
    },
    /** 重置 */
    handleResetForm() {
      this.$refs['form'] && this.$refs['form'].resetFields()
      this.$refs['selctProduct'].resetForm()
      this.tableData = []
    },
    /** 删除行 */
    handleDelRow(row, index) {
      this.$confirm(`将删除该商品, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableData.splice(index, 1)
        this.$message.success('删除成功')
      }).catch(() => { })
    },
  },
}
</script>

<style lang="scss">
.TakeStockBillingCom {
  padding: 20px;
}
</style>
