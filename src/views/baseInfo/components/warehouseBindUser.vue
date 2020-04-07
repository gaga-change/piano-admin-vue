<template>
  <div class="">
    <!-- 600px【小型，单列】 70% 【中型，双列】-->
    <el-dialog
      title="绑定用户"
      :visible="visible"
      width="400px"
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
          <el-form-item label="仓库名称">
            {{rowData.warehouseName}}
          </el-form-item>
          <!-- 下拉框 -->
          <el-form-item
            label="用户"
            prop="userId"
          >
            <el-select
              v-model="formData.userId"
              :loading="warehouseUserListLoading"
              placeholder="请选择用户"
              clearable
              filterable
            >
              <el-option
                v-for="item in userList"
                :key="item.userId"
                :label="item.userName"
                :value="item.userId"
              ></el-option>
            </el-select>
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
import { warehouseUserAll, warehouseUserAdd } from '@/api'
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
  watch: {
    /** 监听数据切换，重置表单 */
    visible(val) {
      if (!val) return
      Object.keys(this.formData).forEach(key => {
        this.$set(this.formData, key, this.rowData[key] === null ? undefined : this.rowData[key])
      })
    }
  },
  data() {
    return {
      warehouseUserListLoading: false,
      loading: false,
      formData: {
        //  ... 表单字段
        userId: undefined
      },
      rules: {
        //  ... 表单校验
        userId: [
          { required: true, message: '必填项', trigger: 'change' },
        ]
      },
      userList: [],
    }
  },
  created() {
    this.warehouseUserListLoading = true
    warehouseUserAll().then(res => {
      this.warehouseUserListLoading = false
      if (!res) return
      this.userList = res.data || []
    })
  },
  methods: {
    /** 确定 */
    confirm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let params = { ...this.formData }
          let user = this.userList.find(v => v.userId === params.userId)
          this.loading = true
          warehouseUserAdd({
            warehouseCode: this.rowData.warehouseCode,
            userAccount: user.userAccount,
            userName: user.userName,
            userTel: user.userTel,
          }).then(res => {
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
      // 初始化表单
      this.$refs['form'] && this.$refs['form'].resetFields()
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