<template>
  <div class="login">
    <div class="sign-panel drag-area">
      <div class="loginBg"></div>
      <div class="login-forms">
        <div class="login-form">
          <div class="input-container">
            <div class="input-panel">
              <i class="icon iconfont icon-pc-user"></i>
              <div class="input-border">
                <input
                  type="text"
                  placeholder="请输入用户名"
                  v-model="params.username"
                  @keyup.enter="btnLogin"
                >
              </div>
            </div>
            <div class="input-panel">
              <i class="icon iconfont icon-pc-password"></i>
              <div class="input-border">
                <input
                  type="password"
                  placeholder="请输入密码"
                  v-model="params.password"
                  @keyup.enter="btnLogin"
                >
              </div>
            </div>
          </div>
          <div class="login-footer">
            <div class="sure" @click="btnLogin">登录</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import AuthService from "../../_services/auth.service";
/**
 * 登录
 */
export default {
  name: "LoginComponent",
  data() {
    return {
      params: {
        client_id: 1,
        client_secret: "123",
        scope: "read",
        grant_type: "password",
        username: "",
        password: ""
      }
    };
  },
  mounted() {
  },
  methods: {
    btnLogin() {
      if (this.params.username === "") {
        this.$message.error("用户名不能为空！");
        return;
      }

      if (this.params.password === "") {
        this.$message.error("密码不能为空！");
        return;
      }
      // 登录之前清空token
      this.local$.removeItem("LWToken");
      AuthService.sign(this.params).then(response => {
        let token = response.access_token;
        // this.local$.removeItem("LWToken");
        this.local$.setItem("LWToken", response.access_token);
        AuthService.getAuthInfo().then(response => {
          console.log("获取登录信息接口返回：", response);
          if (response) {
            // 缓存用户信息
            window.localStorage.setItem("userId", response.accountId);
            window.localStorage.setItem("displayName", response.displayName);
            window.localStorage.setItem("userInfo",JSON.stringify(response));
            if (response.gardens && response.gardens[0]) {
              window.localStorage.setItem("gardenId",response.gardens[0].gardenId);
            }
            this.$router.push({
              path: "/exerciseManage"
            });
          }
          // Vue.router$.push("/exerciseManage");
          // window.location.href = "/exerciseManage";
        });
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped  lang="scss" >
@import "../../assets/scss/index.scss";
.login {
  width: 360px;
  height: 480px;
  margin: 50px auto;
  position: relative;

  .loginBg {
    width: 100%;
    height: 180px;
    background: url(../../assets/images/login-bg-new.png) no-repeat;
  }

  .login-forms {
    width: 100%;
    display: flex;
    flex-direction: row;

    .login-form {
      width: 100%;
      display: inline-block;
      border-bottom-right-radius: 6px;
      border-bottom-left-radius: 6px;
      background: #fff;

      .input-container {
        padding: 37px 0 10px 0;

        .input-panel {
          width: 301px;

          display: flex;
          flex-direction: row;
          margin: 0 auto;
          margin-bottom: 21px;
          i {
            width: computer(30px);
            line-height: computer(40px);
            display: inline-block;
          }

          input {
            -webkit-app-region: no-drag;
            outline: none !important;
            border: none;
            font-size: computer(14px);
            width: computer(270px);
            height: computer(40px);
            background-color: #ffffff;
            box-shadow: 0px 1px 0px 0px #dddddd;
          }
        }
      }

      .login-footer {
        .sure,
        .lin {
          cursor: pointer;
        }

        .sure {
          -webkit-app-region: no-drag;
          width: computer(161px);
          height: computer(40px);
          line-height: computer(40px);
          text-align: center;
          border-radius: computer(6px);
          color: white;
          background: linear-gradient(to right, #febb5c, #ff7d55);
          margin: auto;
        }

        .lin {
          -webkit-app-region: no-drag;
          margin: auto;
          text-align: center;
          margin-top: computer(52px);
          margin-bottom: computer(16px);
          font-family: MicrosoftYaHei;
          font-size: computer(14px);
          font-weight: normal;
          font-stretch: normal;
          color: #ff7d55;
        }
      }
    }
  }

  .close {
    -webkit-app-region: no-drag;
    cursor: pointer;
    border: 0;
    background: transparent;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 10;
    font-weight: 700;
    line-height: 1;
    text-decoration: none;
    transition: color 0.3s ease;
    color: rgba(0, 0, 0, 0.43);
    outline: 0;
  }

  .close-x {
    display: block;
    font-style: normal;
    vertical-align: baseline;
    text-align: center;
    text-transform: none;
    text-rendering: auto;
    width: 22px;
    height: 34px;
    line-height: 34px;
    color: #fff;
  }
}
</style>
