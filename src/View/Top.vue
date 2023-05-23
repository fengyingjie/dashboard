<script setup lang="ts">
import { ref } from 'vue'
import Menu from './Common/Menu.vue';

defineProps<{ msg: string }>()
const count = ref(0)

</script>

<template>

  <div class="common-layout">
    <el-header><div><h1>第一産業部門状況「{{new Date().toDateString()}}現在」</h1></div></el-header>  
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
