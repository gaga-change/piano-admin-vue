<template>
  <div class="">
    <!-- 600px【小型，单列】 70% 【中型，双列】-->
    <el-dialog
      :title="(row && row._id) ? `编辑` : '新建枚举'"
      :visible="visible"
      width="70%"
      :before-close="handleClose"
      @close="close"
    >
      <div>
        <el-form
          :inline="false"
          :model="formData"
          :rules="rules"
          label-width="100px"
          ref="form"
        >
          <el-form-item
            label="名称"
            prop="name"
          >
            <el-input
              style="width:200px;"
              v-model="formData.name"
              placeholder="请输入名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="键值对">
            <div>
              <div class="mb10">
                <el-button
                  type="primary"
                  @click="addKeyVal"
                >添加</el-button>
                <el-button
                  type="primary"
                  v-show="keyValueData.length"
                  @click="handleSort"
                >自动排序</el-button>
              </div>
              <base-table
                :config="[{label: '键', prop: 'name', edit: true, inputType: 'input'}, 
                {label: '值', prop: 'value', edit: true, inputType: 'number', min: -9999}]"
                :data="keyValueData"
                :showControl="true"
                :showControlFixed="false"
                :controlWidth="160"
              >
                <template slot-scope="scope">
                  <el-link
                    type="primary"
                    @click="handleDelete(scope.row, scope.index)"
                  >删除</el-link>
                </template>
              </base-table>
            </div>
          </el-form-item>
          <el-form-item
            label="备注"
            prop="remark"
          >
            <el-input
              style="width:200px;"
              v-model="formData.remark"
              type="textarea"
              placeholder="请输入备注"
              maxlength="200"
              show-word-limit
            >
            </el-input>
          </el-form-item>
        </el-form>
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

import { enumsModify, enumsAdd } from '@/api'
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
    /** 防止父级传递 null */
    rowData() {
      return this.row || {}
    },
    /** 键值对 */
    keyValue() {
      return (this.row || {}).keyValue || []
    }
  },
  watch: {
    /** 监听数据切换，重置表单 */
    visible(val) {
      if (!val) return
      this.keyValueData = JSON.parse(JSON.stringify(this.keyValue))
      Object.keys(this.formData).forEach(key => {
        this.$set(this.formData, key, this.rowData[key] === null ? undefined : this.rowData[key])
      })
    }
  },
  data() {
    return {
      loading: false,
      formData: {
        //  ... 表单字段
        name: undefined,
        remark: undefined
      },
      keyValueData: [],
      rules: {
        //  ... 表单校验
        name: [
          { required: true, message: '必填项', trigger: 'blur' },
          { min: 0, max: 50, message: '不能超过50个字符', trigger: 'blur' },
        ]
      }
    }
  },
  methods: {
    /** 自动排序 */
    handleSort() {
      this.keyValueData = this.keyValueData.sort((a, b) => {
        return a.value - b.value
      })
    },
    /** 增加键值对 */
    addKeyVal() {
      this.keyValueData.push({ 'name': undefined, 'value': undefined })
    },
    /** 删除 */
    handleDelete(row) {
      this.keyValueData.splice(this.keyValueData.findIndex(v => v._id === row._id), 1)
    },
    /** 确定 */
    confirm() {
      const isModify = this.row && this.row._id
      const api = isModify ? enumsModify : enumsAdd
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          let params = { ...this.formData }
          params.keyValue = this.keyValueData.filter(v => v.name || v.value !== undefined)
          let temp = isModify ? [this.row._id, params] : [params]
          api(...temp).then(res => {
            this.loading = false
            if (!res) return
            this.$message.success('操作成功！')
            this.$emit('submited')
            this.close()
          })
        }
      })
    },
    /** 关闭弹窗 */
    close() {
      this.$refs['form'] && this.$refs['form'].resetFields()
      this.keyValueData = []
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