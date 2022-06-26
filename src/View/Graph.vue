<template>
  <el-row>
    <el-col :span="12">
      <div class="grid-content bg-purple" >
        <BurnDownChart title="BurnDownChart" url="BurnDown1" width="400px" height="400px"></BurnDownChart>
      </div>
    </el-col>
    <el-col :span="12">
      <div class="grid-content bg-purple" >
        <BurnDownChart title="BurnDownChart" url="BurnDown1" width="400px" height="400px"></BurnDownChart>
      </div>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="24">
     <br><br><br>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="8">
      <div class="grid-content bg-purple" >
        <SpeedChange title="画面生産性推進" koutei="SS" width="400px" height="400px" type=0></SpeedChange>
      </div>
    </el-col>
    <el-col :span="8">
      <div class="grid-content bg-purple" >
        <SpeedChange title="バッチ生産性推進" koutei="SS" width="400px" height="400px" type=1></SpeedChange>
      </div>
    </el-col>
    <el-col :span="8">
      <div class="grid-content bg-purple" >
        <SpeedChange title="インタフェース生産性推進" koutei="SS" width="400px" height="400px" type=2></SpeedChange>
      </div>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="24">
      <div class="grid-content bg-purple" >
        <div>
            <CategoryXY title="生産性目標と実績" url="line1" width="400px" height="400px"></CategoryXY>
            <ValueXY title="Bar example" url="value1" width="500px" height="400px"></ValueXY>
            <CategoryXY title="Bar example" url="bar1" width="100%" height="200px"></CategoryXY>
        </div>
      </div>
    </el-col>
  </el-row>

</template>

<script setup lang="ts">
import { registerAllModules } from 'handsontable/registry';
import { onMounted, ref } from 'vue';
import CategoryXY from './Common/Graph/CategoryXY.vue';
import SpeedChange from './Common/Graph/SpeedChange.vue';
import ValueXY from './Common/Graph/ValueXY.vue';
import BurnDownChart from './Common/Graph/BurnDownChart.vue';
import {getSSItems, getPGItems, SS_items} from '../Model/data';

let message = '';

onMounted(() => {

  getSSItems();
  getPGItems();

    SS_items.forEach(item => {

      let speed = {
        id:'',
        name:'',
        steps:0,
        time1:0,
        speed:''
      };
      
      //開発規模(J1完時Step)
      speed.id = item.custom_fields[9].value;
      speed.steps = item.custom_fields[16].value;
      //J0機能名
      speed.name = item.custom_fields[13].value;

      //J1理解時間(予定)
      speed.time1 = speed.time1 + item.custom_fields[23].value;

      //作業時間(予定)
      speed.time1 = speed.time1 + item.custom_fields[26].value;

      //内部ﾚﾋﾞｭｰ時間(予定)
      speed.time1 = speed.time1 + item.custom_fields[29].value;

      speed.speed = (speed.steps/1000) / (speed.time1/170) + 'KS/人月';

      message = message + speed.id + '_' + speed.name + ':' + speed.speed + '\r\n';
    });

    //console.log(message);
});

</script>

<style scoped>
div {
    /*元素并排排列*/
    display: flex;
    flex-flow: row wrap; 
    padding: 0px;
}
</style>
