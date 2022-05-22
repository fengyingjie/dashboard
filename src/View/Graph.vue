<template>
<div>
    <CategoryXY title="Bar example" url="bar1" width="50%" height="200px"></CategoryXY>
    <CategoryXY title="Bar example" url="line1" width="50%" height="200px"></CategoryXY>
    <ValueXY title="Bar example" url="value1" width="500px" height="400px"></ValueXY>
 </div>
</template>
<script setup lang="ts">
import CategoryXY from './Common/Graph/CategoryXY.vue';
import ValueXY from './Common/Graph/ValueXY.vue';

</script>

<style scoped>
div {
    /*元素并排排列*/
    display: flex;
    flex-flow: row wrap; 
    padding: 0px;
}
</style>