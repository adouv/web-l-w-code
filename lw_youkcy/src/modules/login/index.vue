<template>
  <div class="login-container">
    <el-container>
      <el-header>
        <img src="../../assets/images/login/login-logo.png" class="logo">
      </el-header>
      <el-main>
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          auto-complete="on"
          label-position="left"
        >
          <h3 class="title">园区运维管理平台</h3>
          <div class="login-center">
            <el-form-item prop="username">
              <span class="svg-container">
                <svg-icon icon-class="user"/>
              </span>
              <el-input
                v-model="loginForm.username"
                name="username"
                type="text"
                auto-complete="on"
                placeholder="请输入您的账号"
              />
            </el-form-item>
            <el-form-item prop="password">
              <span class="svg-container">
                <svg-icon icon-class="password"/>
              </span>
              <el-input
                :type="pwdType"
                v-model="loginForm.password"
                name="password"
                auto-complete="on"
                placeholder="请输入您的密码"
                @keyup.enter.native="handleLogin"
              />
              <!-- <span class="show-pwd" @click="showPwd">
                <svg-icon :icon-class="pwdType === 'password' ? 'eye' : 'eye-open'"/>
              </span> -->
            </el-form-item>
            <el-form-item style="margin-top:58px;margin-bottom:10px;">
              <el-button
                :loading="loading"
                type="primary"
                style="width:100%;"
                @click.native.prevent="handleLogin"
              >登录</el-button>
            </el-form-item>
            <div class="tips">
              <el-tooltip class="item" effect="dark" content="请联系系统超级管理员进行重置！" placement="bottom">
                <el-button type="text">忘记密码？</el-button>
              </el-tooltip>
            </div>
          </div>
        </el-form>
      </el-main>
      <el-footer>
        <p>北京来为科技股份有限公司©保留所有权利</p>
        <p>Beijing LaiWei Technology Co., Ltd All Rights Reserved</p>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { isvalidUsername } from "@/utils/validate";

export default {
  name: "Login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("用户名或密码不能为空"));
      } else {
        callback();
      }
    };
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error("密码不能小于5位"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "",
        password: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        password: [{ required: true, trigger: "blur", validator: validatePass }]
      },
      loading: false,
      pwdType: "password",
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.pwdType === "password") {
        this.pwdType = "";
      } else {
        this.pwdType = "password";
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("Login", this.loginForm)
            .then(() => {
              this.loading = false;
              // this.$router.push({ path: this.redirect || '/' })
              this.$router.push({ path: "/entrance" });
            })
            .catch(error => {
              this.$message.error(error);
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
$bg: #2d3a4b;
$light_gray: #eee;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 40px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: #999999;
      height: 40px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px #ffffff inset !important;
        -webkit-text-fill-color: #999999 !important;
        height: 36px !important;
      }
    }
  }
  .el-form-item {
    width: 240px;
    height: 40px;
    background-color: #ffffff;
    border-radius: 6px;
    border: solid 1px #ebebeb;
    margin: 0 auto;
    margin-bottom: 21px;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #999999;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  .el-header {
    height: 240px !important;
    background: url("../../assets/images/login/login-bg.png");
    text-align: center;
    line-height: 240px;
    .logo {
      margin-top: 63px;
    }
  }
  .login-form {
    width: 300px;
    max-width: 100%;
    margin: 0 auto;
  }
  .login-center {
    box-shadow: 0px 5px 20px 0px rgba(34, 108, 251, 0.2);
    border-radius: 6px;
    padding-top: 51px;
    height: 300px;
  }
  .tips {
    font-size: 14px;
    color: #409eff;
    margin-bottom: 10px;
    text-align: center;
    cursor: pointer;
  }
  .svg-container {
    padding: 0 5px 0 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title {
    font-size: 18px;
    font-weight: 400;
    color: #409eff;
    margin: 0px auto 21px auto;
    text-align: center;
    font-weight: bold;
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
  .el-footer {
    font-size: 14px;
    text-align: center;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    color: #999999;
    p {
      margin: 2px;
    }
  }
}
</style>
