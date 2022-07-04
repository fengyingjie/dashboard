<script setup lang="ts">
import { ref } from 'vue'

import Menu from './Common/Menu.vue';

defineProps<{ msg: string }>()

const count = ref(0)

</script>

<template>

  <!--使用 router-link 组件进行导航 -->
  <!--通过传递 `to` 来指定链接 -->
  <!--`<router-link>` 将呈现一个带有正确 `href` 属性的 `<a>` 标签
    <router-link to="/">Go to Home</router-link>
    <router-link to="/filelist">Go to About</router-link>
    <router-link to="/setting">Go to Setting</router-link>
  -->
  <!-- 路由出口 -->
  <!-- 路由匹配到的组件将渲染在这里 -->

  <div class="common-layout">
    <el-header><div><h1>Hope推進状況「{{new Date().toDateString()}}現在」</h1></div></el-header>  
      <el-container>
        <el-aside width="70px"><Menu></Menu></el-aside>
        <el-main><router-view></router-view></el-main>
      </el-container>
  </div>
</template>

<style scoped>
.fileInput{
  text-align:left;
}
</style>
