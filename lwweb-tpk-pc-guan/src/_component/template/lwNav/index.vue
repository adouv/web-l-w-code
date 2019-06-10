<template>
  <div class="lw-nav">
    <div class="center-box"></div>
    <div class="nav-new">
      <ul>
        <li
          v-for="(item,index) in navList"
          :key="index"
          @click="to(item);"
          :class="{'active':item.type===1}"
        >
          <div class="nav-icon">
            <span>{{item.title}}</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="header-tools">
      <i class="icon iconfont icon-meau" @click="ShowPark($event)"></i>
      <i class="icon iconfont icon-minimize"></i>
      <i class="icon iconfont icon-close1"></i>
    </div>
  </div>
</template>

<script>
import UtilsService from "../../../_service/utils.service";
export default {
  name: "LwNavComponent",
  data() {
    return {
      navList: []
    };
  },
  mounted() {
    this.GetLwNavList();
  },
  methods: {
    GetLwNavList() {
      UtilsService.GetLwNavList().then(response => {
        this.navList = response;
      });
    },
    to(item) {
      switch (item.type) {
        case 0:
          window.location.href = item.router;
          break;
        case 1:
          this.$router.push({ name: item.router });
          break;
      }
    },
    ShowPark(event) {}
  }
};
</script>

<style lang="scss">
@import "../../../assets/scss/_ddd/variable.style.scss";
.lw-nav {
  width: 100%;
  height: computer(100px);
  background: url("../../../assets/images/nav-bg.png") no-repeat;
  line-height: normal;
  display: flex;
  align-items: center;
  padding: 0 computer(20px);
  color: #fff;
  .center-box {
    width: computer(140px);
    height: computer(58px);
    background: url("../../../assets/images/logo.png") no-repeat center center;
    background-size: 100%;
  }
  .nav-new {
    height: computer(100px);
    margin-left: computer(45px);
    ul {
      display: flex;
      align-items: center;

      li {
        height: computer(100px);
        width: computer(140px);
        text-align: center;
        cursor: pointer;
        @for $i from 1 through 4 {
          &:nth-child(#{$i}) {
            .nav-icon {
              background: url(../../../assets/images/nav-#{$i}.png)
                no-repeat
                center
                computer(15px);
            }
          }
        }
        .nav-icon {
          width: 100%;
          height: 100%;
          span {
            display: block;
            padding-top: computer(72px);
            font-size: computer(14px);
          }
        }
        &:hover,
        &.active {
          background: url("../../../assets/images/nav-item-hover-bg.png")
            no-repeat center center;
        }
      }
    }
  }
  .header-tools {
    width: 97px;
    position: absolute;
    right: computer(20px);
    top: computer(22px);
    i {
      cursor: pointer;
      &:nth-child(2) {
        margin: 0 computer(13px);
      }
    }
  }
}
</style>


