<template>
  <div class="selected-person nodrag-area">
    <div class="input-search">
      <a-input-search placeholder="搜索" v-model="inputPerson" @search="searchPerson"></a-input-search>
    </div>
    <div
      v-if="copySelectedData.length==0&&selectedData.length>0"
      class="selected-person-content no-result"
      flex="main:center cross:center"
    >
      <div class="no-result-msg">没有找到对应的人</div>
    </div>
    <div
      v-if="selectedData.length==0"
      class="selected-person-content no-result"
      flex="main:center cross:center"
    >
      <div class="no-result-msg">请选择要添加的人</div>
    </div>

    <div v-if="copySelectedData.length>0" class="selected-person-content">
      <div v-if="!searchStatus" class="allTotal">共选择了{{selectedData.length}}人</div>
      <div :class="{'showTotal':!searchStatus}" class="treeData-content auto-scroll-6">
        <div :key="std.id" v-for="std in selectTreeData" class="region-group">
          <div v-if="gardenLength>1" :title="std.gardenName" class="title">{{std.gardenName}}</div>
          <div :key="sd.id" v-for="sd in std.list" class="region-content">
            <div class="nz-tooltip">
              <a-tooltip overlayClassName="lw-tooltip" :title="sd.departmentName" placement="top">
                <span class="span-tooltip">{{sd.name}}</span>
              </a-tooltip>
            </div>
            <i @click="deletePerson(sd)" class="deleteperson iconfont icon-pc-label-close"></i>
          </div>
          <!-- <div class="region-content">李四</div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapMutations, mapActions } from "vuex";

export default {
  name: "SelectedComponent",
  props: [],
  data() {
    return {
      inputPerson: "",
      searchStatus: false,
      gardenLength: 1,
      selectTreeData: [],
      selectedData: [],
      copySelectedData: []
    };
  },
  mounted() {
    this.inputPerson = "";
  },
  methods: {
    searchPerson(evt) {
      this.inputPerson = evt;
      this.upDataVaule();
      
    },
    deletePerson(item) {
      this.deleteOnListAsyn(item);
    },
    upDataVaule() {
      if (this.inputPerson === "" || this.inputPerson == null) {
        this.copySelectedData = this.selectedData;
        this.selectTreeData = this.createSelectData(true);
        this.createGardenTree();
      } else {
        this.searchStatus = true;
        this.copySelectedData = [];
        this.selectedData.map(item => {
          if (item.name.indexOf(this.inputPerson) > -1) {
            this.copySelectedData.push(item);
          }
        });
        this.selectTreeData = this.createSelectData(false);
        this.createGardenTree();
      }
    },
    // 创建学校类型下拉数据
    createSelectData(status) {
      let result = [];
      if (status) {
        this.selectedData.map(item => {
          if (
            result.findIndex(r => {
              return r.gardenId == item.gardenId;
            }) < 0
          ) {
            result.push({
              gardenId: item.gardenId,
              gardenName: item.gardenName
            });
          }
        });
      } else {
        this.copySelectedData.map(item => {
          if (
            result.findIndex(r => {
              return r.gardenId == item.gardenId;
            }) < 0
          ) {
            result.push({
              gardenId: item.gardenId,
              gardenName: item.gardenName
            });
          }
        });
      }
      return result;
    },
    // 创建可见园区树
    createGardenTree() {
      this.selectTreeData.map(item => {
        item.list = [];
        this.copySelectedData.map(gd => {
          if (gd.gardenId == item.gardenId) {
            item.list.push(gd);
          }
        });
      });
    },
    ...mapActions(["onListAsyn","deleteOnListAsyn"])
  },
  computed: {
    ...mapGetters(["onList"])
  },
  watch: {
    onList(message) {
      this.selectedData = message;
      this.upDataVaule();
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/scss/index.scss";

.selected-person {
  height: 100%;
  width: 100%;
  .input-search {
    padding: computer(10px);
  }
  .selected-person-content {
    height: calc(100% - #{computer(50px)});
    .no-result-msg {
      margin-top: computer(-47px);
      color: $color_font-light;
    }
  }
  .region-group {
    .title {
      padding: 0 computer(10px);
      background: #f8f8f8;
      color: $color_font-light;
      font-size: computer(12px);
      height: computer(20px);
      white-space: nowrap;
      text-overflow: ellipsis;
      -o-text-overflow: ellipsis;
      overflow: hidden;
      line-height: computer(20px);
      width: 100%;
    }
    .region-content {
      padding: 0 computer(10px) 0 computer(20px);
      color: $color_font-deep;
      font-size: computer(14px);
      cursor: default;
      overflow: hidden;
      .nz-tooltip {
        float: left;
        width: calc(100% - #{computer(20px)});
        white-space: nowrap;
        text-overflow: ellipsis;
        -o-text-overflow: ellipsis;
        overflow: hidden;
        height: computer(30px);
        line-height: computer(30px);
        /* .span-tooltip{
                    max-width: 100%;
                    overflow: hidden;
                    display: inline-block;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    -o-text-overflow: ellipsis;
                    overflow: hidden;
                    height: computer(30px);
                    line-height: computer(30px);
                }*/
      }
      &:hover {
        // color:$color_main;
      }
    }
  }
  .deleteperson {
    float: right;
    color: #cccccc;
    cursor: pointer;
    // margin-top: computer(3px);
    &:before {
      font-size: computer(16px);
    }
  }
  .allTotal {
    color: $color_font-light;
    font-size: computer(14px);
    height: computer(16px);
    padding: 0 computer(10px);
    margin-bottom: computer(10px);
  }
  .treeData-content {
    height: 100%;
  }
  .showTotal {
    height: calc(100% - #{computer(26px)});
  }
  .span-tooltip {
    cursor: default;
  }
  .lw-tooltip {
    background: red;
  }
  .input-group-search {
    width: 100% !important;
    padding: 0;
  }
}
</style>
