<template>
  <div
    class="item-title"
    :style="boxStyle"
  >
    <div class="icon"></div>
    <div class="text">{{text}}<slot></slot>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    text: {
      type: String,
      default: ''
    },
    boxStyle: {
      type: String,
      required: false,
      default: "width:100%"
    }
  },
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.item-title {
  height: 24px;
  display: flex;
  margin-bottom: 12px;
  .icon {
    height: 24px;
    width: 4px;
    background: #409eff;
  }
  .text {
    line-height: 24px;
    font-size: 16px;
    padding-left: 8px;
  }
}
</style>

