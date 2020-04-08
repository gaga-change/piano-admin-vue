<template>
  <div class="top-container">
    <div class="logo">
      <img :src="logoPath" />
    </div>
    <div class="plant-text">
      后台管理系统{{development ? '【开发环境】': ''}}
    </div>
    <el-dropdown
      class="avatar-container"
      trigger="click"
    >
      <div class="avatar-wrapper">
        <span class="welcome">欢迎，{{userInfo.name || ''}}</span>
        <i class="el-icon-caret-bottom"></i>
      </div>
      <el-dropdown-menu
        class="user-dropdown"
        slot="dropdown"
      >
        <router-link
          class="inlineBlock"
          to="/"
        >
          <el-dropdown-item>
            主页
          </el-dropdown-item>
        </router-link>

        <el-dropdown-item divided>
          <span
            @click="modifyPasswordShow = true"
            style="display:block;"
          >修改密码</span>
        </el-dropdown-item>
        <el-dropdown-item divided>
          <span
            @click="logout"
            style="display:block;"
          >退出登录</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dialog
      title="修改密码"
      :visible.sync="modifyPasswordShow"
      append-to-body
      center
      width="450px"
    >
      <el-form
        :model="form"
        :rules="formrule"
        ref="ruleForm2"
      >
        <el-form-item
          label="原密码"
          label-width="120px"
          prop="oldpassword"
        >
          <el-input
            type="password"
            v-model="form.oldpassword"
            auto-complete="off"
            style="width:180px"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="新密码"
          label-width="120px"
          prop="newpassword"
        >
          <el-input
            type="password"
            v-model="form.newpassword"
            auto-complete="off"
            style="width:180px"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="原密码"
          label-width="120px"
          prop="renewpassword"
        >
          <el-input
            type="password"
            v-model="form.renewpassword"
            auto-complete="off"
            style="width:180px"
          ></el-input>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          size="mini"
          @click="modifyPasswordShow = false"
        >取 消</el-button>
        <el-button
          size="mini"
          type="primary"
          @click="modifyPassword"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import logoPath from '@/assets/images/logo.png'
import { mapGetters } from 'vuex'
import { updatepassword, setWarehouseCode, todolist, logout } from '@/api'
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value.length < 6) {
        callback(new Error('密码长度不小于6位'))
      } else {
        if (this.form.newpassword !== '') {
          this.$refs.ruleForm2.validateField('renewpassword')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value.length < 6) {
        callback(new Error('密码长度不小于6位'))
      } else if (value !== this.form.newpassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      dataUrl: null,
      development: false,
      logoPath,
      modifyPasswordShow: false,
      form: {
        oldpassword: '',
        newpassword: '',
        renewpassword: ''
      },
      warehouse: '',
      preWarehouse: '',
      formrule: {
        oldpassword: [
          { required: true, message: '请输入旧密码', trigger: 'blur' }
        ],
        newpassword: [
          { validator: validatePass, required: true, trigger: 'blur' }
        ],
        renewpassword: [
          { validator: validatePass2, required: true, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'company',
      'userInfo',
      'warehouseMap',
      'chooseWarehouse',
    ]),
    warehouseName() {
      var warehouseName = ''
      this.warehouseMap.map(item => {
        if (this.warehouse == item.warehouseNo) {
          warehouseName = item.warehouseName
        }
      })
      return warehouseName
    }
  },
  watch: {
    chooseWarehouse() {
      this.preWarehouse = this.chooseWarehouse
      this.warehouse = this.chooseWarehouse
    }
  },
  created() {
    if (process.env.NODE_ENV === "development") {
      this.development = true
    }
    this.preWarehouse = this.chooseWarehouse
    this.warehouse = this.chooseWarehouse || sessionStorage.getItem('warehouse')
    if (this.warehouse) {
      this.totallist()
    }
  },
  mounted() {
    const that = this
    var script = document.createElement('script')
    script.type = 'text/javascript'
    script.id = 'otherdatascript'
    script.src = `http://bi.csjmro.com/WebReport/ReportServer?op=fs_load&cmd=sso&fr_username=${this.userInfo.email}&fr_password=${this.userInfo.password}&validity=-1&callback=fwie`
    document.body.appendChild(script)
    window.fwie = function (data) {
      if (data.url) {
        that.dataUrl = data.url
      }
      // 成功后删除script及回调方法
      const script = document.getElementById('otherdatascript')
      document.body.removeChild(script)
      delete window['fwie']
    }
  },
  methods: {
    dataRoute() {
      if (!this.dataUrl) {
        this.$message('同步登录BI失败，无法跳转，请刷新页面重试')
      }
    },
    handleCommand(command) {
      this.warehouse = command
      this.setWarehouse()
    },
    totallist() {
      todolist().then(res => {
        if (res && res.data) {
          this.$store.dispatch('setTodolist', res.data)
        }
      })
    },
    setWarehouse() {
      var warehouse = this.warehouse;
      if (!warehouse) {
        this.$message({
          type: 'info',
          message: '请选择仓库'
        })
        return false
      }
      setWarehouseCode({ operaterId: this.userInfo.id, warehouseCode: warehouse }).then(res => {
        if (res) {
          this.totallist()
          this.$store.dispatch('SetWarehouse', warehouse).then(res => {
            this.$message({ type: 'success', message: '切换仓库成功' })
            this.$store.dispatch('delAllViews')
            this.$router.push('/')
          })
        } else {
          this.warehouse = this.preWarehouse
        }
      })
    },
    modifyPassword() {
      this.$refs.ruleForm2.validate((valid) => {
        if (valid) {
          updatepassword({
            userId: this.userInfo.id,
            oldPw: this.form.oldpassword,
            newPw: this.form.newpassword
          }).then(res => {
            if (res) {
              this.$message.success('修改密码成功')
              this.modifyPasswordShow = false
            }
          })
        } else {
          return false
        }
      })
    },

    logout() {
      this.$confirm('确定退出吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(action => {
        if (action === 'confirm') {
          logout()
          this.$store.dispatch('SetWarehouse', '')
          this.$store.dispatch('setTodolist', '')
          location.href = `/login`
        }
      }).catch(() => { })
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss">
.top-container {
  height: 65px;
  background: #304156;
  position: fixed;
  width: 100%;
  z-index: 1001;
  top: 0;
  .logo {
    margin: 0 24px;
    float: left;
  }
  .plant-text {
    line-height: 62px;
    font-size: 22px;
    font-weight: bold;
    color: #fff;
  }
}

.avatar-container {
  height: 50px;
  display: inline-block;
  position: absolute;
  right: 35px;
  top: 0;
  color: #f2f2f2;
  &.warehouse {
    right: 160px;
  }
  .welcome {
    line-height: 60px;
  }
  .avatar-wrapper {
    cursor: pointer;
    margin-top: 5px;
    position: relative;
    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 10px;
    }
    .el-icon-caret-bottom {
      position: absolute;
      right: -20px;
      top: 25px;
      font-size: 12px;
    }
  }
}
.usercont {
  position: absolute;
  right: 100px;
  top: 8px;
  color: #666;
  line-height: 35px;
}
.need {
  font-size: 24px;
  cursor: pointer;
}
.top-nav {
  position: absolute;
  right: 300px;
  top: 2px;
  list-style: none;
  margin: 0;
  padding: 0;
  li {
    float: left;
    a {
      line-height: 62px;
      height: 62px;
      padding: 0 20px;
      color: #b5c6d9;
      font-size: 16px;
      display: block;
      transition: all 0.3s;
    }
    a:hover {
      background: #263445;
      color: #fff;
      padding: 0 25px;
      transition: all 0.3s;
    }
  }
}
</style>
