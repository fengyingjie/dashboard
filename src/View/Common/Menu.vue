<template>
  <el-menu
    default-active="2"
    class="el-menu-vertical-demo"
    :collapse="isCollapse"
    @open="handleOpen"
    @close="handleClose"
    @select="handleSelect"
  >
    <el-menu-item index="graph">
      <el-icon><Picture /></el-icon>
      <template #title>Dashboard</template>
    </el-menu-item>
    <el-menu-item index="setting">
      <el-icon><setting /></el-icon>
      <template #title>setting</template>
    </el-menu-item>
  </el-menu>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import {
  Menu,
  Picture,
  Setting,
} from '@element-plus/icons-vue'
import {router} from "../../routes";

const isCollapse = ref(true);
isCollapse.value = true;
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

const handleSelect = (index: string ) => {

  router.push(index);
}
</script>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 100%;
  min-height: 400px;
}
</style>