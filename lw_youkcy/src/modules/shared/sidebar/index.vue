<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :show-timeout="200"
      default-active="2-1"
      :collapse="isCollapse"
      :background-color="variables.menuBg"
      :text-color="variables.menuText"
      :active-text-color="variables.menuActiveText"
      mode="vertical"
    >
      <sidebar-list/>
    </el-menu>
  </el-scrollbar>
</template>


<script>
import { mapGetters } from "vuex";
import variables from "@/assets/scss/variables.scss";
import SidebarListComponent from "./sidebarList";
export default {
  name: "SidebarComponent",
  components: {
    "sidebar-list": SidebarListComponent
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
  }
};
</script>
