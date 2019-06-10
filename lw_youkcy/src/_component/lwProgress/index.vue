<template>
  <div class="lw_progress">
    <div class="info">{{params.title}}</div>
    <div class="progress">
      <div
        class="progress-bar progress-bar-striped"
        ref="progress"
        :style="{'width':widthVal}"
      >{{widthVal}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LwProgressComponent",
  data() {
    return {
      widthVal: 0
    };
  },
  props: ["params"],
  mounted() {
    this.progressWidth();
  },
  methods: {
    progressWidth() {
      let _this = this;
      let count = 0;
      let timer = setInterval(function(e) {
        count++;
        // _this.$refs.progress.style.width = count + "%";
        // _this.$refs.progress.msg = count + "%";
        _this.widthVal = count + "%";
        if (count === 100) {
          clearInterval(timer);
          _this.$emit("progress", { widthVal: 100 });
        }
      }, 50);
    }
  }
};
</script>

<style lang="scss">
.lw_progress {
  position: absolute;
  z-index: 2000;
  background-color: rgba(0, 0, 0, 0.7);
  margin: 0;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transition: opacity 0.3s;
  .info{
    color: #fff;
    position:absolute;
    top:20%;
    left:25%;
  }
  .progress {
    margin: 15% auto;
    width: 50%;
    border-radius: 5px;
    height: 20px;
    overflow: hidden;
    background-color: #ebebeb;
  }
  .progress-bar {
    float: left;
    width: 0;
    height: 100%;
    color: #fff;
    text-align: center;
    background-color: #b667bd;
  }
  .progress-bar-striped {
    width: 100px;
    height: 100px;
    border: 1px solid #ccc;
    background-image: linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.2) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0.2) 75%,
      transparent 75%,
      transparent
    );
    background-size: 40px 40px;
  }
}
</style>

