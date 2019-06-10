<template>
  <div class="lw-page-detection">
    <lw-title title="整体监测">
      <div slot="left" class="lw-page-title-left">
        <span>下部展示的为您有权限查看的所有监测统计信息</span>
        <i class="icon iconfont prompt"></i>
      </div>
      <div slot="right" class="lw-page-title-right">
        <i class="icon iconfont zhexian" :class="{'active':off}" @click="off=true"></i>
        <i class="icon iconfont zhexiantu" :class="{'active':!off}" @click="off=false"></i>
      </div>
    </lw-title>

    <div class="detection-search">
      <a-select labelInValue placeholder="最近一学期" style="width: 181px">
        <a-select-option value="jack">Jack (100)</a-select-option>
        <a-select-option value="lucy">Lucy (101)</a-select-option>
      </a-select>
      <a-select labelInValue placeholder="所有智能检测类型" style="width: 181px">
        <a-select-option value="jack">Jack (100)</a-select-option>
        <a-select-option value="lucy">Lucy (101)</a-select-option>
      </a-select>
      <a-select labelInValue placeholder="单次简单汇总统计" style="width: 181px">
        <a-select-option value="jack">Jack (100)</a-select-option>
        <a-select-option value="lucy">Lucy (101)</a-select-option>
      </a-select>
      <a-select labelInValue placeholder="所有类型信息" style="width: 181px">
        <a-select-option value="jack">Jack (100)</a-select-option>
        <a-select-option value="lucy">Lucy (101)</a-select-option>
      </a-select>
      <div class="detection-search-right">
        <label>
          优秀
          <a-checkbox></a-checkbox>
        </label>
        <label>
          很好
          <a-checkbox></a-checkbox>
        </label>
        <label>
          好
          <a-checkbox></a-checkbox>
        </label>
        <label>
          不好
          <a-checkbox></a-checkbox>
        </label>
        <label>
          很差
          <a-checkbox></a-checkbox>
        </label>
        <label>
          恶劣
          <a-checkbox></a-checkbox>
        </label>
      </div>
    </div>

    <div class="charts-list">
      <lwh-pie border="1" title="各类异常总量占比分布" v-if="off" :width="600" :height="438"></lwh-pie>
      <lwh-spline border="1" title="优常/异常发生实时监测" v-if="off" :width="705" :height="438"></lwh-spline>

      <lwe-inside title="整体优常/异常状态的动态趋势" v-if="!off" :width="600" :height="438"></lwe-inside>
      <lwe-bubble title="某日优常/异常发生的总量及详细分布" v-if="!off" :width="705" :height="438"></lwe-bubble>
    </div>
  </div>
</template>

<script>
export default {
  name: "LwPageDetectionComponent",
  data() {
    return {
      off: true
    };
  }
};
</script>

<style lang="scss">
@import "../../../assets/scss/_ddd/variable.style.scss";
.lw-page-detection {
  width: computer(1326px);
  margin: 0 auto;
  .lw-title {
    .lw-page-title-left {
      font-size: computer(14px);
      color: #333;
      margin-left: computer(10px);
      display: flex;
      i {
        font-size: computer(20px);
        font-weight: bold;
        color: #226cfb;
        margin-left: computer(10px);
        cursor: pointer;
      }
    }
    .lw-page-title-right {
      i {
        font-size: computer(25px);
        cursor: pointer;
        &:first-child {
          margin-right: computer(20px);
        }
        &.active {
          color: $color_main;
        }
      }
    }
  }
  .detection-search {
    display: flex;
    align-items: center;
    height: computer(30px);
    line-height: computer(30px);
    .ant-select {
      margin-right: computer(19px);
    }
    .detection-search-right {
      flex: 1;
      text-align: right;
      > label {
        cursor: pointer;
        margin-left: computer(20px);
        &:first-child {
          .ant-checkbox-inner {
            background-color: #226cfb;
            border-color: #226cfb;
          }
        }
        &:nth-child(2) {
          .ant-checkbox-inner {
            background-color: #13b5b1;
            border-color: #13b5b1;
          }
        }
        &:nth-child(3) {
          .ant-checkbox-inner {
            background-color: #80c269;
            border-color: #80c269;
          }
        }
        &:nth-child(4) {
          .ant-checkbox-inner {
            background-color: #fedeaf;
            border-color: #fedeaf;
          }
        }
        &:nth-child(5) {
          .ant-checkbox-inner {
            background-color: #fec9af;
            border-color: #fec9af;
          }
        }
        &:last-child {
          .ant-checkbox-inner {
            background-color: #feafaf;
            border-color: #feafaf;
          }
        }
      }
    }
  }
  .charts-list {
    margin-top: computer(20px);
    display: flex;
    .lw-h-chart-splint,
    .lw-e-chart-bubble {
      margin-left: computer(21px);
    }
  }
}
</style>