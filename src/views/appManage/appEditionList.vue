<template>
  <div class="app-container">
    <el-form
      :model="planform"
      ref="ruleForm"
      label-width="130px"
      class="ownproductlist"
    >
      <el-row :gutter="30">
        <el-col :span="8">
          <el-form-item label="App版本类型名称">
            <el-select
              v-model="planform.ownproduct.appId"
              filterable
              clearable
              placeholder="请选择"
              style="width:220px;"
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
        <el-col :span="8">
          <el-form-item label="是否最新">
            <el-select
              v-model="planform.ownproduct.isRelease"
              filterable
              clearable
              placeholder="请选择"
              style="width:220px;"
              prefix-icon="el-icon-search"
            >
              <el-option
                v-for="item in isReleaselist"
                :key="item.id"
                :label="item.value"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item>
            <el-button
              type="primary"
              @click="onSubmit"
              size="small"
            >查询</el-button>
            <el-button
              @click="onCancel"
              size="small"
            >重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="itemscont">
      <el-button
        class="companybtn"
        @click="tonew()"
        size="small"
        style="margin-bottom:10px;"
      >新增</el-button>
      <el-table
        :data="list"
        style="width:100%"
        :header-cell-style="{background:'#F2F4FF'}"
        border
      >
        <el-table-column
          min-width="160"
          fixed="left"
          label="App版本类型名称"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.appName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="版本编号">
          <template slot-scope="scope">
            <span>{{ scope.row.versionCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="版本名称">
          <template slot-scope="scope">
            <span>{{ scope.row.versionName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="下载地址">
          <template slot-scope="scope">
            <a
              :href="scope.row.downloadUrl"
              v-if="scope.row.downloadUrl"
            >{{ scope.row.downloadUrl}}</a>
          </template>
        </el-table-column>
        <el-table-column label="是否最新">
          <template slot-scope="scope">
            <span>{{ scope.row.isRelease | isReleaseFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column label="更新至最新">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              v-if="scope.row.isRelease==0"
              @click="changedata(scope.row.id)"
            >更新</el-button>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          width="180"
          label="操作"
        >
          <template slot-scope="scope">
            <div>
              <span
                @click="toDetail(scope.row.id)"
                style="color:#409EFF;cursor:pointer;margin-right:10px;"
              >修改</span>
              <span
                @click="deleteItem(scope.row.id)"
                style="color:red;cursor:pointer;"
              >删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentPageChange"
        :current-page="current"
        :page-sizes="[10]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { applist, deleteApp, latestApp } from '@/api'
export default {
  name: 'appEditionList',
  data() {
    return {
      planform: {
        ownproduct: {
          appId: null,
          isRelease: null
        }
      },
      list: [],
      current: 1,
      pageSize: 10,
      total: 0,
      choicelist: [{ id: '1', value: 'android' }],
      isReleaselist: [{ id: 0, value: '否' }, { id: 1, value: '是' }]
    }
  },
  computed: {
  },
  created() {
    this.getlist()
  },
  filters: {
    isReleaseFilter(val) {
      switch (parseInt(val)) {
        case 0: return '否'
        case 1: return '是'
        default: return ''
      }
    }
  },
  methods: {
    getlist() {
      applist({ pageNum: this.current, pageSize: this.pageSize, ...this.planform.ownproduct }).then(
        res => {
          if (!res) return
          this.total = res.data.total
          this.list = res.data.list
        }
      )
    },
    onCancel() {
      this.planform.ownproduct.appId = null
      this.planform.ownproduct.isRelease = null
      this.current = 1
      this.pageSize = 10
      this.getlist()
    },
    onSubmit() {
      this.current = 1
      this.pageSize = 10
      this.getlist()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getlist()
    },
    handleCurrentPageChange(val) {
      this.current = val
      this.getlist()
    },
    tonew() {
      this.$router.push({
        name: 'newAppEdition'
      })
    },
    toDetail(id) {
      this.$router.push({
        name: 'modifyAppEdition',
        query: {
          id
        }
      })
    },
    deleteItem(id) {
      let ownid = id
      this.$confirm('确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteApp(ownid).then(res => {
          if (!res) return
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getlist()
        })
      }).catch(() => {
      })
    },
    changedata(id) {
      let ownid = id
      this.$confirm('确认更新至最新？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        latestApp(ownid).then(res => {
          if (!res) return
          this.$message({
            message: '更新成功',
            type: 'success'
          })
          this.getlist()
        })
      }).catch(() => {
      })
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
  cursor: pointer;
}
h3 {
  font-size: 14px;
  font-weight: normal;
}
.datarelative {
  font-size: 14px;
  color: #666;
}
.datarelative span {
  margin-right: 20px;
  cursor: pointer;
}
.dlright {
  float: right;
}
.ownproductlist {
  margin-bottom: 15px;
  padding: 30px 0 0;
  border: 1px solid #ebeef5;
  background: #fcfcff;
}
.showform-enter-active,
.showform-leave-active {
  transition: opacity 0.5s;
}
.showform-enter,
.showform-leave-to {
  opacity: 0;
}
.itemscont {
  background: #fff;
  padding: 15px 20px;
  border-radius: 5px;
}
.companybtn {
  color: #fff;
  background-color: #5868d9;
}
.companybtn:hover {
  background-color: #7180df;
}
</style>
