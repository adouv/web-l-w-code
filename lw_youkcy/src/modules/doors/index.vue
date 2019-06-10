<template>
  <div class="lw_view_door">
    <el-container>
      <el-header>
        <el-row>
          <el-col :span="24">
            <div class="grid-content">
              <div style="float:left">
                <img src="../../assets/images/login/top-logo.png" alt="优课场域" class="logo">
                <div class="title">园区运维管理平台</div>
              </div>

              <div style="float:right">
                <div class="name">
                  <img src="../../assets/images/login/bar_head.png" alt>
                  <div>{{name}}</div>
                </div>
                <div class="logout">
                  <span class="cursor" @click="logout">退出</span>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <el-row style="border-bottom: 1px solid #dddddd; line-height: 48px;">
          <el-col :span="24" style="text-align:center">
            <div class="grid-content">模块运维入口
              <template>
                <el-select
                  v-model="gardenId"
                  @change="selectGarden"
                  placeholder="请选择园区"
                  style="width:200px;float:right"
                >
                  <el-option
                    :label="item.name"
                    v-for="item in gardenList"
                    :key="item.id"
                    :value="item.id"
                  >{{item.name}}</el-option>
                </el-select>
              </template>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="list">
            <div class="grid-content">
              <ul>
                <li
                  :class="{'disabled':rolesAll.baseManager.length==0}"
                  @click="jump('student',rolesAll.baseManager.length,'baseManager')"
                >
                  <img src="../../assets/images/login/img01.png" alt>
                </li>
                <li :class="{'disabled':rolesAll.ikeyou.length==0}">
                  <img src="../../assets/images/login/img02.png" alt>
                </li>
                <li
                  :class="{'disabled':rolesAll.maliangbi.length==0}"
                  @click="jump('parkBind',rolesAll.maliangbi.length,'maliangbi')"
                >
                  <img src="../../assets/images/login/img03.png" alt>
                </li>
                <li :class="{'disabled':rolesAll.iotCcs.length==0}">
                  <img src="../../assets/images/login/img04.png" alt>
                </li>
              </ul>
            </div>
          </el-col>
        </el-row>
      </el-main>
      <el-footer>
        <p>北京来为科技股份有限公司©保留所有权利</p>
        <p>Beijing LaiWei Technology Co., Ltd All Rights Reserved</p>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import AuthService from "@/_services/auth.service";
import AccountService from "@/_services/account.service";
import { mapGetters } from "vuex";
export default {
  name: "Entrances",
  data() {
    return {
      gardenList: [], // 园区列表
      gardenId: "", //所选择园区ID
      rolesAll: {
        baseManager: [],
        ikeyou: [],
        maliangbi: [],
        iotCcs: []
      }
    };
  },
  mounted() {
    // this.getPermission();
    this.getModuleAdmin();
    this.getGardenList();
    let _roles = this.roles.length > 0 ? this.roles : AccountService.getRoles();
    //console.log(_roles);
    if (_roles == "") {
      this.$router.push({ name: "entrance" });
    }
    //console.log(this.roles, AccountService.getRoles());
    //console.log(this.local$.getItem("roles"));

    this.gardenId = this.local$.getItem("gardenId");
  },
  methods: {
    enter() {
      this.$router.push({ path: "/" });
    },
    getPermission() {
      AuthService.getPermission().then(response => {
        console.log(response);
      });
    },
    /**
     * 选择园区
     */
    selectGarden(val) {
      this.local$.setItem("gardenId", val);
      this.gardenId = val;
    },
    /**
     * 获取园区列表
     */
    getGardenList() {
      AuthService.getGardenList()
        .then(response => {
          this.gardenList = response;
          this.local$.setItem("gardenList", JSON.stringify(response));
          this.gardenId = response[0].id;
          this.local$.setItem("gardenId", this.gardenId);
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
    /**
     * 获取模块列表
     */
    getModuleAdmin() {
      let params = {
        adminId: AccountService.getAccountId()
      };
      AuthService.getModuleAdmin(params)
        .then(response => {
          response.forEach(element => {
            if (
              element.moduleCode == "baseManager" ||
              element.moduleCode == "ikeyou" ||
              element.moduleCode == "maliangbi" ||
              element.moduleCode == "iotCcs"
            ) {
              this.rolesAll[element.moduleCode] = element;
            }
          });
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
    jump(url, length, name) {
      if (length == 0) {
        return;
      }
      this.$router.push({ name: url });
      this.local$.setItem("rolesName", name);
    },
    logout() {
      this.$store.dispatch("LogOut").then(() => {
        location.reload(); // 为了重新实例化vue-router对象 避免bug
      });
    }
  },
  computed: {
    ...mapGetters(["name", "roles"])
  }
};
</script>

<style lang="scss" scoped>
.lw_view_door {
  .el-header {
    background: url("../../assets/images/login/modul-bg.png");
    height: 80px !important;
    color: #fff;
    .logo {
      margin-top: 20px;
    }
    .title {
      float: right;
      line-height: 80px;
      margin-left: 20px;
    }
    .name {
      width: 60px;
      text-align: center;
      margin-top: 18px;
      float: left;
      font-size: 14px;
    }

    .logout {
      float: right;
      line-height: 80px;
      font-size: 14px;
      color: #409eff;
    }
    .grid-content {
      //   line-height: 80px;
      font-size: 18px;
      font-weight: normal;
    }
    .el-col-3 {
      width: 10.5% !important;
    }
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
  .el-select {
    height: 48px;
  }
  .list {
    ul {
      li {
        float: left;
        margin-left: 32px;
        cursor: pointer;
      }
    }
  }
  .disabled {
    opacity: 0.5;
    cursor: default !important;
  }
  .el-main {
    padding-top: 10px;
  }
}
</style>