<template>
  <div v-loading="detailLoading">
    <el-form
      :inline="false"
      :model="formData"
      :rules="rules"
      label-width="50px"
      ref="form"
    >
      <item-title>基本信息</item-title>
      <el-form-item
        label="编码"
        prop="customerCode"
      >
        <el-input
          style="width:250px;"
          v-model="formData.customerCode"
          placeholder="请输入"
          :disabled="edit"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="类型"
        prop="customerType"
      >
        <el-select
          style="width:250px;"
          v-model="formData.customerType"
          placeholder="请选择"
          clearable
          :disabled="edit"
        >
          <el-option
            v-for="item in mapConfig['customerTypeEnum'] || []"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="名称"
        prop="customerName"
      >
        <el-input
          style="width:250px;"
          v-model="formData.customerName"
          placeholder="请输入"
        ></el-input>
      </el-form-item>
      <item-title>联系信息 <el-button @click="handleAddRelation">添加</el-button>
      </item-title>
      <base-table
        :config="tableConfig"
        :data.sync="tableData"
        :showControl="true"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="handleDel(scope.row, scope.index)"
          >删除</el-link>
          <el-divider direction="vertical"></el-divider>
          <el-link
            type="primary"
            @click="handleModify(scope.row, scope.index)"
          >编辑</el-link>
        </template>
      </base-table>
      <div class="mt25">
        <el-button
          type="primary"
          :loading="loading"
          @click="confirm()"
        >提 交</el-button>
      </div>
    </el-form>
    <relationDialogForm
      :visible.sync="relationDialogFormVisible"
      :row="selectedRow"
      @submited="relationDialogFormSubmit"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import relationDialogForm from './components/relationDialogForm'
import { addCustomer, customerDetail, updateCustomer } from '@/api'

const tableConfig = [
  { label: '联系人', prop: 'linkUser' },
  { label: '电话', prop: 'linkTel' },
  { label: '地址', prop: 'address' },
]

export default {
  components: { relationDialogForm },
  data() {
    return {
      relationDialogFormVisible: false,
      selectedRow: null,
      tableConfig,
      loading: false,
      detailLoading: false,
      formData: {
        customerCode: undefined,
        customerName: undefined,
        customerType: undefined
      },
      rules: {
        customerCode: [
          { required: true, message: '必填项', trigger: ['blur', 'change'] },
          { pattern: /^[0-9a-zA-Z]*$/, message: '只能输入数字或字母' },
          { min: 0, max: 20, message: '不能超过20个字符', trigger: ['blur', 'change'] }
        ],
        customerName: [
          { required: true, message: '必填项', trigger: ['blur', 'change'] },
          { max: 50, message: '不能超过50个字符', trigger: ['blur', 'change'] }
        ],
        customerType: [
          { required: true, message: '必填项', trigger: ['blur', 'change'] },
        ],
      },
      tableData: [],
    }
  },
  computed: {
    ...mapGetters([
      'mapConfig',
      'visitedViews'
    ]),
    id() {
      return this.$route.query.id
    },
    edit() {
      return !!this.$route.query.id
    }
  },
  created() {
    if (this.edit) {
      this.initData()
    }
  },
  methods: {
    /** 获取详情内容 */
    initData() {
      this.detailLoading = true
      customerDetail(this.id).then(res => {
        this.detailLoading = false
        if (!res) return
        Object.keys(this.formData).forEach(key => {
          this.formData[key] = res.data[key]
        })
        this.tableData = res.data.addressList || []
      })
    },
    /** 提交 */
    confirm() {
      const view = this.visitedViews.filter(v => v.path === this.$route.path)
      if (this.tableData.length === 0) {
        return this.$message.error('请添加联系信息！')
      }
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let params = { ...this.formData }
          params.addressList = this.tableData
          let api = addCustomer
          if (this.edit) {
            api = updateCustomer
            params.id = this.id
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
                    path: `/baseInfo/customerList`
                  })
                }).catch(err => {
                })
              }
            })
          })
        }
      })
    },
    /** 删除子表行 */
    handleDel(row, index) {
      this.$apiConfirm('是否删除该行？', () => Promise.resolve().then(() => {
        this.tableData.splice(index, 1)
      }))
    },
    /** 编辑子表 */
    handleModify(row) {
      this.selectedRow = row
      this.relationDialogFormVisible = true
    },
    /** 联系方式表单提交 */
    relationDialogFormSubmit(params) {
      if (this.selectedRow.isAdd) {
        this.tableData.push(params)
      } else {
        for (let key in this.selectedRow) {
          this.selectedRow[key] = params[key]
        }
      }
    },
    /** 添加联系方式按钮 点击 */
    handleAddRelation() {
      let row = { linkUser: undefined, linkTel: undefined, address: undefined, isAdd: true }
      this.selectedRow = row
      this.relationDialogFormVisible = true
    }
  }
}
</script>