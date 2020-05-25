<template>
  <div class="login-container">
    <div class="login-form">
      <el-form
        autoComplete="on"
        :model="loginForm"
        :rules="loginRules"
        ref="loginForm"
        label-position="left"
        label-width="0px"
        class="card-box formdetail"
      >
        <h3
          class="title"
          style="font-size:16px !important;"
        >四分音艺术后台管理系统</h3>
        <div v-if="usernameSubmit">
          <el-form-item prop="username">
            <span class="svg-container">
              <i
                class="el-icon-user"
                style="color:#f4b15a;font-size:18px;"
              ></i>
            </span>
            <el-input
              name="username"
              type="text"
              v-model="loginForm.username"
              autoComplete="on"
              placeholder="账号"
            />
          </el-form-item>
          <el-form-item prop="password">
            <span class="svg-container">

              <i
                class="el-icon-lock"
                style="color:#f4b15a;font-size:18px;"
              ></i>
            </span>
            <el-input
              name="password"
              :type="pwdType"
              @keyup.enter.native="handleLogin"
              v-model="loginForm.password"
              autoComplete="on"
              placeholder="密码"
            ></el-input>
            <!-- <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye" /></span> -->
          </el-form-item>
        </div>
        <!-- <el-form-item v-if="serviceSubmit" prop="serviceId" class="divitem">
          <template v-for="item in servicelist">
            <div style="line-height:30px !important;padding-left:10px;margin-top:2px;cursor:pointer;" @click="getServiceId(item)" :class="item.id===loginForm.serviceId?'divactive':'divcommon'">{{item.serviceName}}</div>
          </template>
          <el-input type="text" v-model="loginForm.serviceId" v-show="false"/>
        </el-form-item>-->
        <el-form-item
          style="margin-top:50px;"
          v-if="usernameSubmit"
        >
          <el-button
            style="width:100%;color:#fff;line-height:26px;"
            :loading="loading"
            @click.native.prevent="handleLogin"
            class="orangebg"
          >
            登录
          </el-button>
        </el-form-item>
        <!-- <el-form-item style="margin-top:50px;" v-if="serviceSubmit">
          <el-button style="width:100%;color:#fff;" :loading="loading" @click.native.prevent="handleLogin" class="orangebg">
            确定
          </el-button>
        </el-form-item>-->
      </el-form>
    </div>
  </div>
</template>

<script>
// import { isvalidUsername } from '@/utils/validate'
import { userlogin } from '@/api'
// import axios from 'axios'
export default {
  name: 'login',
  data() {
    return {
      loginForm: {
        username: null,
        password: null,
      },
      loginRules: {
        username: [{ required: true, message: '用户名不能为空', trigger: 'blur', }],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur', }],
      },
      loading: false,
      pwdType: 'password',
      serviceSubmit: false,
      usernameSubmit: true,
      servicelist: []
    }
  },
  created() {
  },
  methods: {
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          userlogin(this.loginForm).then(res => {
            if (!res) {
              return this.loading = false
            } else {
              location.href = '/'
            }
          })
        }
      })
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background: #3f73b6 url(/static/image/earthbg.png) center center no-repeat;
  .orangebg {
    background: #f4b15a;
    border: 1px solid #f4b15a;
  }
  // .loginform{background:url(/static/image/loginbg.png) center center no-repeat;}
  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0px 1000px #f2f4ff inset !important;
    -webkit-text-fill-color: #889aa4 !important;
  }
  input {
    background: transparent;
    border: 0px;
    -webkit-appearance: none;
    border-radius: 0px;
    padding: 12px 5px 12px 15px;
    color: #889aa4;
    height: 47px !important;
  }
  .el-input {
    display: inline-block;
    height: 47px !important;
    width: 85%;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title {
    font-size: 18px;
    color: $light_gray;
    margin: 0px auto 50px auto;
    text-align: right;
  }
  .login-form {
    position: absolute;
    right: 50%;
    margin-right: -380px;
    width: 822px;
    height: 418px;
    padding: 50px 35px 15px 500px;
    top: 50%;
    margin-top: -214px;
    background: url(/static/image/loginbg.png) center center no-repeat;
    .divactive {
      color: #409eff;
      background: #f2f4ff;
    }
  }
  .formdetail {
    width: 298px;
    margin: 20px 34px 0 0;
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: #f2f4ff;
    border-radius: 5px;
    color: #454545;
  }
  .divitem {
    background: none;
  }
  .divitem {
    .divcommon {
      background: #f2f4ff;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .thirdparty-button {
    position: absolute;
    right: 35px;
    bottom: 28px;
  }
}
</style>