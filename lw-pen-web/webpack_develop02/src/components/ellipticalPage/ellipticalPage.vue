<template>
  <div class="elliptical-page" flex="main:center cross:center">
    <div>
      <img v-if="imgName" :src="path"/>
      <div>{{title}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EllipticalPageComponent',
  props:['title','imgName'],
  data(){
    return {
      path: ''
    }
  },
  mounted(){
    if(this.imgName == 'no-classHour'){
      this.path = require('../../assets/images/no-classHour.png');
    }else if(this.imgName == 'no-exercises'){
      this.path = require('../../assets/images/no-exercises.png');
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "../../assets/scss/variable.scss";
.elliptical-page{
	margin-top: computer(100px);
	img{
		width: computer(240px);
	}
	div{
		color:$color_font-light;
		margin-top: computer(15px);
		text-align: center;
		font-size: computer(15px);
	}
}
</style>
