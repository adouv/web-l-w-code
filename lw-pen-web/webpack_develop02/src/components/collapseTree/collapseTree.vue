<template>
  <div class="collapse" v-if="data && data.length > 0">
    <a-collapse class="a-collapse ell-box">
      <a-collapse-panel
        @click.native.stop="onNodeSelect(panel)"
        :header="panel.name"
        :key="panel.id"
        v-for="panel in data"
        :class="`level-${panel.level}`"
        :showArrow="panel.isShow"
      >
        <lw-collapse-tree :data="panel.children"  @selectNodes="getSelectNodes"></lw-collapse-tree>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script>
export default {
  name: "CollapseTreeComponent",
  props: ["data"],
  data() {
    return {
      selectNodes: []
    };
  },
  mounted() {
  },
  methods: {
    getSelectNodes(item){
      this.$emit('selectNodes',{id:item.id,name:item.name});
    },
    onNodeSelect(item) {
      
      this.$emit('selectNodes',{id:item.id,name:item.name});
    },
    action(item) {
      
      // let data = this.data.find((v, i, arr) => {
      //   return v.id === item;
      // });

      // return data;
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/scss/variable.scss";
@import "../../assets/scss/mixin.scss";

@mixin collapse-level($len) {
  @for $i from 1 through $len {
    &.level-#{$i} {
      & > .ant-collapse-header {
        padding-left: computer($i * 20px + 20px);
        padding-right: computer(15px);
        width: 100%;
        @include line-ell(100%);
        & > i {
          left: computer($i * 20px - 5px);
        }
      }
    }
  }
}
.a-collapse {
  border: none;
  border: 1px solid #eee;
}
.collapse {
  div.ant-collapse {
    background-color: #fff;
    border: none;
  }
  .collapse .collapse div.ant-collapse > .ant-collapse-item {
    border: none !important;
  }
  .ant-collapse > .ant-collapse-item > .ant-collapse-header {
    padding: computer(10px) 0 computer(10px) computer(40px);
    line-height: computer(20px);
  }
  .ant-collapse > .ant-collapse-item {
    border: 1px solid #eee;
    margin-bottom: computer(20px);
  }
  .ant-collapse > .ant-collapse-item > .ant-collapse-header {
    background-color: #f8f8f8;
  }
  div.ant-collapse-content {
    padding: 0;
    & > div.ant-collapse-content-box {
      padding: 0;
    }
    .ant-collapse-item > .ant-collapse-header {
      color: $color_font-deep;
    }
    .ant-collapse-item > .ant-collapse-header .radio-node-box {
      color: $color_main;
    }

    .ant-collapse-header {
      .arrow {
        font-weight: bold;
      }
      &[aria-expanded="true"] {
        border: 0;
        .arrow {
          color: #00a0e9 !important;
        }
      }
    }
  }
  .ant-collapse {
    & > .ant-collapse-item {
      //border: 1px solid #eee;
      margin-bottom: computer(20px);
      @include collapse-level(10);
      & > .ant-collapse-header {
        background-color: #f8f8f8;
        .ng-star-inserted {
          font-size: computer(14px);
        }
      }
      & > .ant-collapse-content {
        border: none;
      }
    }
  }
  .ant-collapse-content-box {
    .ant-collapse {
      & > .ant-collapse-item {
        border: 0;
        margin-bottom: 0;
        & > .ant-collapse-header {
          background-color: #fff;
          &:hover {
            background-color: #f7f7f7;
          }
        }
      }
    }
  }

  .last-collapse {
    & > .ant-collapse-header {
      & > i.arrow {
        display: none !important;
      }
    }
  }

  label[hidden] {
    display: none;
  }
  .hide-box {
    width: 100%;
    .ant-checkbox {
      display: none;
    }
  }
}

.in-box {
  display: inline-block;
}

.radio-node-box {
  color: $color_main !important;
}

.ell-box {
  width: 100%;
  padding-right: computer(15px);
  @include line-ell(100%);
}
</style>
