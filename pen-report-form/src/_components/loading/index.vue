<template>
  <div class="loader">
    <div class="face">
      <div class="circle"></div>
    </div>
    <div class="face">
      <div class="circle"></div>
    </div>
    <div class="pan">
      <p>智能分析中...</p>
      <img src="http://www.jq22.com/demo/svg-loader-150106215814/svg-loaders/three-dots.svg" alt="加载中">
      <!-- <span style="font-size: 50px; color: #fff" ref="numberGrow" :data-time="time" class="number-grow" :data-value="value">0%</span> -->
    </div>
  </div>
</template>

<script>
export default {
  name: "loadingComponent",
  data() {
    return {
      time: {
        type: Number,
        default: 1
      },
      value: {
        type: Number,
        default: 100
      }
    };
  },
  mounted() {
    this.numberGrow(this.$refs.numberGrow);
  },
  methods: {
    numberGrow(ele) {
      var _this = this;
      var step = _this.time.default;
      var current = 0;
      var start = 0;
      let t = setInterval(function() {
        start += step;
        if (start > _this.value.default) {
          clearInterval(t);
          start = _this.value.default;
          t = null;
        }
        if (current == start) {
            // _this.$emit('loadingFinish', true)
          return;
        }
        current = start;
        ele.innerHTML = current + "%";
      }, 20);
    }
  }
};
</script>

<style>
.loader {
  width: 700px;
  height: 700px;
  font-size: 20px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loader .face {
  position: absolute;
  border-radius: 50%;
  border-style: solid;
  animation: animate 3s linear infinite;
}

.loader .face:nth-child(1) {
  width: 100%;
  height: 100%;
  color: #226cfb;
  border-color: currentColor transparent transparent currentColor;
  border-width: 0.2em 0.2em 0em 0em;
  --deg: -45deg;
  animation-direction: normal;
}

.loader .face:nth-child(2) {
  width: 70%;
  height: 70%;
  color: #febb5c;
  border-color: currentColor currentColor transparent transparent;
  border-width: 0.2em 0em 0em 0.2em;
  --deg: -135deg;
  animation-direction: reverse;
}

.loader .face .circle {
  position: absolute;
  width: 50%;
  height: 0.1em;
  top: 50%;
  left: 50%;
  background-color: transparent;
  transform: rotate(var(--deg));
  transform-origin: left;
}

.loader .face .circle::before {
  position: absolute;
  top: -0.5em;
  right: -0.5em;
  content: "";
  width: 1em;
  height: 1em;
  background-color: currentColor;
  border-radius: 50%;
  box-shadow: 0 0 2em, 0 0 4em, 0 0 6em, 0 0 8em, 0 0 10em,
    0 0 0 0.5em rgba(255, 255, 0, 0.1);
}

@keyframes animate {
  to {
    transform: rotate(1turn);
  }
}
.pan {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
}
.pan p {
  color: #fff;
  margin: 0;
  font-size: 18px;
}

</style>
