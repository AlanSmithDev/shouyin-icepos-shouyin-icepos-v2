<script>
import {provide,reactive} from 'vue';

export default {
  components:{
    
  },
  setup() {

    const globalData=reactive({
          config:{},//系统配置
          windowHeight: 0
      });
    
    //设置全局变量，vue页面通过inject可调用
    provide("globalData",globalData);
    
    return{
      barIndex:'bar-default',
    }
  },
  mounted(){

    
  },
  methods:{
    
  }
}
</script>

<template>
  <div>
    <router-view />
  </div>
</template>

<style lang="less">
@import './assets/css/styles.less';
@import "@/assets/css/main.css";
</style>