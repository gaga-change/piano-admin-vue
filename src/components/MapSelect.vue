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
      v-for="item in mapConfig[enumName]"
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
  computed: {
    ...mapGetters([
      'mapConfig',
    ]),
    selectVal() {
      if (typeof this.value === 'object' && this.value._id) {
        this.$emit('update', this.value._id)
        return this.value._id
      } else {
        return this.value
      }
    }
  },
  methods: {
    change(val) {
      this.$emit('update', val)
    }
  }
}
</script>