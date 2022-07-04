<template>
  <el-row>
    <el-col :span="5">
      <div class="grid-content bg-purple" >
        <BurnDownChart title="SS燃尽图" url="type=BDCount&phase=SS&stday=2022-04-01&endday=2022-10-31" width="400px" height="300px"></BurnDownChart>
      </div>
    </el-col>
    <el-col :span="5">
      <div class="grid-content bg-purple" >
        <BurnDownChart title="PG燃尽图" url="type=BDCount&phase=PG&stday=2022-05-01&endday=2022-11-30" width="400px" height="300px"></BurnDownChart>
      </div>
    </el-col>
    <el-col :span="4">
      <div class="grid-content bg-purple" >
        <YiPiaoPanChart title="全体進捗率" url="type=BDTime&phase=ALL&stday=2022-04-01&endday=2022-11-30" width="800px" height="300px"></YiPiaoPanChart>
      </div>
    </el-col>
    <el-col :span="5">
      <div class="grid-content bg-purple" >
        <BurnDownChart title="PT仕燃尽图" url="type=BDCount&phase=PTDOC&stday=2022-06-01&endday=2022-11-30" width="400px" height="300px"></BurnDownChart>
      </div>
    </el-col>
    <el-col :span="5">
      <div class="grid-content bg-purple" >
        <BurnDownChart title="PT燃尽图" url="type=BDCount&phase=PT&stday=2022-07-01&endday=2022-11-30" width="400px" height="300px"></BurnDownChart>
      </div>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="6">
      <div class="grid-content bg-purple" >
        <a href="http://10.167.23.14/hpe-web-1.0.0/" target="view_window">動産環境</a>
        <YiPiaoPanChart title="Lot1進捗率" url="type=BDTime&phase=ALL&lot=1&stday=2022-04-01&endday=2022-11-30" width="400px" height="180px"></YiPiaoPanChart>
        <YiPiaoPanChart title="Lot2進捗率" url="type=BDTime&phase=ALL&lot=2&stday=2022-04-01&endday=2022-11-30" width="400px" height="180px"></YiPiaoPanChart>
      </div>
    </el-col>
    <el-col :span="6">
      <div class="grid-content bg-purple" >
        <SpeedChange title="画面生産性推進" koutei="SS" width="500px" height="400px" type=0></SpeedChange>
      </div>
    </el-col>
    <el-col :span="6">
      <div class="grid-content bg-purple" >
        <SpeedChange title="バッチ生産性推進" koutei="SS" width="500px" height="400px" type=1></SpeedChange>
      </div>
    </el-col>
    <el-col :span="6">
      <div class="grid-content bg-purple" >
        <SpeedChange title="インタフェース生産性推進" koutei="SS" width="500px" height="400px" type=2></SpeedChange>
      </div>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="4">
      <div class="grid-content bg-purple" >
        <BurnDownChart title="SS燃尽图(Lot1)" url="type=BDCount&phase=SS&lot=1&stday=2022-04-01&endday=2022-10-31" width="200px" height="280px"></BurnDownChart>
      </div>
    </el-col>
    <el-col :span="4">
      <div class="grid-content bg-purple" >
        <BurnDownChart title="SS燃尽图(Lot2)" url="type=BDCount&phase=SS&lot=2&stday=2022-04-01&endday=2022-10-31" width="200px" height="280px"></BurnDownChart>
      </div>
    </el-col>
    <el-col :span="16">
      <div class="grid-content bg-purple">
        <h2>SS進捗詳細</h2>
        <TaskCountTable phase='SS' inputDate='' lot=''></TaskCountTable>
      </div>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="4">
      <div class="grid-content bg-purple" >
        <BurnDownChart title="PG燃尽图(Lot1)" url="type=BDCount&phase=PG&lot=1&stday=2022-05-01&endday=2022-10-31" width="200px" height="280px"></BurnDownChart>
      </div>
    </el-col>
    <el-col :span="4">
      <div class="grid-content bg-purple" >
        <BurnDownChart title="PG燃尽图(Lot2)" url="type=BDCount&phase=PG&lot=2&stday=2022-07-01&endday=2022-10-31" width="200px" height="280px"></BurnDownChart>
      </div>
    </el-col>
    <el-col :span="16">
      <div class="grid-content bg-purple">
        <h2>PG進捗詳細</h2>
        <TaskCountTable phase='PG' inputDate='' lot=''></TaskCountTable>
      </div>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="4">
      <div class="grid-content bg-purple" >
        <BurnDownChart title="PT仕燃尽图(Lot1)" url="type=BDCount&phase=PTDOC&lot=1&stday=2022-05-20&endday=2022-08-31" width="200px" height="280px"></BurnDownChart>
      </div>
    </el-col>
    <el-col :span="4">
      <div class="grid-content bg-purple" >
        <BurnDownChart title="PT仕燃尽图(Lot2)" url="type=BDCount&phase=PTDOC&lot=2&stday=2022-07-01&endday=2022-10-31" width="200px" height="280px"></BurnDownChart>
      </div>
    </el-col>
    <el-col :span="16">
      <div class="grid-content bg-purple">
        <h2>PT仕進捗詳細</h2>
        <TaskCountTable phase='PTDOC' inputDate='' lot=''></TaskCountTable>
      </div>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="4">
      <div class="grid-content bg-purple" >
        <BurnDownChart title="PT燃尽图(Lot1)" url="type=BDCount&phase=PT&lot=1&stday=2022-07-01&endday=2022-09-15" width="200px" height="280px"></BurnDownChart>
      </div>
    </el-col>
    <el-col :span="4">
      <div class="grid-content bg-purple" >
        <BurnDownChart title="PT燃尽图(Lot2)" url="type=BDCount&phase=PT&lot=2&stday=2022-08-01&endday=2022-12-10" width="200px" height="280px"></BurnDownChart>
      </div>
    </el-col>
    <el-col :span="16">
      <div class="grid-content bg-purple">
        <h2>PT進捗詳細</h2>
        <TaskCountTable phase='PT' inputDate='' lot=''></TaskCountTable>
      </div>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { registerAllModules } from 'handsontable/registry';
import { onMounted, ref } from 'vue';
import SpeedChange from './Common/Graph/SpeedChange.vue';
import BurnDownChart from './Common/Graph/BurnDownChart.vue';
import YiPiaoPanChart from './Common/Graph/YiPiaoPanChart.vue';
import TaskCountTable from './JinDu/TaskCountTable.vue'
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
