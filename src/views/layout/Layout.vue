<template>
  <div
    class="app-wrapper"
    :class="{hideSidebar:!sidebar.opened}"
  >
    <topbar></topbar>
    <sidebar class="sidebar-container"></sidebar>
    <div class="main-container">
      <el-row
        :gutter="16"
        class="main-container-nav"
      >
        <el-col :span="8">
          <navbar></navbar>
        </el-col>
        <el-col :span="16">
          <tags-view></tags-view>
        </el-col>
      </el-row>
      <app-main></app-main>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain, TagsView, Topbar } from './components'
import { setWarehouseCode, todolist } from '@/api'
export default {
  name: 'layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    TagsView,
    Topbar
  },

  data() {
    return {
    }
  },

  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    }
  },
  methods: {
    totallist() {
    },
    choosewarehouse(value) {

    },
  },
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  padding-top: 65px;
}

#app .sidebar-container {
  top: 65px;
}

.main-container-nav {
  margin: 0 !important;
  position: sticky;
  top: 65px;
  background-color: #fff;
  z-index: 1000;
  border-bottom: 1px solid #d8dce5;
}
.el-message-box--center .el-message-box__btns {
  text-align: right !important;
}

.warehouseBox {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1001;
  .warehouseBox_alert {
    background: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .warehouseBox_alert_title {
      font-size: 24px;
      text-align: center;
      line-height: 32px;
      padding-top: 16px;
      font-weight: 600;
    }
    ul {
      width: 464px;
      padding: 0;
      margin: 0;
      > li {
        list-style: none;
        padding: 0;
        margin: 16px;
        width: 200px;
        height: 50px;
        line-height: 50px;
        border: 1px solid #000;
        text-align: center;
        cursor: pointer;
        float: left;
      }
    }
  }
}
</style>


