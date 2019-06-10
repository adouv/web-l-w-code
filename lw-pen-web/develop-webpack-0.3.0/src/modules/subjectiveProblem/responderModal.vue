<template>
  <div class="responder-content">
    <template v-if="params.penid">
      <div class="modal" flex="dir:left;main:center;cross:center;box:mean">
        <p class="mar-r-20px">
          <img src="../../assets/images/nv.png">
        </p>

        <p>恭喜"{{params.name}}"抢到答题权</p>
      </div>
      <div class="modal-bottom">
        <span>{{count}}s</span>后自动投屏显示
      </div>
    </template>
    <template v-else>
      <div class="modal" flex="dir:left;main:center;cross:center;box:mean">
        <p class="mar-r-20px">
          <img src="../../assets/images/defaultHead.png">
        </p>
        <p>秀出你的才华...</p>
      </div>
      <div class="modal-bottom">
        已等待
        <span>{{time}}</span>s
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "ResponderModalComponent",
  props: {
    params: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      countInterval: 0,
      time: 1,
      count: 2
    };
  },
  mounted() {
    let myThis = this;
    this.countInterval = setInterval(() => {
      this.time++;
      if (myThis.params.penid) {
        this.count--;
        if (this.count <= 0) {
          clearInterval(myThis.countInterval);
          document.getElementById("modal-qiangda2").remove();
          myThis.win$.send("close", {
            selectMenu: myThis.params.selectMenu
          });
          let urlParams = {
            studentId: myThis.params.penid,
            questionId: myThis.params.questionId,
            bagId: myThis.params.bagId,
            autoGrade: myThis.params.autoGrade,
            exerciseRecordId: myThis.params.exerciseRecordId
          };
          myThis.win$.openWindow("noteTaking", {
            fullscreen: true,
            urlParams: urlParams
          });
        }
      }
    }, 1000);
  },
  methods: {}
};
</script>
<style lang="scss">
@import "../../assets/scss/index.scss";
.responder-content {
  color: #ff7d55;
  .modal {
    font-size: computer(20px);
    justify-content: center;
    align-items: center;
  }
  span {
    color: #ff7d55;
  }
  .modal-bottom {
    text-align: center;
    font-size: computer(14px);
  }
}
</style>