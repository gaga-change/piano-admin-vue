<template>
  <div class="app-container">
    <div class="formcontain">
      <el-form
        :model="planform"
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
      >
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item
              label="APP类型"
              prop="appId"
            >
              <el-select
                v-model="planform.appId"
                filterable
                clearable
                placeholder="请选择APP类型"
                style="width:100%;"
                prefix-icon="el-icon-search"
              >
                <el-option
                  v-for="item in choicelist"
                  :key="item.id"
                  :label="item.value"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="APP版本名称">
              <el-input
                placeholder="请输入APP版本名称"
                v-model="planform.versionName"
                style="width:100%;"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item
              label="APP版本编号"
              prop="versionCode"
            >
              <el-input
                placeholder="请输入“主.从.二从”格式的APP版本编号"
                v-model="planform.versionCode"
                style="width:100%;"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item
              label="版本内容"
              prop="updateContent"
            >
              <el-input
                placeholder="请输入版本内容"
                v-model="planform.updateContent"
                type="textarea"
                class="contentarea"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="下载地址">
              <template v-if="planform.downloadUrl">
                <a :href="planform.downloadUrl">{{planform.downloadUrl}}</a>
                <el-button
                  size="mini"
                  type="primary"
                  @click="clearMusic"
                >
                  重新上传
                </el-button>
              </template>
              <template v-else>
                <el-upload
                  class="logoupload"
                  ref="pictureupload"
                  :action="pictureuploadUrl"
                  multiple
                  :limit="1"
                  :file-list="musicList"
                  :before-upload="beforeMusicUpload"
                  name="file"
                  :on-success="handleMusicUploadSuccess"
                  :accept="'.apk'"
                >
                  <span class="uploadstyle"><i class="el-icon-plus avatar-uploader-icon"></i><i>上传</i></span>
                </el-upload>
              </template>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item
              label="文件大小"
              prop="updateSize"
            >
              <el-input
                placeholder="请输入文件大小"
                v-model="planform.updateSize"
                style="width:100%;"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button
            type="primary"
            @click="onSubmit"
            :disabled="submitbtn"
          >保存</el-button>
          <el-button @click="onCancel">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { newApp } from '@/api'
export default {
  name: 'newAppEdition',
  data() {
    return {
      planform: {
        appId: null,
        appName: null,
        versionCode: null,
        versionName: null,
        updateContent: null,
        downloadUrl: null,
        updateSize: null
      },
      rules: {
        appId: [
          { required: true, message: '请选择APP类型', trigger: 'change' },
        ],
        versionCode: [
          { required: true, message: '请输入APP版本编号', trigger: 'blur' },
        ],
        updateContent: [
          { required: true, message: '请输入版本内容', trigger: 'blur' },
        ],
        updateSize: [
          { required: true, message: '请输入文件大小', trigger: 'blur' },
        ],
      },
      submitbtn: false,
      choicelist: [{ id: '1', value: 'android' }],
      pictureuploadUrl: '/webApi/plan/checkOrder/uploadReportFile',
      musicList: []
    }
  },
  created() {
  },
  computed: {
  },
  methods: {
    beforeMusicUpload(file) {
      // 如果上传文件大于5M
      const isMp3 = (/^.*(\.apk)$/.test(file.name))
      // const isLt5KB = file.size / 1024 / 1024 < 0.5;
      if (!isMp3) {
        this.$message.error('上传文件只能是 apk 格式!');
      }
      // if (!isLt5KB) {
      //   this.$message.error('上传文件大小不能超过 500KB!');
      // }
      return isMp3
    },
    handleMusicUploadSuccess(res, file, pictureList) {
      if (file.response.code == '200') {
        this.planform.downloadUrl = file.response.data
        this.planform.updateSize = file.size / 1024 / 1024
        this.planform.updateSize = this.planform.updateSize + 'M'
        this.$message.success('上传成功')
      } else {
        this.planform.updateSize = null
        this.$message.error(file.response.message)
      }
      this.$refs['pictureupload'].clearFiles()
    },
    onSubmit() {
      const view = this.$store.state.tagsView.visitedViews.filter(v => v.path === this.$route.path)
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.choicelist.map(item => {
            if (item.id === this.planform.appId) {
              this.planform.appName = item.value
            }
          })
          this.submitbtn = true
          newApp(this.planform).then(res => {
            this.submitbtn = false
            if (!res) return
            this.$message({
              message: '新建成功',
              type: 'success'
            })
            this.$store.dispatch('delVisitedViews', view[0]).then(() => {
              this.$router.push({
                name: 'appEditionList'
              })
            })
          })
        }
      })
    },
    onCancel() {
      const view = this.$store.state.tagsView.visitedViews.filter(v => v.path === this.$route.path)
      this.$store.dispatch('delVisitedViews', view[0]).then(() => {
        this.$router.push({
          name: 'appEditionList'
        })
      })
    },
    clearMusic() {
      this.planform.downloadUrl = null
      this.musicList = []
      this.planform.updateSize = null
    }
  }
}
</script>

<style scoped>
.line {
  text-align: center;
}
.dlink {
  color: #409eff;
}
h4 {
  color: #333;
}
.errorshow {
  color: red;
  font-style: normal;
  font-size: 12px;
  position: absolute;
  top: 28px;
  left: 0;
}
.companyselect {
  position: absolute;
  top: 42px;
  left: 0;
  z-index: 100;
  background: #fff;
  width: 220px;
  padding: 10px;
  padding-top: 10px;
  border: 1px solid #e4e7ed;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}
.companyselect span {
  display: block;
  line-height: 20px;
  cursor: pointer;
  color: #606266;
}
</style>
