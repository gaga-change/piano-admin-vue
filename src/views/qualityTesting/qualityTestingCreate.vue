<template>
  <div class="TakeStockBillingCom">
    <div>
      <el-button
        type="primary"
        size="mini"
        @click="showChooseProdDialog"
        :disabled="end"
      >
        引入收货单
      </el-button>
    </div>
    <div class="mt20">
      <base-table
        :config="qualityTestingCreateTableConfig"
        :data="tableData"
        :showControl="true"
      >
        <template
          slot="edit"
          slot-scope="scope"
        >
          <el-button
            size="mini"
            type="warning"
            @click="handleDelRow(scope.row, scope.index)"
          >
            删除
          </el-button>
        </template>
      </base-table>
    </div>
    <div class="mt20">
      <div style="display: flex;">
        <div class="mr20">
          <span class="c-red f14">*</span>
          <span class="f14 ">质检报告</span>
        </div>
        <div style="flex: 1">
          <el-upload
            class="upload-demo"
            action="/action"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :before-remove="beforeRemove"
            :before-upload="beforeAvatarUpload"
            multiple
            :http-request="uploadSectionFile"
            :limit="10"
            :on-exceed="handleExceed"
            :file-list="fileList"
          >
            <el-button
              class="f14"
              size="mini"
              type="success"
              plain
              :disabled="end"
            >点击上传</el-button>
            <div
              slot="tip"
              class="el-upload__tip"
            >支持扩展名：.doc .docx .pdf .jpg .png，大小不能超过2M，限制10条。</div>
          </el-upload>
        </div>
      </div>
    </div>
    <div class="mt20">
      <el-button
        type="primary"
        size="mini"
        @click="handleSubmitForm"
        :disabled="end"
        :loading="checkOrderAddCheckOrderLoading"
      >
        提交
      </el-button>
      <el-button
        size="mini"
        :disabled="end"
        @click="handleResetForm"
      >
        重置
      </el-button>
    </div>
    <select-product
      :visible.sync="selectProductVisible"
      :selectData.sync="tableData"
    />
  </div>
</template>

<script>
import { checkOrderAddCheckOrder, uploadReportFile } from '@/api'
import selectProduct from './components/selectProduct'
import { mapGetters } from 'vuex'

const qualityTestingCreateTableConfig = [
  { label: '收货单号', prop: 'orderCode' },
  { label: '商品编码', prop: 'skuCode' },
  { label: '商品名称', prop: 'skuName' },
  { label: '收货数量', prop: 'receiveQty' },
  { label: '质检数量', prop: 'receiveQty' },
  { label: '质检结果', prop: 'checkResult', edit: true, inputType: 'select', enum: 'checkResult3Enum' },
]

export default {
  components: { selectProduct },
  data() {
    return {
      end: false,
      qualityTestingCreateTableConfig,
      checkOrderAddCheckOrderLoading: false,
      selectProductVisible: false,
      tableData: [],
      getCheckReportByOrderCodeLoading: false,
      checkOrderAddReportLoading: false,
      fileList: [],
      supportFileSuffix: ['.doc', '.docx', '.pdf', '.jpg', '.png'],
    }
  },
  computed: {
    ...mapGetters({
      visitedViews: 'visitedViews'
    })
  },
  created() {

  },
  methods: {
    beforeAvatarUpload(file) {
      return this.checkFile(file)
    },
    uploadSectionFile(param) {
      let fileObj = param.file
      let form = new FormData()
      form.append("file", fileObj)
      uploadReportFile(form, {
        onUploadProgress(event) {
          param.file.percent = event.loaded / event.total * 100
          param.onProgress(param.file)
        },
        onDownloadProgress(progressEvent) { }
      }).then(res => {
        if (res) {
          param.file.url = res.data
          param.onSuccess(param.file)
        } else {
          param.onError(param.file)
        }
      })
    },
    /** 文件校验 */
    checkFile(file) {
      let temp = file.name.split('.')
      let suffix = '.' + temp[temp.length - 1]
      const isSupport = !!~this.supportFileSuffix.findIndex(v => v === suffix)
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isSupport) {
        this.$message.error('不支持扩展名：' + suffix)
      }
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 2MB!')
      }
      return isSupport && isLt2M
    },
    handleRemove(file, fileList) {
      let index = this.fileList.findIndex(v => v.uid === file.uid)
      ~index && this.fileList.splice(index, 1)
    },
    handleSuccess(file, fileList) {
      this.fileList.push(file)
    },
    handlePreview(file) {
      if ((!file.raw && !file.url) || (file.raw && !file.raw.url)) return this.$message.error('链接地址已失效！')
      let url = file.url || file.raw.url
      window.open(url + '?name=' + encodeURIComponent(file.name))
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 10 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      // file.raw === true  说明是不符合格式，自动删除的
      if (file.raw) return true
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    /** 提交 */
    handleSubmitForm() {
      const view = this.visitedViews.filter(v => v.path === this.$route.path)

      if (!this.tableData.length) {
        return this.$message.error('请引入收货单！')
      }
      if (!this.fileList.length) {
        return this.$message.error('请上传质检报告！')
      }
      this.checkOrderAddCheckOrderLoading = true
      checkOrderAddCheckOrder({
        receiveOrderCode: this.tableData[0].orderCode,
        deatilReqs: this.tableData.map(v => (
          {
            detailId: v.id,
            checkResult: v.checkResult
          }
        )),
        attachmentList: this.fileList.map(v => {
          return {
            reportName: v.name,
            reportUrl: v.url
          }
        }),
      }).then(res => {
        this.checkOrderAddCheckOrderLoading = false
        if (!res) return
        this.handleResetForm()
        this.$message.success('新建质检记录成功，即将跳转到质检记录列表！')
        this.end = true
        setTimeout(() => {
          this.$store.dispatch('delVisitedViews', view[0]).then(() => {
            this.$router.push({
              path: `/qualityTesting/record`,
              query: { t: Date.now() }
            })
          }).catch(err => {
          })
        }, 3000)
      })
    },
    /** 重置 */
    handleResetForm() {
      this.tableData = []
      this.fileList = []
    },
    /** 删除行 */
    handleDelRow(row, index) {
      this.$confirm(`将删除该商品, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableData.splice(index, 1)
        this.$message.success('删除成功')
      }).catch(() => { })
    },
    /** 展示选择商品弹窗 */
    showChooseProdDialog() {
      this.selectProductVisible = true
    }
  },
}
</script>

<style lang="scss">
.TakeStockBillingCom {
  padding: 20px;
}
</style>
