<script setup lang="ts">
import { ref } from 'vue'
import FileIdList from "./FileIdList.vue";

defineProps<{ msg: string }>()

const count = ref(0)

</script>

<template>
{{msg}}
<form class="fileInput">
  <label>file:</label><input type="text" name="fileName" value="" />
</form>
<FileIdList></FileIdList>
</template>

<style scoped>
.fileInput{
  text-align:left;
}
</style>
