<template>
    <h3>プロジェクト一覧</h3>
    <HotTable :licenseKey="hotSetting.licenseKey" ref="wbsTable"></HotTable>
    <div style="width: 500px; height: 300px;"><v-chart class="chart" :option="option" autoresize /></div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive, provide } from 'vue';
import Handsontable from 'handsontable/base';
import { HotTable,HotColumn } from '@handsontable/vue3';
import { registerAllModules } from 'handsontable/registry';
import axios from 'axios';
import { assertPipelinePrimaryTopicReference } from '@babel/types';

import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from 'echarts/components';
import VChart, { THEME_KEY } from 'vue-echarts';

// import * from 'echarts';
import { GridComponent } from 'echarts/components';

import { BarChart } from 'echarts/charts';

import { LineChart } from 'echarts/charts';


// register Handsontable's modules
registerAllModules();

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  BarChart,
  LineChart,
]);

// provide(THEME_KEY, 'dark');
const option = reactive({
  title: {
    text: 'Traffic Sources',
    left: 'center',
  },
  tooltip: {
    trigger: 'item',
    formatter: '{b} <br/> : {c} ({d}%)',
  },
  // legend: {
  //   orient: 'vertical',
  //   left: 'left',
  //   data: ['Direct', 'Email', 'Ad Networks', 'Video Ads', 'Search Engines'],
  // },
  dataset: [
    {
      dimensions: ['name', 'workHour', 'otherHour'],
      source: []
    }
  ],
  xAxis: {
    type: 'category',
    axisLabel: { interval: 0, rotate: 50 }
  },
  yAxis: {},
  series: [{
    name: '直接工数',
    type: 'bar',
    label: {show: true},
    stack: 'total',
    encode: { x: 'name', y: 'workHour' }
  },{
    name: '间接工数',
    type: 'bar',
    label: {show: true},
    stack: 'total',
    encode: { x: 'name', y: 'otherHour' }
  },{
    type: 'line',
    data:[]
  }]
});

const wbsTable = ref();
let message = ref();
let monthSelector = reactive({
  selectedMonth: 1,
  months: [
    {key:1,value:'1月'},
    {key:2,value:'2月'},
    {key:3,value:'3月'},
    {key:4,value:'4月'},
    {key:5,value:'5月'},
    {key:6,value:'6月'},
    {key:7,value:'7月'},
    {key:8,value:'8月'},
    {key:9,value:'9月'},
    {key:10,value:'10月'},
    {key:11,value:'11月'},
    {key:12,value:'12月'}]
});
let hotSetting = {
  licenseKey : 'non-commercial-and-evaluation',
  //colWidths: [80,100,50,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40],
  height: 'auto',
  comments: true,
  manualColumnResize: true,
  columnSorting: {
    sortEmptyCells: true,
    initialConfig: {
      column: 1,
      sortOrder: 'asc'
    }
  },
  nestedHeaders : [
    //1月-12月
    ['WBS','name','计划工数原价率','计划全体原价率','计划工数','实际工数','计划外驻','实际外驻','计划旅费','实际旅费','预计其他费用','实际其他费用']
  ],
  //列データ定義
  columns: [
    {data:'wbs',readOnly: true},
    {data:'name',readOnly: true},
    {data:'planWorkHourORP',type:'numeric',numericFormat: {pattern: '0.0%'},readOnly: true},
    {data:'planORP',type: 'numeric',numericFormat: {pattern: '0.0%'},readOnly: true},
    {data:'PlanWorkTime',type:'numeric',numericFormat: {pattern: '0.0'}},
    {data:'RealWorkTime',type:'numeric',numericFormat: {pattern: '0.0'}},
    {data:'PlanOutAmount',type:'numeric',numericFormat: {pattern: '0.0'}},
    {data:'RealOutAmount',type:'numeric',numericFormat: {pattern: '0.0'}},
    {data:'PlanTravleAmount',type:'numeric',numericFormat: {pattern: '0.0'}},
    {data:'RealTravleAmount',type:'numeric',numericFormat: {pattern: '0.0'}},
    {data:'PlanOtherAmount',type:'numeric',numericFormat: {pattern: '0.0'}},
    {data:'RealOtherAmount',type:'numeric',numericFormat: {pattern: '0.0'}},
  ],
}

onMounted(()=>{
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    //初始化axios共通設定
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    axios.defaults.baseURL = 'getDataAPI';
    axios.get("/api/wbsprofit").then(res => {

      // let mergeCells = [];
      wbsTable.value.hotInstance.updateSettings(hotSetting);
      wbsTable.value.hotInstance.updateData(res.data);
      // for(let i=0; i<res.data.length; i=i+2){
      //   mergeCells.push({ row: i, col: 0, rowspan: 2, colspan: 1 });
      // }
      // wbsTable.value.hotInstance.updateSettings({'mergeCells': mergeCells});
    });

    axios.get("/api/personWorkTime").then(res => {

      // //定义一个数组形数组变量
      // res.data.forEach((data)=>{
      //   //追加元素
      //   option.series[2].data.push({
      //     'name':data.name,
      //     value:170
      //   });
      // }); 
      option.dataset[0].source = res.data;
    });
    
});

//取得SAP数据按钮处理函数
async function getSAPData(){
    message.value = "Reading SAP Data, Please wait...";
    axios.get("/api/getSAPData?month="+monthSelector.selectedMonth).then(res => {
      message.value = res.data;
    }); 
}

//取得预算数据按钮处理函数
async function getYousanData(){
    message.value = "Reading 预算数据, Please wait...";
    axios.get("/api/getYousanData").then(res => {
      message.value = res.data;
    }); 
}

//最新话损益数据按钮处理函数
async function calcWorkProfit(){
  message.value = "计算损益数据, Please wait...";
  await axios.get("/api/calcWorkProfit").then(res => {
    message.value = res.data;
  });
  await axios.get("/api/wbsprofit").then(res => {
 
    wbsTable.value.hotInstance.updateData(res.data);
    // let mergeCells = [];
    // for(let i=0; i<res.data.length; i=i+2){
    //     mergeCells.push({ row: i, col: 0, rowspan: 2, colspan: 1 });
    //   }
    // wbsTable.value.hotInstance.updateSettings({'mergeCells': mergeCells});
    message.value = "数据最表示最新化完成";
  }); 
}

//外驻金额数据最新话按钮处理函数
async function getOutResource() {
  message.value = "Reading 外驻金额数据, Please wait...";
  axios.get("/api/getOutResourceData").then(res => {
    message.value = res.data;
  });
}

//计划数据取得按钮处理函数
async function getPlanData() {
  message.value = "Reading 计划数据, Please wait...";
  axios.get("/api/getPlanData").then(res => {
    message.value = res.data;
  });
}

//取得人员数据按钮处理函数
async function getHRData() {
  message.value = "Reading 人员数据, Please wait...";
  axios.get("/api/getHRData").then(res => {
    message.value = res.data;
  });
}
</script>
<style src="handsontable/dist/handsontable.full.css">
.chart {
  height: 300px;
  width: 300px;
}
</style>