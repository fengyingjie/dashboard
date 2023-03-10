<template>
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
  <el-row>
    <el-col :span="8">
      <input type="file" @change="readOrderFile" ref="orderListFile"/>
      <input type="file" @change="readSAPFile" ref="SAPFile"/>
    </el-col>
    <el-col :span="8">
      <el-button @click="updateData">刷新一览</el-button>
    </el-col>
    <el-col :span="8">
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="24">
      <div class="grid-content bg-purple" >
        <HotTable :settings="hotSettings" ref="hotTableComponent">
        </HotTable>
      </div>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { HotTable,HotColumn } from '@handsontable/vue3';
import Handsontable from 'handsontable/base';
import { registerAllModules } from 'handsontable/registry';
import axios from 'axios';
import CategoryXY from '../Common/Graph/CategoryXY.vue';
import SpeedChange from '../Common/Graph/SpeedChange.vue';
import ValueXY from '../Common/Graph/ValueXY.vue';
import { onMounted, ref, reactive, getCurrentInstance } from 'vue';
import { OrderInfo,getOrderList,targetMonth } from '../../Model/OrderInfo';
import { SAPInfo,getSAPList,getWorkHour } from '../../Model/SAPInfo';
import { getPlanInfoList } from '../../Model/PlanInfo';
import {getSSItems, getPGItems, SS_items} from '../../Model/data';

// register Handsontable's modules
registerAllModules();

//hotTable数据定义
const hotData = [
  ['index','project','inviceEndDate','accountingEndDate','区分'],
  ['','','','','',],
  // ['index','project','inviceEndDate','accountingEndDate','区分','22/01','22/01','22/01','22/01','22/01','22/01','22/02','22/02','22/02','22/02','22/02','22/02','22/03','22/03','22/03','22/03','22/03','22/03'],
  // ['','','','','','社员工数','驻场外协','整包外协','差旅费','设备费','其他','社员工数','驻场外协','整包外协','差旅费','设备费','其他','社员工数','驻场外协','整包外协','差旅费','设备费','其他'],
  // ['1','Honda','20220630','20220731',170,15000,30000,12000,0,0,170,15000,30000,12000,0,0,170,15000,30000,12000,0,0],
  // ['','','','',170,15000,30000,12000,0,0,170,15000,30000,12000,0,0,170,15000,30000,12000,0,0],
  // ['','','','',170,15000,30000,12000,0,0,170,15000,30000,12000,0,0,170,15000,30000,12000,0,0],
  // ['','','','',170,15000,30000,12000,0,0,170,15000,30000,12000,0,0,170,15000,30000,12000,0,0],
];

const licenseKey = 'non-commercial-and-evaluation';

const hotSettings = {
  //截取hotData从第二个开始的数组
  //data: hotData.slice(1),
  data: hotData,
  licenseKey: licenseKey,
  //colHeaders: hotData[0],
  mergeCells: [
    { row: 0, col: 0, rowspan: 2, colspan: 1 },
    { row: 0, col: 1, rowspan: 2, colspan: 1 },
    { row: 0, col: 2, rowspan: 2, colspan: 1 },
    { row: 0, col: 3, rowspan: 2, colspan: 1 },
    { row: 0, col: 4, rowspan: 2, colspan: 1 },
  ],
  // colums:[
  //   { data: 0 },
  //   { data: 1 },
  //   { data: 2 },
  //   { data: 3 },
  //   { data: 4 },
  //   { data: 5 },
  //   { data: 6 },
  //   { data: 7 },
  // ],
}
//hotTable控件
const hotTableComponent = ref();
const orderListFile = ref();
const SAPFile = ref();
let OrderList : Array<OrderInfo>;

//挂载时通过axios初始化hottable的数据
onMounted(() => {

  getPlanInfoList();
  //updateData();
});

function updateData(){

  //清空hotData数据
  hotData.splice(2,hotData.length);
  hotSettings.mergeCells.splice(4,hotSettings.mergeCells.length);
  
  targetMonth.forEach((targetMonth,monthIndex)=>{

    //取得item的年月
    let yearMonth = targetMonth.getFullYear().toString()+'/'+(targetMonth.getMonth()+1).toString();

    hotData[0].push(
      yearMonth,'','','','',''
    );
    
    hotSettings.mergeCells.push({ row: 0, col: 5 + monthIndex * 6,  rowspan: 1, colspan: 6 });

    hotData[1].push(
      '社员工数','驻场外协','整包外协','差旅费','设备费','其他'
    );
  });
  
  //根据OrderList设定hotData数据
  OrderList.forEach((item,orderIndex)=>{

    //根据OrderList追加hotData基础数据
    hotData.push([
      item.id,
      item.name,
      item.inviceEndDate.toLocaleDateString(),
      item.accountingEndDate.toLocaleDateString(),
      '预算',
    ]);
    hotData.push([
      item.id,
      item.name,
      item.inviceEndDate.toLocaleDateString(),
      item.accountingEndDate.toLocaleDateString(),
      '实计',
    ]);
    hotData.push([
      item.id,
      item.name,
      item.inviceEndDate.toLocaleDateString(),
      item.accountingEndDate.toLocaleDateString(),
      'SAP',
    ]);
    hotData.push([
      item.id,
      item.name,
      item.inviceEndDate.toLocaleDateString(),
      item.accountingEndDate.toLocaleDateString(),
      '实际',
    ]);

    //设定HotTable的合并单元格信息
    hotSettings.mergeCells.push({ row: orderIndex*4+2, col: 0, rowspan: 4, colspan: 1 });
    hotSettings.mergeCells.push({ row: orderIndex*4+2, col: 1, rowspan: 4, colspan: 1 });
    hotSettings.mergeCells.push({ row: orderIndex*4+2, col: 2, rowspan: 4, colspan: 1 });
    hotSettings.mergeCells.push({ row: orderIndex*4+2, col: 3, rowspan: 4, colspan: 1 });

    targetMonth.forEach((targetMonth,monthIndex)=>{

      //设置预算行信息
      hotData[orderIndex*4+2+0].push(
        getWorkHour(item.id, targetMonth).toString(),
        '0','0','0','0','0'
      );

      //设置实计行信息
      hotData[orderIndex*4+2+1].push(
        getWorkHour(item.id, targetMonth).toString(),
        '0','0','0','0','0'
      );

      //设置SAP行信息
      hotData[orderIndex*4+2+2].push(
        getWorkHour(item.id, targetMonth).toString(),
        '0','0','0','0','0'
      );
    });

  });

  //更新hotTable
  hotTableComponent.value.hotInstance.updateSettings(hotSettings);

  targetMonth.splice(0,targetMonth.length);
  OrderList.splice(0,OrderList.length);

}
//添加hotTablefilename列的计算属性

//读取orderList文件数据
function readOrderFile(){
  const reader = new FileReader();
  reader.onload = (e: any) => {
    const data = e.target.result;
    OrderList = getOrderList(data);

    //更新hotTable数据
    //updateData();

  }
  reader.readAsBinaryString(orderListFile.value.files[0]);
}

//读取SAP文件数据
function readSAPFile(){
  const reader = new FileReader();
  reader.onload = (e: any) => {
    const data = e.target.result;
    const SAPList = getSAPList(data);

    //更新hotTable数据
    //updateData();
  }
  reader.readAsBinaryString(SAPFile.value.files[0]);
}

</script>

<style src="handsontable/dist/handsontable.full.css">

</style>