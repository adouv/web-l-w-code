<template>
  <div class="select-component">
    <div class="left-select">
      <!-- <el-select v-model="type" placeholder="系统">
        <el-option
          v-for="item in systems"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-select v-model="sort" placeholder="默认顺序">
        <el-option v-for="item in orders" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select> -->
    </div>
    <div class="right-select">
      <el-select v-model="demotion" placeholder="试题维度" @change="changeType">
        <el-option v-for="item in exams" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
export default {
  name: "allReportSelectComponent",
  data() {
    return {
      systems: [
        {
          value: "0",
          label: "系统"
        },
        {
          value: "1",
          label: "精通掌握比例"
        },
        {
          value: "2",
          label: "熟练掌握比例"
        },
        {
          value: "3",
          label: "基本理解比例"
        },
        {
          value: "4",
          label: "一知半解比列"
        },
        {
          value: "5",
          label: "完全不会比例"
        }
      ],
      value: "0",
      orders: [
        {
          value: "0",
          label: "默认顺序"
        },
        {
          value: "2",
          label: "升序排序"
        },
        {
          value: "1",
          label: "降序排序"
        }
      ],
      sort: "0",
      exams: [
        {
          value: "0",
          label: "试题维度"
        },
        {
          value: "1",
          label: "知识点维度"
        }
      ],
      demotion: '0',
    };
  },
  methods: {
    changeType(val) {
      this.$emit('changeType',val);
    }
  }
};
</script>

<style lang="scss" scoped>
.select-component {
  width: calc(100% - 80px);
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between; 
  .el-select {
    width: 200px;
    height: 40px;
   
  }
}
</style>
