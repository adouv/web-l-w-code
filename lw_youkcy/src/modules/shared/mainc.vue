<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <!-- or name="fade" -->
      <router-view></router-view>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'MaincComponent',
  computed: {
    // key() {
    //   return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    // }
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  background: rgb(240, 240, 240);
  min-height: calc(100vh - 50px);
  position: relative;
  overflow: hidden;
}
</style>
