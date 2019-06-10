<template>
  <div class="organization nodrag-area">
    <div class="input-search">
      <a-input-search placeholder="搜索" v-model="inputPerson" @change="searchPerson"></a-input-search>
    </div>
    <div
      v-if="gardenId&&(personData.length>0||copyTreeData.length>0)"
      class="organization-content auto-scroll-6"
    >
      <div @click="checkPerson(p)" :key="p.id" v-for="p in personData" class="tree-person-card">
        <div class="person-message">
          <div class="person-message-name">{{p.name}}</div>
          <div :title="p.departmentName" class="person-message-msg">{{p.departmentName}}</div>
        </div>
        <a-checkbox v-model="p.checked" :checked="p.checked"></a-checkbox>
      </div>
      <a-tree
        checkable
        v-model="checkedKeys"
        @check="onCheck"
        :treeData="copyTreeData"
        :checkStrictly="checkStrictly"
      />
    </div>
    <div v-if="!gardenId" flex="main:center cross:center" class="no-result organization-content">
      <span class="no-result-msg">请选择园区</span>
    </div>
    <div
      v-if="gardenId&&personData.length==0&&copyTreeData.length==0"
      flex="main:center cross:center"
      class="no-result organization-content"
    >
      <span class="no-result-msg">没有找到相关结果</span>
    </div>
  </div>
</template>

<script>
import AccountService from "../../_service/account.service";
import { mapGetters, mapState, mapMutations, mapActions } from "vuex";
import OrganizationService from "../../_service/organization.service";
import SelectPersonService from "../../_service/selectPerson.service";
export default {
  name: "TreeComponent",
  props: ["treeData"],
  data() {
    return {
      inputPerson: "",
      gardenId: null,
      personData: [], //用于搜索
      checkedKeys: [], //已选人员
      checkStrictly: false,
      disablePersons: [],
      copyTreeData: [],
      test: "测试"
    };
  },
  mounted() {
    this.gardenId = AccountService.getGardenId();
    this.getDepartemntAccount();
    //console.log(this.selectPersonData);
  },
  methods: {
    /**
     * 搜索园区
     */
    searchPerson() {
      if (this.inputPerson == null || this.inputPerson.trim() == "") {
        this.personData = [];
        this.getDepartemntAccount();
      } else {
        this.getDepartmentAccountBySearch(this.gardenId, this.inputPerson);
      }
    },
    /**
     * 接口获取园区数据
     */
    getDepartemntAccount() {
      this.copyTreeData = [];
      OrganizationService.getDepartemntAccountList(this.gardenId).then(res => {
        this.copyTreeData = SelectPersonService.getTree(
          res,
          "d_parent",
          "id",
          "pId"
        );
        console.log(this.copyTreeData);
      });
    },
    getDepartmentAccountBySearch(id, searchKey) {
      OrganizationService.getDepartmentAccountBySearch({
        id: id,
        searchKey: searchKey
      }).then(data => {
        this.personData = [];
        data.accountList.map(item => {
          let isChecked = this.checkedKeys.includes(item.id);
          if (isChecked) {
            item.checked = true;
          } else {
            item.checked = false;
          }
          if (
            this.disablePersons.findIndex(dp => {
              return dp == item.id;
            }) < 0
          ) {
            this.personData.push(item);
          }
        });
        this.copyTreeData = [];
        data.departmentTreeList.map(itemTree => {
          let result = [];
          itemTree.map(itemData => {
            if (
              this.disablePersons.findIndex(dp => {
                return dp == itemData.id;
              }) < 0
            ) {
              result.push(itemData);
            }
          });
          let treeData = SelectPersonService.getTree(
            result,
            "d_parent",
            "id",
            "pId"
          );
          this.copyTreeData.push(treeData[0]);
        });
      });
    },
    /**
     * 选择人员
     */
    checkPerson(p) {
      p.checked = !p.checked;
      let isChecked = this.checkedKeys.includes(p.id);
      if (!isChecked) {
        this.checkedKeys.push(p.id);
      } else {
        this.checkedKeys.splice(this.checkedKeys.findIndex(i => i === p.id), 1);
      }
      this.$emit("checkedKeys", { key: this.checkedKeys, category: 1 });
    },
    onCheck(args, e) {
      this.checkedKeys = args;
      this.$emit("checkedKeys", { key: args, category: 0 });
    },
    ...mapActions(["onListAsyn"])
  },
  computed: {
    ...mapGetters(["onList"])
  },
  watch: {
    onList(message) {
      this.checkedKeys = [];
      message.forEach(element => {
        this.checkedKeys.push(element.id);
      });
      this.personData.forEach(element => {
        element.checked = this.checkedKeys.includes(element.id);
      });
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/scss/index.scss";

.organization {
  height: 100%;
  width: 100%;
  .input-search {
    padding: computer(10px);
  }
  .input-group-search {
    width: 100% !important;
    padding-left: 0 !important;
  }
  .organization-content {
    // padding:0 computer(10px);
    height: calc(100% - #{computer(50px)});
    overflow: auto;
  }
  .ant-tree-checkbox {
    float: right;
  }
  .ant-tree li span.ant-tree-checkbox{
    margin:4px 10px 0 2px;
  }
  .no-result {
    color: $color_font-light;
    .no-result-msg {
      margin-top: computer(-48px);
      color: $color_font-light;
    }
  }
  .tree-person-card {
    height: computer(30px);
    padding: computer(8px) computer(10px);
    // background:rgba(0, 160, 233, 0.1);
    display: inline-block;
    width: 100%;
    height: auto;
    cursor: pointer;
    &:hover {
      background: rgba(0, 160, 233, 0.1);
    }
    .person-message {
      width: calc(100% - #{computer(16px)});
      float: left;
      .person-message-name,
      .person-message-msg {
        font-size: computer(14px);
        // height: computer(14px);
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .person-message-name {
        color: $color_font-deep;
      }
      .person-message-msg {
        color: $color_font-light;
        font-size: computer(12px);
      }
    }
    .check-box-img {
      width: computer(20px);
      margin-left: computer(10px);
      float: left;
      line-height: computer(40px);
    }
  }
  .icon-checkbox_default:before {
    color: #cccccc;
    font-size: computer(16px);
  }
  .icon-checkbox_check:before {
    color: $color_main;
    font-size: computer(16px);
  }
}
</style>
