<template>
    <h3>プロジェクト一覧</h3>
    <!--对象月下拉框-->
    <label>对象月:</label>
    <select v-model="monthSelector.selectedMonth">
      <option v-for="month in monthSelector.months" :value="month.key">{{ month.value }}</option>
    </select>
    <button @click="getSAPData()">取得SAP数据</button>
    <button @click="getYousanData()">取得预算数据</button>
    <button @click="getOutResource()">取得外驻数据</button>
    <button @click="getPlanData()">取得计划数据</button>
    <button @click="calcWorkProfit()">最新化损益数据</button>
    <!--消息-->
    <div class="message">
      <span v-if=message>{{ message }}</span>
    </div>
    <HotTable :licenseKey="hotSetting.licenseKey" ref="wbsTable"></HotTable>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue';
import Handsontable from 'handsontable/base';
import { HotTable,HotColumn } from '@handsontable/vue3';
import { registerAllModules } from 'handsontable/registry';
import axios from 'axios';
import { assertPipelinePrimaryTopicReference } from '@babel/types';

// register Handsontable's modules
registerAllModules();

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
    ['WBS','type','kind','去年まで','1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月','来年以降']
  ],
  //列データ定義
  columns: [
    {data:'wbs',readOnly: true},
    {data:'type',readOnly: true},
    {data:'kind',readOnly: true},
    {data:'dataLastYear',type: 'numeric',numericFormat: {pattern: '0.0'},readOnly: true},
    //1月の工数を数字と0.0で表示するように定義
    {data:'data1',type:'numeric',numericFormat: {pattern: '0.0'}},
    {data:'data2',type:'numeric',numericFormat: {pattern: '0.0'}},
    {data:'data3',type:'numeric',numericFormat: {pattern: '0.0'}},
    {data:'data4',type:'numeric',numericFormat: {pattern: '0.0'}},
    {data:'data5',type:'numeric',numericFormat: {pattern: '0.0'}},
    {data:'data6',type:'numeric',numericFormat: {pattern: '0.0'}},
    {data:'data7',type:'numeric',numericFormat: {pattern: '0.0'}},
    {data:'data8',type:'numeric',numericFormat: {pattern: '0.0'}},
    {data:'data9',type:'numeric',numericFormat: {pattern: '0.0'}},
    {data:'data10',type:'numeric',numericFormat: {pattern: '0.0'}},
    {data:'data11',type:'numeric',numericFormat: {pattern: '0.0'}},
    {data:'data12',type:'numeric',numericFormat: {pattern: '0.0'}},
    {data:'dataNextYear',type:'numeric',numericFormat: {pattern: '0.0'},readOnly: true}
  ],
}

onMounted(()=>{
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    //初始化axios共通設定
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    axios.defaults.baseURL = 'getDataAPI';
    axios.get("/api/wbsprofit").then(res => {

      let mergeCells = [];
      wbsTable.value.hotInstance.updateSettings(hotSetting);
      wbsTable.value.hotInstance.updateData(res.data);
      for(let i=0; i<res.data.length; i=i+2){
        mergeCells.push({ row: i, col: 0, rowspan: 2, colspan: 1 });
      }
      wbsTable.value.hotInstance.updateSettings({'mergeCells': mergeCells});
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
    let mergeCells = [];
    for(let i=0; i<res.data.length; i=i+2){
        mergeCells.push({ row: i, col: 0, rowspan: 2, colspan: 1 });
      }
    wbsTable.value.hotInstance.updateSettings({'mergeCells': mergeCells});
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
</script>
<style src="handsontable/dist/handsontable.full.css">
</style>