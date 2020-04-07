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
          <el-select
            v-if="item.type === 'enum'"
            v-model="formData[item.prop]"
            :placeholder="`请选择${item.label}`"
            style="width:200px;"
            :disabled="item.disabled"
            clearable
          >
            <el-option
              v-for="item in mapConfig[item.enum]"
              :key="item.name"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
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
            placeholder="最小单位"
            v-model="formData[item.prop]"
            :precision="0"
            :min="0"
            :max="99999999"
            :disabled="item.disabled"
            :controls="false"
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
          <!-- 输入框 -->
          <el-input
            v-else-if="item.type === 'inputNumber'"
            style="width:200px;"
            @input="v => handleInput(v, item)"
            v-model="formData[item.prop]"
            :placeholder="`请输入${item.label}`"
            :disabled="item.disabled"
          ></el-input>
          <el-input
            v-else
            style="width:200px;"
            v-model="formData[item.prop]"
            :placeholder="item.placeholder || `请输入${item.label}`"
            :disabled="item.disabled"
          ></el-input>
          <span
            class="unit"
            v-if="item.unit"
          >{{item.unit}}</span>
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
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
    ]),
  },
  watch: {
    config() {
      this.init()
    },
  },
  created() {
    this.init()
  },
  methods: {
    handleInput() {
      let temp = {}
      let { lotAttrCode8 = 0, lotAttrCode9 = 0, lotAttrCode10 = 0 } = this.formData
      temp.lotAttrCode8 = Number(lotAttrCode8) || 0
      temp.lotAttrCode9 = Number(lotAttrCode9) || 0
      temp.lotAttrCode10 = Number(lotAttrCode10) || 0
      let res = ((temp.lotAttrCode8 * temp.lotAttrCode9 * temp.lotAttrCode10) / 1000).toFixed(12)
      this.formData.bulk = (res + '').replace(/(([0]+)$)|(\.([0]+)$)/g, '')
    },
    init() {
      this.config.forEach(item => {
        this.$set(this.formData, item.prop, item.default)
      })
      this.handleInput()
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