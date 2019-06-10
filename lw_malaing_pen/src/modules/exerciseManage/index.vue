<template>
  <div class="exercise_manage">
    <div class="top-select">
      <a-select defaultValue="全部年级" style="width: 240px;height:30px;" @change="changeGrade">
        <!-- <a-select-option value="jack">Jack</a-select-option> -->
        <a-select-option
          v-for="(grade,index) of gradeList"
          :key="index+'-grade'"
          :value="grade.id"
        >{{grade.name}}</a-select-option>
      </a-select>

      <a-select defaultValue="全部课程" style="width: 240px;height:30px;" @change="changeSubject">
        <!-- <a-select-option value="jack">Jack</a-select-option> -->
        <a-select-option
          v-for="(subject,index) of subjectList"
          :key="index+'-subject'"
          :value="subject.id"
        >{{subject.name}}</a-select-option>
      </a-select>

      <a-select defaultValue="全部类型" style="width: 240px;height:30px;" @change="changeType">
        <!-- <a-select-option value="jack">Jack</a-select-option> -->
        <a-select-option
          v-for="(typeItem,index) of typeList"
          :key="index+'-type'"
          :value="typeItem.id"
        >{{typeItem.itemValue}}</a-select-option>
      </a-select>
      <!-- @keyup.enter="onSearch"  -->
      <a-input-search placeholder="关键字" style="width: 241px;height:31px;" @search="onSearch"/>
      <a-button type="primary" class="test-assembly" @click="groupExercise">组卷</a-button>
    </div>

    <div class="list-content">
      <ul class="test-list">
        <li class="test-list-item" v-for="(item,index) of exerciseList" :key="item.id">
          <a href="javascript:void(0)" @click="seeDetails">
            <img src="../../assets/images/test_icon.png" class="item-img" alt>
            <span class="item-text">{{item.name}}</span>
            <i class="icon iconfont icon-pc-del icon-delete" @click="deleteItem" alt></i>
          </a>
        </li>
      </ul>
      <!-- <span class="loading-text" v-bind:style="{'position':exerciseList.length>=36&&hasMore?'relative':'absolute'}">{{loadingText}}</span> -->
      <span
        @click="loadMore"
        class="loading-text"
        v-bind:style="{'display':exerciseList.length<36&&!hasMore?'none':'inline-block'}"
      >{{loadingText}}</span>
    </div>
  </div>
</template>

<script>
import AuthService from "../../_services/auth.service";
import UserService from "../../_ddd/user.service";
import ExerciseService from "../../_services/exercise.service";
export default {
  name: "ExerciseManageComponent",
  data() {
    return {
      teacherId: "",
      gardenId: "",
      selectGradeId: "",
      selectSubjectId: "",
      selectTypeId: "",
      gradeList: [],
      subjectList: [],
      typeList: [],
      exerciseList: [],
      loadingText:"",
      pageNo: 1,
      keywords: "",
      offset: 50,
      isLoading: false,
      hasMore: true
    };
  },
  mounted() {
    this.teacherId = UserService.getUserId();
    this.gardenId = UserService.getGardenId();
    // 查询年级列表
    this.queryGradeList();
    this.querySubjectList();
    this.queryTypeList();
    this.queryExerciseList();
  },
  computed: {
    /* loadingText: function() {
      if (this.exerciseList.length < 36) {
        return "";
      }
      if (this.hasMore) {
        return "点击加载更多";
      }
      if (!this.hasMore) {
        return "已加载全部";
      }
    } */
  },
  created() {
    // 设置模拟用户信息
    // this.mockUserInfo();
    // 添加滚动事件
    // window.addEventListener("scroll", this.handleScrollsss);
  },
  methods: {
    changeGrade(value) {
      this.selectGradeId = value;
      console.log(`changeGrade-->selected ${value}`);
    },
    changeSubject(value) {
      this.selectSubjectId = value;
      console.log(`changeSubject-->selected ${value}`);
    },
    changeType(value) {
      this.selectTypeId = value;
      console.log(`changeType-->selected ${value}`);
    },
    onSearch(key) {
      console.log(`搜索：${key}`);
      this.keywords = key;
      // 获取组卷列表
      this.queryExerciseList();
    },
    seeDetails() {
      console.log("查看详情");
    },
    deleteItem(e) {
      // e.preventDefault();
      e.stopPropagation();
      console.log("点击删除");
    },
    loadMore() {
      if (this.hasMore && !this.isLoading) {
        this.queryExerciseList();
      }
    },
    getScrollBottomHeight() {
      // 获取整个网页的高的
      let getPageHeight = document.querySelector("html").scrollHeight;
      // 获取滚动条卷去的高度
      let getScrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      // 获取可视区域高度
      let getWindowHeight =
        window.innerHeight || document.documentElement.clientHeight;
      // 滚动条到底部的距离
      return getPageHeight - getScrollTop - getWindowHeight;
    },
    handleScrollsss() {
      console.log("监听到滚动了...");
      if (this.getScrollBottomHeight() <= this.offset) {
        this.$emit("updatedata");
      }
    },
    mockUserInfo() {
      window.localStorage.setItem("userId", "352");
      window.localStorage.setItem("gardenId", "194");
      let token = this.local$.getItem("LWToken");
      if (!token) {
        this.local$.setItem("LWToken", "567e4ff9ffc78b78e96a0b0297d6b60f");
        window.localStorage.setItem(
          "LWToken",
          "567e4ff9ffc78b78e96a0b0297d6b60f"
        );
      }
      console.log("LWToken", this.local$.getItem("LWToken"));
    },
    // 查询所有年级
    queryGradeList() {
      // let gardenId =UserService.getGardenId();
      // let userId = UserService.getUserId();
      ExerciseService.getGradeList({
        gardenId: this.gardenId,
        teacherId: this.teacherId
      }).then(res => {
        console.log("获取年级接口返回：", res);
        if (res) {
          this.gradeList = res;
        }
      });
    },
    // 查询所有学科
    querySubjectList() {
      ExerciseService.getSubjectList({
        gardenId: this.gardenId,
        teacherId: this.teacherId,
        gradeId: this.selectGradeId
      }).then(res => {
        console.log("查询所有学科接口返回：", res);
        if (res) {
          this.subjectList = res;
        }
      });
    },
    // 查询所有类型
    queryTypeList() {
      ExerciseService.getAllType().then(res => {
        console.log("查询所有类型接口返回：", res);
        if (res) {
          this.typeList = res;
        }
      });
    },
    // 查询组卷列表
    queryExerciseList() {
      this.isLoading = true;
      ExerciseService.getExerciseList({
        gardenId: this.gardenId,
        teacherId:this.teacherId,
        gradeCode: this.selectGradeId,
        subjectCode: this.selectSubjectId,
        applicationTypeId: this.selectTypeId,
        pageNo: this.pageNo,
        keyWord: this.keywords
      }).then(
        res => {
          this.isLoading = false;
          console.log("查询组卷列表接口返回：", res);
          if (res) {
            if (this.pageNo == 1) {
              this.exerciseList = res;
            } else {
              this.exerciseList = this.exerciseList.concat(res);
            }
          }
          this.pageNo++;
          if (this.exerciseList.length < 36) {
            this.loadingText = "";
          } else {
            if (this.hasMore) {
              this.loadingText = "点击加载更多";
            }
            if (!this.hasMore) {
              this.loadingText = "已加载全部";
            }
          }
        },
        error => {
          this.isLoading = false;
        }
      );
    },

    groupExercise() {
      this.$router.push({
        path: "/exerciseManage/groupExercise"
        // query: { param1: "111111" }
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped  lang="scss" >
@import "../../assets/scss/index.scss";
.exercise_manage {
  // height: 100%;
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 22px 0 0 20px;
  .top-select {
    height: 76px;
    text-align: left;
    .test-assembly {
      float: right;
      width: 100px;
      height: 35px;
    }
  }
  .list-content {
    flex: 1;
    position: relative;
    // height: calc(100% - 94px);
    // height: 632px;
    padding-bottom: 19px;
    // margin-top: 24px;
    padding-top: 24px;
    .test-list {
      text-align: left;
      margin-bottom: 34px;
      .test-list-item {
        display: inline-block;
        margin: 0 17px 10px 0;
        a {
          text-align: center;
          display: inline-flex;
          position: relative;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          text-decoration: none;
          .icon-delete {
            width: 20px;
            height: 20px;
            position: absolute;
            top: 4px;
            right: 4px;
            color: #226cfb;
            display: none;
          }
          .item-img {
            margin: 20px 26px 10px 26px;
            width: 80px;
            height: 80px;
          }
          .item-text {
            width: 112px;
            font-family: MicrosoftYaHei;
            font-size: 14px;
            font-weight: normal;
            font-stretch: normal;
            letter-spacing: 0px;
            color: #333333;
            margin-bottom: 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
        }
        a:hover {
          background-image: linear-gradient(
            -90deg,
            rgba(46, 114, 244, 0.1),
            rgba(31, 107, 253, 0.1)
          );
          //,linear-gradient(rgba(52,56,63,0.1),rgba(52,56,63,0.1));
          background-blend-mode: normal, normal;
          border-radius: 6px;
        }
        a:hover .icon-delete {
          display: inline;
        }
      }
    }

    .loading-text {
      position: absolute;
      bottom: 19px;
      cursor: pointer;
      text-align: center;
      left: 0;
      right: 0;
      font-family: MicrosoftYaHei;
      font-size: 14px;
      font-weight: normal;
      font-stretch: normal;
      letter-spacing: 0px;
      color: #999999;
    }
  }
}
</style>
