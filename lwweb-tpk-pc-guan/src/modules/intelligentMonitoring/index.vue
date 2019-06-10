<template>
  <div class="lw-page-intelligent-monitoring">
    <lw-title title="融合分析"></lw-title>

    <div class="detection-search">
      <a-select labelInValue placeholder="今日" style="width: 181px">
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
      <lwh-venn border="1" :width="600" :height="600"></lwh-venn>
      <div class="charts-list-right">
        <lwh-pareto title="监测信息处理反馈情况" :width="705" :height="300"></lwh-pareto>
        <lwh-treemap title="各类在岗情况前三榜单和分布关系" :width="705" :height="300"></lwh-treemap>
      </div>
    </div>

    <div class="base-delection-unit-check-list">
      <span>基本检测单元：</span>
      <label>
        早到
        <a-checkbox></a-checkbox>
      </label>
      <label>
        未早到
        <a-checkbox></a-checkbox>
      </label>
      <label>
        迟到
        <a-checkbox></a-checkbox>
      </label>
      <label>
        缺课
        <a-checkbox></a-checkbox>
      </label>
      <label>
        早退
        <a-checkbox></a-checkbox>
      </label>
      <label>
        换课
        <a-checkbox></a-checkbox>
      </label>
      <label>
        代课
        <a-checkbox></a-checkbox>
      </label>
      <label>
        不讲课
        <a-checkbox></a-checkbox>
      </label>
      <label>
        不在校
        <a-checkbox></a-checkbox>
      </label>
      <label>
        在校
        <a-checkbox></a-checkbox>
      </label>
    </div>

    <lw-title title="策略配置" class="title-two">
      <div slot="left" class="lw-page-title-left">
        <label>
          早来晚走
          <a-checkbox></a-checkbox>
        </label>
        <label>
          晚来早走
          <a-checkbox></a-checkbox>
        </label>
        <label>
          晚来且不讲课
          <a-checkbox></a-checkbox>
        </label>
        <label>
          在校缺课
          <a-checkbox></a-checkbox>
        </label>
        <label>
          在校代课
          <a-checkbox></a-checkbox>
        </label>
        <label>
          不在校缺课
          <a-checkbox></a-checkbox>
        </label>
        <label>
          不在校代课
          <a-checkbox></a-checkbox>
        </label>
      </div>
      <div slot="right" class="lw-page-title-right">
        <span>查看权限配置</span>
        <i class="icon iconfont shezhi"></i>
      </div>
    </lw-title>

    <a-tabs
      defaultActiveKey="1"
      v-model="tabIndex"
      size="large"
      :tabBarStyle="{'textAlign':'center'}"
    >
      <a-tab-pane tab="基本监测单元配置" key="1"></a-tab-pane>
      <a-tab-pane tab="复合监测单元配置" key="2" forceRender></a-tab-pane>
    </a-tabs>
    <lwp-basic v-if="tabIndex==='1'"></lwp-basic>
    <lwp-composite v-if="tabIndex==='2'"></lwp-composite>
  </div>
</template>

<script>
import LwPageIntelligentBasicMonitoring from "./basicMonitoring";
import LwPageIntelligentCompositeMonitoring from "./compositeMonitoring";
export default {
  name: "LwPageIntelligentMonitoringComponent",
  components: {
    "lwp-basic": LwPageIntelligentBasicMonitoring,
    "lwp-composite": LwPageIntelligentCompositeMonitoring
  },
  data() {
    return {
      tabIndex: "1"
    };
  },
  methods: {
    tabHabdler(event) {
      console.log(event);
      this.tabIndex = parseInt(event);
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/scss/_ddd/variable.style.scss";
.lw-page-intelligent-monitoring {
  width: computer(1326px);
  margin: 0 auto;
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
    .charts-list-right {
      width: 705px;
      height: 600px;
      outline: 1px solid #ddd;
      margin-left: computer(21px);
    }
  }
  .base-delection-unit-check-list {
    margin-top: computer(20px);
    label {
      margin-right: computer(20px);
      cursor: pointer;
    }
  }
  .title-two {
    margin-top: computer(40px);
    .lw-title-left {
      margin-left: computer(331px);
    }
    .lw-page-title-right {
      position: relative;
      font-size: computer(16px);
      color: #226cfb;
      cursor: pointer;
      span {
        margin-right: computer(34px);
      }
      i {
        font-size: computer(24px);
        position: absolute;
        right: 0px;
      }
    }
  }
  .ant-tabs{
    .ant-tabs-nav-wrap{
      height: computer(50px);
    }
  }
}
</style>
