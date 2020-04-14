<template>
  <div>
    <item-title>教师端</item-title>
    <el-button
      type="primary"
      @click="syncTeacherTags"
      :loading="wxTeacherTagsSyncLoading"
    >同步微信标签</el-button>
    <div class="mt20"></div>
    <item-title>学生端</item-title>
    <el-button
      type="primary"
      @click="syncStudentTags"
      :loading="wxStudentTagsSyncLoding"
    >同步微信标签</el-button>
  </div>
</template>
<script>
import { wxTeacherTagsSync, wxStudentTagsSync } from '@/api'
export default {
  data() {
    return {
      wxTeacherTagsSyncLoading: false,
      wxStudentTagsSyncLoding: false,
    }
  },
  created() {
    wxTeacherTagsSync()
  },
  methods: {
    syncTeacherTags() {
      this.wxTeacherTagsSyncLoading = true
      wxTeacherTagsSync().then(res => {
        this.wxTeacherTagsSyncLoading = false
        if (!res) return
        this.$message.success("同步成功！")
      })
    },
    syncStudentTags() {
      this.wxStudentTagsSyncLoding = true
      wxStudentTagsSync().then(res => {
        this.wxStudentTagsSyncLoding = false
        if (!res) return
        this.$message.success("同步成功！")
      })
    }
  }

}
</script>