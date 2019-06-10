<template>
  <div class="sub-menu">
    <div class="menu-header" v-if="!params.switchMenu">
      <i class="icon iconfont icon-pc-shijian"></i>
      <div
        class="ls-class"
      >{{intervalParams.hour|exerciseTime}}:{{intervalParams.minute|exerciseTime}}:{{intervalParams.second|exerciseTime}}</div>
    </div>

    <div class="menu-list" v-if="!params.switchMenu">
      <ul>
        <li
          v-for="item in subMenuList.filter((v,i,a)=>{return v.show===true})"
          :key="item.key"
          :class="{'disabled': item.disabled,'active': item.active}"
          @click="btnSwitchStatus(item);"
          :title="!answerStu && !responderStu && currentAutoGarde && item.key == 1 && item.disabled?'当前为客观题不支持自判':''"
        >
          <i :class="item.icon"></i>
          {{item.switch?item.label:item.end}}
        </li>
      </ul>

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
    <audio ref="audio"></audio>
  </div>
</template>

<script>
import { subMenuList } from "../enum";
import lwPenSelectQuestionSql from "../../../../_sql/lw.pen.select.question.sql";
export default {
  name: "SubMenuComponent",
  data() {
    return {
      winParams: {},
      params: {
        className: "",
        isLogin: false,
        switchMenu: false,
        activeIndex: -1,
        selectMenu: {}
      },
      intervalParams: {
        countInterval: 0,
        hour: 0,
        second: 0,
        minute: 0
      },
      selectMenu: {},
      subMenuList: [
        {
          key: 0,
          label: "开始答题",
          end: "结束答题",
          icon: "icon iconfont icon-pc-write",
          show: true,
          switch: true,
          disabled: false,
          active: false
        },
        {
          key: 1,
          label: "开始自判",
          end: "结束自判",
          icon: "icon iconfont icon-pc-responder",
          show: true,
          switch: true,
          disabled: false,
          active: false
        },
        {
          key: 2,
          label: "抢答",
          end: "抢答",
          icon: "icon iconfont icon-pc-tiaoren",
          show: true,
          switch: true,
          disabled: false,
          active: false
        },
        {
          key: 3,
          label: "答判情况",
          end: "",
          icon: "icon iconfont icon-pc-student",
          show: true,
          switch: true,
          disabled: false,
          active: false
        }
      ],
      currentAutoGarde: false,
      qindex: null,
      answerStu: false, //答题状态
      selfJudeStu: false, // 自判状态
      responderStu: false, // 抢答状态
      countDownStu: true, //倒计时状态
      stu: true
    };
  },
  mounted() {
    let myThis = this;
    this.win$.receive("updateState", (event, args) => {
      console.log("updateState:", args);
      myThis.stu = true;
      myThis.subMenuList.filter((v, i, a) => {
        v.disabled = false;
        return a;
      });
      console.log(myThis.stu);
      // args参数包含：{selectMenu,selectQuestion}
      this.selectMenu = args.selectMenu;
      let receSubMenu = myThis.subMenuList.find(
        i => i.key === args.selectMenu.key
      );
      
      if (receSubMenu.key === 0) {
        console.log("开始答题", receSubMenu.switch);
        myThis.answerStu = receSubMenu.switch;
        myThis.subMenuList[1].disabled = receSubMenu.switch;
        myThis.subMenuList[2].disabled = receSubMenu.switch;
        
        if(!receSubMenu.switch){
          //结束答题时验证自判按钮是否可用
          myThis.subMenuList[1].disabled = myThis.currentAutoGarde;
        }
        receSubMenu.switch = !receSubMenu.switch;
        
        if (!receSubMenu.switch) {
          myThis.recordAnswerTime();
          myThis.local$.removeItem("lwUdp");
          myThis.local$.setItem("lwUdp", JSON.stringify(receSubMenu));
        } else {
          myThis.clearAnswerTime();
          myThis.local$.removeItem("lwUdp");
        }
      }
      if (receSubMenu.key === 1) {
        myThis.selfJudeStu = receSubMenu.switch;
        myThis.subMenuList[0].disabled = receSubMenu.switch;
        myThis.subMenuList[2].disabled = receSubMenu.switch;
         if(!receSubMenu.switch){
          //结束自判时验证自判按钮是否可用
          myThis.subMenuList[1].disabled = myThis.currentAutoGarde;
        }
        receSubMenu.switch = !receSubMenu.switch;
        // myThis.subMenuList[1].switch = receSubMenu.switch;
        if (!receSubMenu.switch) {
          myThis.local$.removeItem("lwUdp");
          myThis.local$.setItem("lwUdp", JSON.stringify(receSubMenu));
        } else {
          myThis.local$.removeItem("lwUdp");
        }
      }
      if (receSubMenu.key === 2) {
        myThis.responderStu = receSubMenu.switch;
        myThis.subMenuList[0].disabled = receSubMenu.switch;
        myThis.subMenuList[1].disabled = receSubMenu.switch;
        if(!receSubMenu.switch){
          //结束抢答时验证自判按钮是否可用
          myThis.subMenuList[1].disabled = myThis.currentAutoGarde;
        }
        receSubMenu.switch = !receSubMenu.switch;
        
        // myThis.subMenuList[1].switch = receSubMenu.switch;
        if (!receSubMenu.switch) {
          myThis.local$.removeItem("lwUdp");
          myThis.local$.setItem("lwUdp", JSON.stringify(receSubMenu));
        } else {
          myThis.local$.removeItem("lwUdp");
        }

      }
    });

    this.win$.receive("currentQuestion", (event, args) => {
      console.log("答题状态", myThis.answerStu);
      if (myThis.answerStu || myThis.responderStu) {
        myThis.subMenuList[1].disabled = true;
      } else {
        myThis.subMenuList[1].disabled = args.autoGrade;
      }
      myThis.currentAutoGarde = args.autoGrade;
    });
    this.win$.receive("close", (event, args) => {
      console.log("closed:",args);
      myThis.stu = true;
      myThis.subMenuList.filter((v, i, a) => {
        v.disabled = false;
        return a;
      });
      myThis.answerStu = false;
      myThis.selfJudeStu = false;
      myThis.responderStu = false;
      myThis.subMenuList.forEach(element => {
        if (element.key === args.selectMenu.key) {
          element.active = false;
          element.switch = true;
        } else {
          element.disabled = false;
        }

        if(element.key === 2){
          element.switch = true;
        }
      });
      myThis.subMenuList[1].disabled = myThis.currentAutoGarde;
    });
    this.win$.receive("menuNoClick", (event, args) => {
      console.log("menuNoClick",args);
      myThis.stu = args;
      myThis.subMenuList.filter((v, i, a) => {
        v.disabled = !args;
        return a;
      });
    });
  },
  methods: {
    btnSwitchStatus(item) {
      if (!this.stu) {
        return;
      }
      //item.active = item.active ? false : true;
      switch (item.key) {
        //开始答题
        case 0:
          if (this.selfJudeStu || this.responderStu) {
            return;
          }
          break;
        //开始自判
        case 1:
          if (this.answerStu || this.currentAutoGarde || this.responderStu) {
            return;
          }
          break;
        //抢答
        case 2:
          if (this.answerStu || this.selfJudeStu) {
            return;
          }
          break;
        //答判情况
        case 3:
          break;
      }
      let win_id = this.local$.getItem("win_id_subjectiveProblem");

      this.win$
        .getRemote()
        .BrowserWindow.fromId(parseInt(win_id))
        .webContents.send("operation", item);
      // let win_id = this.local$.getItem("win_id_subjectiveProblem");

      // this.win$
      //   .getRemote()
      //   .BrowserWindow.fromId(parseInt(win_id))
      //   .webContents.send(
      //     "operation",
      //     this.qindex === null ? item.key : this.qindex
      //   );
    },

    //记录时间
    recordAnswerTime() {
      let myThis = this;
      myThis.intervalParams.countInterval = setInterval(() => {
        if (myThis.intervalParams.second === 59) {
          myThis.intervalParams.second = 0;
          if (myThis.intervalParams.minute === 59) {
            myThis.intervalParams.minute = 0;
            myThis.intervalParams.hour++;
          } else {
            myThis.intervalParams.minute++;
          }
        } else {
          myThis.intervalParams.second++;
        }
      }, 1000);
    },
    //清除记录时间
    clearAnswerTime() {
      clearInterval(this.intervalParams.countInterval);
      this.intervalParams.hour = 0;
      this.intervalParams.minute = 0;
      this.intervalParams.second = 0;
    },
    //底部切换菜单显示隐藏
    btnSwitchMenu() {
      let win_id = this.local$.getItem("win_id_subjectiveProblem");   
      this.params.switchMenu = !this.params.switchMenu;
      if (this.params.switchMenu) {
        this.win$.setCurrentWindowPosition(
          window.screen.availWidth - 80,
          window.screen.availHeight - 80
        );
        this.win$
        .getRemote()
        .BrowserWindow.fromId(parseInt(win_id))
        .minimize();
      } else {
        this.win$.setCurrentWindowPosition(
          window.screen.availWidth - 80,
          window.screen.availHeight - 450
        );
        this.win$
        .getRemote()
        .BrowserWindow.fromId(parseInt(win_id))
        .focus();
        this.win$
        .getRemote()
        .BrowserWindow.fromId(parseInt(win_id))
        .maximize();
      }
    }
  }
};
</script>

<style lang="scss">
@import "../../../../assets/scss/index.scss";
$height: computer(440px);
.sub-menu {
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
    text-align: center;
    line-height: computer(20px) !important;
    flex-direction: column;

    i {
      -webkit-app-region: no-drag;
      font-size: computer(24px);
    }

    .ls-class {
      -webkit-app-region: no-drag;
      font-size: computer(12px);
      @include line-ell(55px);
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
        &.disabled {
          opacity: 0.5;
          cursor: default;
          &:hover {
            color: #a9b5b5;
          }
        }
      }
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
