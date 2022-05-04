<template>
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
import { onMounted, ref, reactive, getCurrentInstance } from 'vue';
import { months } from 'moment';
import { getOrderList } from '../../Model/OrderInfo';

// register Handsontable's modules
registerAllModules();

//hotTable数据定义
const hotData = [
  ['index','project','inviceEndDate','accountingEndDate','22/01','22/01','22/01','22/01','22/01','22/01','22/02','22/02','22/02','22/02','22/02','22/02','22/03','22/03','22/03','22/03','22/03','22/03'],
  ['','','','','社员工数','驻场外协','整包外协','差旅费','设备费','其他','社员工数','驻场外协','整包外协','差旅费','设备费','其他','社员工数','驻场外协','整包外协','差旅费','设备费','其他'],
  ['1','Honda','20220630','20220731',170,15000,30000,12000,0,0,170,15000,30000,12000,0,0,170,15000,30000,12000,0,0],
  ['','','','',170,15000,30000,12000,0,0,170,15000,30000,12000,0,0,170,15000,30000,12000,0,0],
  ['','','','',170,15000,30000,12000,0,0,170,15000,30000,12000,0,0,170,15000,30000,12000,0,0],
  ['','','','',170,15000,30000,12000,0,0,170,15000,30000,12000,0,0,170,15000,30000,12000,0,0],
];

//hotData第三列以后加一列作为区分
hotData.forEach((item,index)=>{
  if(index > 1){

    switch((index-2) % 4){
      case 0:
        item = item.slice(0,4).concat('预算').concat(item.slice(4));
        break;
      case 1:
        item = item.slice(0,4).concat('实施计划').concat(item.slice(4));
        break;
      case 2:
        item = item.slice(0,4).concat('sap').concat(item.slice(4));
        break;
      case 3:
        item = item.slice(0,4).concat('actual').concat(item.slice(4));
        break;
    }
  }  else {
    item = item.slice(0,4).concat('区分').concat(item.slice(4));
  }

  hotData.splice(index,1,item);
});

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

    { row: 0, col: 5,  rowspan: 1, colspan: 6 },
    { row: 0, col: 11, rowspan: 1, colspan: 6 },
    { row: 0, col: 17, rowspan: 1, colspan: 6 },

    { row: 2, col: 0, rowspan: 4, colspan: 1 },
    { row: 2, col: 1, rowspan: 4, colspan: 1 },
    { row: 2, col: 2, rowspan: 4, colspan: 1 },
    { row: 2, col: 3, rowspan: 4, colspan: 1 },
  ],
  colums:[
    { data: 0 },
    { data: 1 },
    { data: 2 },
    { data: 3 },
    { data: 4 },
    { data: 5 },
    { data: 6 },
    { data: 7 },
  ],
  cell:[
    { row: 0, col: 5, type: 'date', dateFormat: 'YYYY/MM/DD' },
    { row: 0, col: 6, type: 'date', dateFormat: 'YYYY/MM/DD' },
    { row: 0, col: 7, type: 'date', dateFormat: 'YYYY/MM/DD' },
  ]
}
//hotTable控件
const hotTableComponent = ref();

//挂载时通过axios初始化hottable的数据
onMounted(() => {

  getOrderList();
  updateData();
});

function updateData(){
  //hotTableComponent.value.hotInstance.updateData(hotData);
}
//添加hotTablefilename列的计算属性

</script>

<style src="handsontable/dist/handsontable.full.css">

</style>