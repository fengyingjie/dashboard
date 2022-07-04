<template>
  <el-row>
    <el-col :span="24">
      <el-date-picker :clearable="true" v-model="inputDate" type="date" placeholder="选择日期" value-formate="YYYY-mm-dd"/>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="24">
      <span>SS進捗詳細工数ベース</span>
      <div class="grid-content bg-purple" >
        <DelayHourTable phase='SS' :inputDate='targetDate'></DelayHourTable>
      </div>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="24">
      <span>PT仕進捗詳細工数ベース</span>
      <div class="grid-content bg-purple" >
        <DelayHourTable phase='PTDOC' :inputDate='targetDate'></DelayHourTable>
      </div>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="24">
      <span>PG進捗詳細工数ベース</span>
      <div class="grid-content bg-purple" >
        <DelayHourTable phase='PG' :inputDate='targetDate'></DelayHourTable>
     </div>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="24">
      <span>PT進捗詳細工数ベース</span>
      <div class="grid-content bg-purple" >
        <DelayHourTable phase='PT' :inputDate='targetDate'></DelayHourTable>
    </div>
    </el-col>
  </el-row>

</template>

<script lang="ts">
import { registerAllModules } from 'handsontable/registry';
import { onMounted, ref, reactive, getCurrentInstance } from 'vue';
import DelayHourTable from './DelayHourTable.vue'

export default{
    components: {
    DelayHourTable
  },
  data() {
    return {
      inputDate : new Date(Date.now()),
      lot : ''
    }
  },
  setup( props, context){
    // register Handsontable's modules
    registerAllModules();
  },
  
  mounted() {
    //挂载时通过axios初始化hottable的数据
  },
  
  computed: {
    targetDate() {
      //this.$refs.SSTableComp.updateTable(this.$data.inputDate);
      return this.inputDate.toDateString()+"";
    }
  }
}

</script>

<style src="handsontable/dist/handsontable.full.css">

</style>