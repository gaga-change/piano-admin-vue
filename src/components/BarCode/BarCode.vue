<template>
  <img
    :src="`/webApi/barcode?msg=${code}&type=${codeType}&&fmt=${fmt}${fontSize? ('&hrsize=' +  fontSize): ''}${mw? ('&mw=' +  mw): ''}`"
    :alt="imgAlt"
    :style="imgStyle"
  >
</template>

<script>

export default {
  props: {
    fontSize: {
      type: String,
      default: ''
    },
    codeType: {
      type: String,
      default: 'code128'
    },
    code: {
      // type: any,
      required: true
    },
    imgStyle: {
      type: String,
      default: ""
    },
    mw: {
      type: String,
      default: ""
    },
    imgAlt: {
      type: String,
      default: '条形码'
    },
    fmt: {
      type: String,
      default: 'jpeg'
    }
  },
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
img {
  width: 100%;
}
</style>

