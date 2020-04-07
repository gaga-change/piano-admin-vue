<template>
  <div v-loading="detailLoading">
    <div>
      <item-title>基本信息</item-title>
      <base-form
        :config="formBaseConfig"
        :rules="baseRules"
        ref="baseForm"
      >
      </base-form>
    </div>

    <div class="mt25">
      <item-title>补充信息</item-title>
      <baseSelfForm
        :config="formAppendConfig"
        :rules="appendRules"
        :inline="true"
        ref="appendForm"
      >
      </baseSelfForm>
    </div>
    <div class="mt25">
      <el-button
        type="primary"
        @click="handleSubmit"
        :loading="loading"
      >提交</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { customerList, skuSave, skuQueryDetailById, skuEdit } from '@/api'
import baseForm from './components/BaseForm'

const formConfig = [
  { label: '仓库编码', prop: 'warehouseCode', width: 120 },
  { label: '仓库名称', prop: 'warehouseName' },
  { label: '类型', prop: 'type', type: 'enum', enum: 'warehouseTypeEnum' },
  { label: '联系人', prop: 'linkName' },
  { label: '详细地址', prop: 'warehouseAddress' },
  { label: '状态', prop: 'status', type: 'radio', enum: 'warehouseStatusEnum', default: 0 },
]
const rules = {
  warehouseCode: [
    { required: true, message: '必填项', trigger: ['blur', 'change'] },
    { pattern: /^[0-9a-zA-Z]*$/, message: '只能输入数字或字母' },
    { min: 0, max: 20, message: '不能超过20个字符', trigger: ['blur', 'change'] }
  ],
  warehouseName: [{ required: true, message: '必填项', trigger: ['blur', 'change'] }, { min: 0, max: 50, message: '不能超过50个字符', trigger: ['blur', 'change'] }],
  type: [{ required: true, message: '必填项', trigger: ['blur', 'change'] }],
  linkName: [{ min: 0, max: 20, message: '不能超过20个字符', trigger: ['blur', 'change'] }],
  warehouseAddress: [{ min: 0, max: 100, message: '不能超过100个字符', trigger: ['blur', 'change'] }],
  status: [{ required: true, message: '必填项', trigger: ['blur', 'change'] }],
}

const formBaseConfig = [
  { label: '商品编码', prop: 'skuCode' },
  { label: '商品名称', prop: 'skuName' },
  { label: '货主', prop: 'ownerCode', type: 'enum', enum: '_customer_type1_enum' },
  { label: '商品品类', prop: 'lotAttrCode6' },
  { label: '单位', prop: 'lotAttrCode3' },
  { label: '规格', prop: 'lotAttrCode1' },
  { label: '型号', prop: 'lotAttrCode2' },
  { label: '品牌', prop: 'lotAttrCode12' },
]

const baseRules = {
  skuCode: [
    { required: true, message: '必填项', trigger: ['blur', 'change'] },
    { pattern: /^[0-9a-zA-Z]*$/, message: '只能输入数字或字母' },
    { min: 0, max: 20, message: '不能超过20个字符', trigger: ['blur', 'change'] }
  ],
  skuName: [
    { required: true, message: '必填项', trigger: ['blur', 'change'] },
    { max: 30, message: '不能超过30个字符', trigger: ['blur', 'change'] }
  ],
  ownerCode: [
    { required: true, message: '必填项', trigger: ['blur', 'change'] },
  ],
  lotAttrCode6: [
    { max: 20, message: '不能超过20个字符', trigger: ['blur', 'change'] }
  ],
  lotAttrCode3: [
    { required: true, message: '必填项', trigger: ['blur', 'change'] },
    { max: 15, message: '不能超过15个字符', trigger: ['blur', 'change'] }
  ],
  lotAttrCode1: [
    { required: true, message: '必填项', trigger: ['blur', 'change'] },
    { max: 15, message: '不能超过15个字符', trigger: ['blur', 'change'] }
  ],
  lotAttrCode2: [
    { required: true, message: '必填项', trigger: ['blur', 'change'] },
    { max: 15, message: '不能超过15个字符', trigger: ['blur', 'change'] }
  ],
  lotAttrCode12: [
    { required: true, message: '必填项', trigger: ['blur', 'change'] },
    { max: 15, message: '不能超过15个字符', trigger: ['blur', 'change'] }
  ],
}

const formAppendConfig = [
  { label: '长', prop: 'lotAttrCode8', unit: '单位：cm', type: 'inputNumber' },
  { label: '宽', prop: 'lotAttrCode9', unit: '单位：cm', type: 'inputNumber' },
  { label: '高', prop: 'lotAttrCode10', unit: '单位：cm', type: 'inputNumber' },
  { label: '体积', prop: 'bulk', unit: '单位：m³', disabled: true, placeholder: '输入长宽高自动计算' },
  { label: '重量', prop: 'lotAttrCode11', unit: '单位：kg' },
  { label: '最小库存', prop: 'minStock' },
]
let maxRule = {
  validator(rule, value, callback) {
    value === '' || value === undefined || value <= 5000 ? callback() : callback('数值不能超过5000')
  },
  trigger: ['blur', 'change']}

const appendRules = {
  lotAttrCode8: [{ pattern: /(^[1-9](\d+)?(\.\d{1,3})?$)|(^\d\.\d{1,3}$)/, message: '请输入大于0的数字，最多包含3位小数', trigger: ['blur', 'change'] }, maxRule],
  lotAttrCode9: [{ pattern: /(^[1-9](\d+)?(\.\d{1,3})?$)|(^\d\.\d{1,3}$)/, message: '请输入大于0的数字，最多包含3位小数', trigger: ['blur', 'change'] }, maxRule],
  lotAttrCode10: [{ pattern: /(^[1-9](\d+)?(\.\d{1,3})?$)|(^\d\.\d{1,3}$)/, message: '请输入大于0的数字，最多包含3位小数', trigger: ['blur', 'change'] }, maxRule],
  lotAttrCode11: [{ pattern: /(^[1-9](\d+)?(\.\d{1,3})?$)|(^\d\.\d{1,3}$)/, message: '请输入大于0的数字，最多包含3位小数', trigger: ['blur', 'change'] }, maxRule],
  minStock: [{ pattern: /^0$|^\+?[1-9]\d*$/, message: '请输入大于等于0的整数', trigger: ['blur', 'change'] }, {
    validator(rule, value, callback) {
      value === '' || value === undefined || value <= 999999 ? callback() : callback('数值不能超过999999')
    },
    trigger: ['blur', 'change']  }],
}

export default {
  components: { baseSelfForm: baseForm },
  data() {
    return {
      loading: false,
      detailLoading: false,
      formBaseConfig,
      baseRules,
      formAppendConfig,
      appendRules,
    }
  },
  computed: {
    edit() { return !!this.$route.query.id },
    id() { return this.$route.query.id },
    ...mapGetters([
      'mapConfig',
      'visitedViews'
    ]),
  },
  created() {
    this.initCustomer()
    if (this.edit) {
      this.init()
    }
  },

  methods: {
    init() {
      this.detailLoading = true
      let disabledProp = ['skuCode', 'ownerCode', 'lotAttrCode1', 'lotAttrCode2']
      skuQueryDetailById({ id: this.id }).then(res => {
        this.detailLoading = false
        if (!res) return
        let detail = res.data || {}
        const setDef = item => {
          item.default = detail[item.prop]
          if (disabledProp.find(v => v === item.prop)) {
            this.$set(item, 'disabled', true)
          }
          return item
        }
        this.formBaseConfig = this.$copy(this.formBaseConfig).map(setDef)
        this.formAppendConfig = this.$copy(this.formAppendConfig).map(setDef)
      })
    },
    /** 获取货主列表 */
    initCustomer() {
      customerList({ pageSize: 9999, status: 0, customerType: 1 }).then(res => {
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
    /** 提交 */
    handleSubmit() {
      const view = this.visitedViews.filter(v => v.path === this.$route.path)
      this.$refs['baseForm'].validate((valid1, baseParams) => {
        this.$refs['appendForm'].validate((valid2, appendParams) => {
          if (valid1 && valid2) {
            let params = { ...baseParams, ...appendParams }
            let api = skuSave
            if (this.edit) {
              params.id = this.id
              api = skuEdit
            }
            this.loading = true
            api(params).then(res => {
              if (!res) {
                this.loading = false
                return
              }
              this.$message({
                type: 'success',
                message: '操作成功,即将跳转到列表页！',
                duration: 1500,
                onClose: () => {
                  this.$store.dispatch('delVisitedViews', view[0]).then(() => {
                    this.$router.push({
                      path: `/baseInfo/productList`
                    })
                  }).catch(err => {
                  })
                }
              })
            })
          }
        })
      })
    }
  }
}
</script>