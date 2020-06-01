<template>
  <el-select
    :value="selectVal"
    :disabled="disabled"
    :placeholder="`请选择`"
    style="width:200px;"
    @change="change"
    clearable
  >
    <el-option
      v-for="item in dataList"
      :key="item.value"
      :label="item.name"
      :value="item.value"
    ></el-option>
  </el-select>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  model: {
    prop: 'value',
    event: 'update'
  },
  props: {
    disabled: {
      type: Boolean
    },
    value: {
      type: [String, Number, Object, Boolean],
    },
    enumName: {
      type: String
    }
  },
  data() {
    return {
      defaultSelect: null,
    }
  },
  computed: {
    ...mapGetters([
      'mapConfig',
    ]),
    selectVal() {
      if (typeof this.value === 'object' && this.value._id) {
        this.defaultSelect = { ...this.$copy(this.value), value: this.value._id }
        // this.$emit('update:obj', defaultSelect)
        this.$emit('update', this.value._id)
        return this.value._id
      } else {
        return this.value
      }
    },
    dataList() {
      const apiData = this.mapConfig[this.enumName] || []
      const temp = [...apiData]
      // 如果枚举已被禁用，则手动加入改选项
      if (this.defaultSelect && temp.findIndex(v => v.value === this.defaultSelect._id) === -1) {
        temp.push(this.defaultSelect)
      }
      return temp
    }
  },
  methods: {
    change(val) {
      // const temp = this.dataList.find(v => v.value === val)
      this.$emit('update', val)
      // this.$emit('update:obj', this.$copy(temp))
    }
  }
}
</script>