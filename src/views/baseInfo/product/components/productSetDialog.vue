<template>
  <div class="">
    <!-- 600px【小型，单列】 70% 【中型，双列】-->
    <el-dialog
      title="扩展配置"
      :visible="visible"
      width="70%"
      :before-close="handleClose"
      @close="close"
    >
      <el-alert
        v-if="!packageSelectLoading && !packageList.length"
        title="请先维护包装管理！"
        type="error"
        class="mb20"
      />
      <div>
        <el-form
          :inline="false"
          :model="formData"
          :rules="rules"
          label-width="100px"
          ref="form"
        >
          <!-- 
          1. 确认元素
          2. 配置文案&描述 、调整样式
          3. 字段配置
          4. 规则配置
          -->
          <el-form-item label="商品编码">
            {{rowData.skuCode}}
          </el-form-item>
          <el-form-item label="商品名称">
            {{rowData.skuName}}
          </el-form-item>
          <el-form-item label="规格型号">
            {{rowData.lotAttrCode1}}
          </el-form-item>
          <el-form-item label="单位">
            {{rowData.lotAttrCode3}}
          </el-form-item>
          <el-form-item label="商品分类">
            {{rowData.lotAttrCode6}}
          </el-form-item>
          <item-title>包装 <span class="c-red f12">（选填）</span></item-title>
          <el-form-item
            label="关联包装"
            prop="packageCode"
          >
            <el-select
              v-model="formData.packageCode"
              placeholder="请选择关联包装"
              clearable
              :loading="packageSelectLoading"
            >
              <el-option
                v-for="item in packageList"
                :key="item.packageCode"
                :label="item.packageDesc"
                :value="item.packageCode"
              ></el-option>
            </el-select>
          </el-form-item>
          <item-title>质检 <span class="c-red f12">（选填）</span></item-title>
          <el-form-item
            label="质检"
            prop="isLot"
          >
            <el-switch
              v-model="formData.lotAttrCode7"
              active-value='是'
              inactive-value='否'
            >
            </el-switch>
          </el-form-item>
          <item-title>批次规则 <span class="c-red f12">（必填）</span></item-title>
          <el-form-item
            label="批次规则"
            prop="lotId"
          >
            <el-select
              :loading="lotListLoading"
              v-model="formData.lotId"
              placeholder="请选择批次规则"
              no-data-text='??'
            >
              <el-option
                v-for="item in batchList"
                :key="item.id"
                :label="item.lotName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
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

import { skuUpdate, packageSelect, lotList } from '@/api'
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
      packageSelectLoading: true,
      lotListLoading: true,
      loading: false,
      packageList: [],
      batchList: [],
      formData: {
        lotAttrCode7: undefined, // 是否质检
        packageCode: undefined, // 包装编码
        lotId: undefined,
      },
      rules: {
        lotId: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
      }
    }
  },
  created() {
    packageSelect({ "pageNum": 1, "pageSize": 99999 }).then(res => {
      this.packageSelectLoading = false
      if (!res) return
      this.packageList = res.data.list || []
    })
    this.initBatch()
  },
  methods: {
    initBatch() {
      this.lotListLoading = true
      lotList({ pageSize: 999, status: 0 }).then(res => {
        this.lotListLoading = false
        if (!res) return
        this.batchList = (res.data.list || []).filter(v => v.status === 0)
      })
    },
    /** 确定 */
    confirm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          let params = { ...this.formData }
          for (let key in params) {
            if (params[key] === undefined) {
              params[key] = ''
            }
          }
          skuUpdate({ ...this.rowData, ...params }).then(res => {
            this.loading = false
            if (!res) return
            this.$emit('submited')
            this.$message.success('操作成功！')
            this.close()
          })
        }
      })
    },
    /** 关闭弹窗 */
    close() {
      this.$refs['form'] && this.$refs['form'].resetFields()
      return this.visible && this.$emit('update:visible', false)
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