<template>
  <div class="menu">
    <div
      class="menu-header"
      v-if="!params.switchMenu"
      v-bind:class="{'menu-header-active':params.className}"
    >
      <i
        class="icon iconfont icon-pc-banji"
        @click="openWin({key:99,label:'笔',icon:'',show:true,url:'noteTaking',options:{fullscreen: true}});"
      ></i>
      <div class="ls-class" v-if="params.className">{{params.className}}</div>
    </div>

    <div class="menu-list" v-if="!params.switchMenu">
      <ul v-bind:class="{'disabled': !params.isLogin}">
        <li
          v-for="item in menuList.filter((v,i,a)=>{return v.show===true})"
          :key="item.key"
          :class="{'active':params.activeIndex===item.key}"
          @click="openWin(item);"
        >
          <i :class="item.icon"></i>
          {{item.label}}
        </li>
      </ul>

      <div class="menu-class-over">
        <template v-if="params.isLogin">
          <span @click="btnOut();">{{control.find(i=>i.key===1).label}}</span>
        </template>
        <template v-else>
          <span @click="openWin(control.find(i=>i.key===0));">{{control.find(i=>i.key===0).label}}</span>
        </template>
      </div>

      <div class="menu-footer" @click="btnSwitchMenu();"></div>
    </div>

    <div class="up-menus">
      <div class="up-menu" v-if="params.switchMenu">
        <img
          src="../../../../assets/images/pen.png"
          @click="btnSwitchMenu();"
          class="up-menu-pen"
          alt="pen"
        >
      </div>
    </div>
  </div>
</template>


<script>
import { menuList, control } from "../enum";
import lwPenSelectQuestionSql from "../../../../_sql/lw.pen.select.question.sql";
export default {
  name: "MenuComponent",
  data() {
    return {
      params: {
        className: "",
        isLogin: false,
        switchMenu: false,
        activeIndex: -1,
        winIndex: 0
      },
      menuList: menuList,
      control: control,
      out: false
    };
  },
  async mounted() {
    let myThis = this;
    this.local$.removeItem("lwUdp");
    this.local$.removeItem("lwQuestion");
    //当前题，添加默认数据
    await lwPenSelectQuestionSql.selectQuestionSigle().then(response => {
      if (response.Data.length === 0) {
        lwPenSelectQuestionSql.insertDefaultQuestion();
      } else {
        lwPenSelectQuestionSql.updateQuestionSigle({ bagId: -1 });
      }
    });

    this.udp$.udpService(8486, (data, lwUdp, len) => {
      let win_id = this.local$.getItem("win_id_subjectiveProblem");

      myThis.win$
        .getRemote()
        .BrowserWindow.fromId(parseInt(win_id))
        .webContents.send("answerData", {
          data: data,
          lwUdp: lwUdp,
          len: len
        });
    });

    this.receiveLogin();
  },
  methods: {
    receiveLogin() {
      let myThis = this;
      myThis.params.isLogin = myThis.local$.existsItem("LWToken");
      myThis.params.className = myThis.local$.getItem("selectClassName");
      myThis.win$.receive("login", (event, args) => {
        console.log(args);
        myThis.params.isLogin = args;
        if (args) {
          myThis.params.className = myThis.local$.getItem("selectClassName");
        } else {
          myThis.params.className = "";
        }
      });
    },
    openWin(item) {
      let winKey = this.local$.getItem(`win_id_${item.url}`);

      if (winKey) {
        return;
      }

      if (this.params.isLogin || item.url === "sign") {
        this.params.activeIndex = item.key;
        this.win$.openWindow(item.url, item.options);
      }
    },
    btnSwitchMenu() {    
      this.params.switchMenu = !this.params.switchMenu;
      if (this.params.switchMenu) {
        this.win$.setCurrentWindowPosition(
          window.screen.availWidth - 80,
          window.screen.availHeight - 80
        );
      } else {
        this.win$.setCurrentWindowPosition(
          window.screen.availWidth - 80,
          window.screen.availHeight - 400
        );
      }
    },
    btnOut() {
      this.params.isLogin = false;
      this.params.className = "";
      this.local$.clear();
      this.win$.ipcRenderer().send("close", true);
    }
  }
};
</script>

<style lang="scss">
@import "../../../../assets/scss/index.scss";
$height: computer(395px);
.menu {
  width: 100%;
  height: $height;
  position: relative;
  .menu-header {
    border-radius: 50px;
    width: computer(80px);
    height: computer(80px);
    line-height: computer(80px);
    background-image: linear-gradient(0deg, #ff7d55 0%, #febb5c 100%),
      linear-gradient(#34494a, #34494a);
    background-blend-mode: normal, normal;
    display: flex;
    display: -webkit-flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    cursor: pointer;
    position: absolute !important;
    top: 0px;
    left: 0px;
    z-index: 999999999 !important;

    i {
      -webkit-app-region: no-drag;
      font-size: computer(24px);
    }

    .ls-class {
      -webkit-app-region: no-drag;
      font-size: computer(12px);
      @include line-ell(55px);
    }
    &.menu-header-active {
      text-align: center;
      line-height: computer(20px) !important;
      flex-direction: column;
    }
  }
  .menu-list {
    width: computer(60px);
    height: $height;
    background-color: #3b5253;
    box-shadow: 0px 2px 8px 0px #3d3740;
    border-radius: 30px;
    margin: 0 auto;
    ul {
      height: computer(144px);
      width: 100%;
      padding-top: 100px;
      &.disabled {
        ul,
        li {
          color: #a9b5b5;
          opacity: 0.2;
        }

        ul,
        li:hover {
          color: #a9b5b5;
          cursor: default;
          opacity: 0.2;
        }
      }
      li {
        -webkit-app-region: no-drag;
        width: 100%;
        height: computer(72px);
        font-size: computer(12px);
        text-align: center;
        color: #a9b5b5;
        cursor: pointer;
        i {
          display: block;
          font-size: 24px;
        }
        &:hover {
          color: #ff7d55;
        }
        &.active {
          color: #ff7d55;
        }
      }
    }
    .menu-class-over {
      -webkit-app-region: no-drag;
      width: computer(40px);
      height: computer(40px);
      line-height: computer(40px);
      margin: 0 auto;
      background-image: linear-gradient(90deg, #febb5c 0%, #ff7d55 100%),
        linear-gradient(#4d4850, #4d4850);
      background-blend-mode: normal, normal;
      border-radius: 50px;
      font-size: 12px;
      color: #fff;
      text-align: center;
      margin-top: computer(115px);
      cursor: pointer;
    }
    .menu-footer {
      -webkit-app-region: no-drag;
      width: computer(60px);
      height: computer(60px);
      background-color: #34494a;
      position: absolute;
      left: 50%;
      bottom: 0px;
      transform: translate(-50%, -50%);
      border-radius: 50px;
      margin-bottom: -32px;
      cursor: pointer;
      background-image: url("../../../../assets/images/open-btn.png");
      font-size: 40px;
    }
  }

  .up-menus {
    width: 100%;
    .up-menu {
      width: computer(80px);
      height: computer(80px);
      margin: 0 auto;
      background: url("../../../../assets/images/pen-bg.png") no-repeat center
        center;
      border-radius: 50px;
      display: flex;
      justify-content: center;
      cursor: pointer;

      .up-menu-pen {
        -webkit-app-region: no-drag;
        width: 40px;
        height: 40px;
        margin-top: 20px;
      }
    }
  }
}
</style>
