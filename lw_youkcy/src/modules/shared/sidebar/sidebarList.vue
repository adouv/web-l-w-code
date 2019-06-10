<template>
  <div>
    <div class="left-logo">
      <img src="../../../assets/images/leftlogo.png">
    </div>
    <div class="menu-wrapper" v-if="rolesName=='maliangbi'">
      <el-menu-item index="1" :class="{'submenu-title-noDropdown':!isNest,'is-active':isActive}">
        <svg-icon icon-class="link"/>
        <span slot="title" @click="$router.push({name:'parkBind'})">园区绑定</span>
      </el-menu-item>
    </div>
    <div class="menu-wrapper" v-if="rolesName=='baseManager'">
      <el-submenu index="2">
        <template slot="title">
          <svg-icon icon-class="link"/>
          <span class="nest-menu">学生管理</span>
        </template>
        <el-menu-item index="2-1" @click="$router.push({name:'student'})">学生名单</el-menu-item>
        <!-- <el-menu-item index="2-2">添加学生</el-menu-item> -->
      </el-submenu>
      <el-submenu index="3" v-if="rolesName=='baseManager'">
        <template slot="title">
          <svg-icon icon-class="link"/>
          <span class="nest-menu">学年管理</span>
        </template>
        <el-menu-item index="3-1" @click="$router.push({name:'schoolYear'})">学年列表</el-menu-item>
      </el-submenu>
    </div>
    <div class="menu-wrapper" v-if="rolesName=='baseManager'">
      <el-submenu index="4">
        <template slot="title">
          <svg-icon icon-class="link"/>
          <span class="nest-menu">家长管理</span>
        </template>
        <el-menu-item index="4-1" @click="$router.push({name:'parent'})">家长名单</el-menu-item>
      </el-submenu>
    </div>
    <div class="menu-wrapper" v-if="rolesName=='baseManager'">
      <el-submenu index="5">
        <template slot="title">
          <svg-icon icon-class="link"/>
          <span class="nest-menu">教职工管理</span>
        </template>
        <el-menu-item index="5-1" @click="$router.push({name:'teacherList'})">教职工名单</el-menu-item>
      </el-submenu>
    </div>
    <div class="menu-wrapper" v-if="rolesName=='maliangbi'">
      <el-submenu index="6">
        <template slot="title">
          <svg-icon icon-class="link"/>
          <span class="nest-menu">马良笔</span>
        </template>
        <el-menu-item index="5-1" @click="$router.push({name:'deviceManage'})">设备管理</el-menu-item>
        <el-menu-item index="5-2" @click="$router.push({name:'accountOpen'})">设备开户</el-menu-item>
      </el-submenu>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import path from "path";
import variables from "@/assets/scss/variables.scss";
import { isExternal } from "@/utils/validate";
import SidebarItemComponent from "./sidebarItem";
import SidebarLinkComponent from "./sidebarLink";
import AccountService from "@/_services/account.service";
export default {
  name: "SidebarListComponent",
  components: {
    "sidebar-item": SidebarItemComponent,
    "sidebar-link": SidebarLinkComponent
  },
  props: {
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      onlyOneChild: null,
      rolesName: "",
      isActive: false
    };
  },
  mounted() {
    this.rolesName = this.local$.getItem("rolesName");
    console.log(this.$route.path);
    if (this.$route.path === "/parkBind") {
      this.isActive = true;
    } else {
      this.isActive = false;
    }
  },
  computed: {
    ...mapGetters(["sidebar"]),
    routes() {
      return this.$router.options.routes;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    }
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  },
  watch: {
    $route(to, from) {
      console.log(this.$route.path);
    }
  }
};
</script>
<style lang="scss">
.is-active {
  color: #409eff !important;
}
.left-logo {
  text-align: center;
  padding: 10px 0;
}
</style>

