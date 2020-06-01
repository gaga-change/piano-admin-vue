<template>
  <div>
    <el-form
      :inline="inline"
      :model="formData"
      :rules="rules"
      label-width="100px"
      ref="form"
    >
      <template>
        <!-- 下拉框 -->
        <el-form-item
          v-for="(item, index) in config"
          :key="index"
          :label="item.label"
          :prop="item.prop"
        >
          <MapSelect
            v-if="item.type === 'enum'"
            v-model="formData[item.prop]"
            :disabled="item.disabled"
            :enumName="item.enum"
          />
          <!-- 多行文本框 -->
          <el-input
            v-else-if="item.type === 'textarea'"
            style="width:200px;"
            v-model="formData[item.prop]"
            type="textarea"
            :placeholder="`请输入${item.label}`"
            maxlength="30"
            show-word-limit
            :disabled="item.disabled"
          >
          </el-input>
          <!-- 数字框 -->
          <el-input-number
            style="width:200px;"
            v-else-if="item.type === 'number'"
            placeholder="请输入"
            v-model="formData[item.prop]"
            :precision="item.precision || 0"
            :min="item.min || 0"
            :max="item.max || 99999999"
            :disabled="item.disabled"
            controls-position="right"
          ></el-input-number>
          <!-- 开关 -->
          <el-switch
            v-else-if="item.type === 'switch'"
            v-model="formData[item.prop]"
            :active-value='1'
            :inactive-value='0'
            :disabled="item.disabled"
          >
          </el-switch>
          <el-radio-group
            v-else-if="item.type === 'radio'"
            v-model="formData[item.prop]"
            :disabled="item.disabled"
          >
            <el-radio
              v-for="item in mapConfig[item.enum]"
              :key="item.value"
              :label="item.value"
            >{{item.name}}</el-radio>
          </el-radio-group>
          <el-time-picker
            style="width: 200px"
            :format="item.format || 'HH:mm'"
            v-else-if="item.type === 'timePicker'"
            v-model="formData[item.prop]"
            :placeholder="`请选择${item.label}`"
          >
          </el-time-picker>
          <el-date-picker
            style="width: 200px"
            v-else-if="item.type === 'datePicker'"
            v-model="formData[item.prop]"
            align="right"
            type="date"
            placeholder="选择日期"
            :picker-options="item.pickerOptions || {}"
          >
          </el-date-picker>
          <el-select
            style="width: 200px"
            v-else-if="item.type === 'selectRemote'"
            v-model="formData[item.prop]"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="item.remoteMethod"
            :loading="item.loading"
          >
            <el-option
              v-for="item in item.list"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <!-- 输入框 -->
          <el-input
            v-else
            style="width:200px;"
            v-model="formData[item.prop]"
            :placeholder="`请输入${item.label}`"
            :disabled="item.disabled"
          ></el-input>
          <span
            class="unit"
            v-if="item.unit"
          >{{item.unit}}</span>
        </el-form-item>
      </template>
      <!-- 单选 -->
      <!-- <el-form-item
        label="特殊资源"
        prop="resource"
      >
        <el-radio-group v-model="formData.resource">
          <el-radio label="线上品牌商赞助"></el-radio>
          <el-radio label="线下场地免费"></el-radio>
        </el-radio-group>
      </el-form-item> -->
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// rules: {
//  ... 表单校验
// packageDesc: [
//   { required: true, message: '必填项', trigger: 'blur' },
//   { min: 0, max: 20, message: '不能超过20个字符', trigger: 'blur' },
//   {
//     validator(rule, value, callback) {
//       value > 0 ? callback() : callback('数值必须大于0')
//     },
//     trigger: 'blur'
//   }
// ]
// }
export default {
  props: {
    config: {
      type: Array,
      default: () => []
    },
    rules: {
      type: Object,
      default: () => ({})
    },
    inline: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: {
      },
    }
  },
  computed: {
    ...mapGetters([
      'mapConfig',
    ])
  },
  watch: {
    config() {
      this.init()
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.config.forEach(item => {
        this.$set(this.formData, item.prop, item.default)
      })
    },
    /** 确定 */
    validate(callback) {
      this.$refs['form'].validate((valid) => {
        callback(valid, { ...this.formData })
      })
    },
    resetFields() {
      this.$refs['form'] && this.$refs['form'].resetFields()

    }
  }
}
</script>