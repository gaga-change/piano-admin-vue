<template>
  <div>
    <scroll-bar>
      <el-menu
        mode="vertical"
        :show-timeout="200"
        :default-active="$route.path"
        :collapse="isCollapse"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
      >
        <sidebar-item :routes="routes"></sidebar-item>
      </el-menu>
    </scroll-bar>
    <!-- <div class="beian">
      <span>系统版本：{{version}}</span>
      <a
        href="http://www.beian.miit.gov.cn"
        target="_blank"
      >浙ICP备14018558号-1</a>
    </div> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import ScrollBar from '@/components/ScrollBar'
import menuRouter from '@/router/localRouter/luos_router'
export default {
  components: { SidebarItem, ScrollBar },
  data() {
    return {
      menuRouter,
      version: process.env.IMAGE_TAG || '0.0.0'
    }
  },
  computed: {
    ...mapGetters([
      'menu',
      'sidebar'
    ]),
    routes() {
      return [...this.menuRouter]
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
}
</script>

<style lang="scss" scoped>
.beian {
  position: absolute;
  width: 100%;
  height: 35px;
  color: rgba(255, 255, 255, 0.5);
  padding-top: 5px;
  background-color: rgb(48, 65, 86);
  box-shadow: 1px -4px 3px 0 rgba(0, 0, 0, 0.1);
  left: 0;
  bottom: 65px;
  text-align: center;
  z-index: 1000;
  font-size: 12px;
}
</style>
